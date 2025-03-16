import express from 'express';
import Order from '../models/Order.js';
import { auth, isSeller } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    
    console.log('Creating order for user:', req.userId);
    console.log('Order data received:', JSON.stringify(req.body, null, 2));

    // Validate stock and update product quantities
    for (const item of items) {
      console.log('Processing item:', item);
      
      try {
        const product = await Product.findById(item.product);
        if (!product) {
          console.log(`Product not found: ${item.product}`);
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }
        
        console.log(`Product found: ${product.name}, stock: ${product.stock}, requested: ${item.quantity}`);
        
        if (product.stock < item.quantity) {
          console.log(`Not enough stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`);
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Available: ${product.stock}`
          });
        }
        
        product.stock -= item.quantity;
        await product.save();
        console.log(`Updated stock for ${product.name} to ${product.stock}`);
      } catch (itemError) {
        console.error('Error processing item:', itemError);
        return res.status(500).json({ message: 'Error processing order item', details: itemError.message });
      }
    }

    console.log('Creating order with data:', {
      user: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    const order = new Order({
      user: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });

    await order.save();
    console.log('Order saved successfully:', order._id);

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update order status (seller only)
router.patch('/:id/status', auth, isSeller, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // First verify that this order contains products from this seller
    const order = await Order.findById(orderId)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if any product in the order belongs to this seller
    const hasSellerProduct = order.items.some(item => 
      item.product.seller.toString() === req.user.id
    );

    if (!hasSellerProduct) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    res.json([]);  // Placeholder response
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get seller's orders
router.get('/seller/:sellerId', auth, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    console.log('Fetching orders for seller:', sellerId);

    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    // Find orders containing any of these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate('user', 'name email')
    .populate('items.product')
    .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for seller ${sellerId}`);
    
    // Filter out items that don't belong to this seller
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => 
        productIds.includes(item.product._id)
      )
    }));

    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Error fetching seller orders' });
  }
});

// Get user's orders
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.userId);
    
    const orders = await Order.find({ user: req.userId })
      .populate({
        path: 'items.product',
        select: 'name images price category'
      })
      .sort('-createdAt');
    
    console.log(`Found ${orders.length} orders for user ${req.userId}`);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

export default router; 