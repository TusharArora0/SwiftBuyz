import express from 'express';
import Product from '../models/Product.js';
import { auth, isSeller } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

const router = express.Router();

// IMPORTANT: Place the deals route BEFORE any routes with URL parameters
// Get deals
router.get('/deals', async (req, res) => {
  try {
    const deals = await Product.find({
      discount: { 
        $gt: 0,
        $lte: 75
      },
      stock: { $gt: 0 }
    })
    .sort({ discount: -1 })
    .populate('seller', 'name shopName')
    .limit(12);

    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Error fetching deals' });
  }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Product.find({ stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .populate('seller', 'name shopName')
      .limit(12);

    res.json(newArrivals);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: 'Error fetching new arrivals' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = new RegExp(category, 'i'); // Case-insensitive search
    }

    const products = await Product.find(query).populate('seller', 'name');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get seller's products
router.get('/seller/:sellerId', auth, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    console.log('Fetching products for seller:', sellerId);

    const products = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate('seller', 'name shopName');

    console.log(`Found ${products.length} products for seller ${sellerId}`);
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Error fetching seller products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name shopName');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (requires auth)
router.post('/', auth, isSeller, async (req, res) => {
  try {
    console.log('Creating product with seller ID:', req.userId);
    console.log('Request user:', req.user);
    
    const product = new Product({
      ...req.body,
      seller: req.user._id // Use req.user._id instead of req.userId
    });
    
    const savedProduct = await product.save();
    console.log('Created product:', {
      id: savedProduct._id,
      name: savedProduct.name,
      sellerId: savedProduct.seller.toString()
    });
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Update product (requires auth)
router.put('/:id', auth, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the seller owns this product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (requires auth)
router.delete('/:id', auth, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the seller owns this product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Get seller stats
router.get('/seller/:sellerId/stats', auth, async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    // Get products count
    const productsCount = await Product.countDocuments({ seller: sellerId });

    // Get all products for this seller
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    // Get all orders containing any of these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    }).populate({
      path: 'items.product',
      select: 'seller price'
    });

    // Filter orders to only include those with seller's products
    const sellerOrders = orders.filter(order => 
      order.items.some(item => 
        item.product?.seller?.toString() === sellerId
      )
    );

    let totalRevenue = 0;
    let uniqueCustomers = new Set();
    let totalDeliveredOrders = 0;

    // Initialize status counters
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    sellerOrders.forEach(order => {
      // Count by status
      if (order.status in statusCounts) {
        statusCounts[order.status]++;
      }

      // Calculate revenue from delivered orders
      if (order.status === 'delivered') {
        totalDeliveredOrders++;
        const orderRevenue = order.items.reduce((sum, item) => {
          if (item.product?.seller?.toString() === sellerId) {
            return sum + (item.price * item.quantity);
          }
          return sum;
        }, 0);
        totalRevenue += orderRevenue;
      }

      // Track unique customers
      if (order.user) {
        uniqueCustomers.add(order.user.toString());
      }
    });

    const stats = {
      totalProducts: productsCount,
      totalOrders: sellerOrders.length,
      totalRevenue,
      totalCustomers: uniqueCustomers.size,
      // Order status counts
      pendingOrders: statusCounts.pending,
      processingOrders: statusCounts.processing,
      shippedOrders: statusCounts.shipped,
      deliveredOrders: statusCounts.delivered,
      cancelledOrders: statusCounts.cancelled,
      // Performance metrics
      orderCompletionRate: totalDeliveredOrders ? 
        ((totalDeliveredOrders / sellerOrders.length) * 100).toFixed(1) : 0,
      averageOrderValue: totalDeliveredOrders ? 
        (totalRevenue / totalDeliveredOrders).toFixed(2) : 0
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ 
      message: 'Error fetching seller stats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      userName: req.user.name
    };

    product.reviews.push(review);
    product.calculateRating();
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Get count of all products
router.get('/count', async (req, res) => {
  try {
    const count = await Product.countDocuments({ stock: { $gt: 0 } });
    res.json({ count });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'Error counting products' });
  }
});

// Get count of all categories
router.get('/categories/count', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const count = categories.length;
    res.json({ count });
  } catch (error) {
    console.error('Error counting categories:', error);
    res.status(500).json({ message: 'Error counting categories' });
  }
});

export default router; 