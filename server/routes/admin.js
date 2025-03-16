import express from 'express';
import { auth, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

// Protect all admin routes
router.use(auth, isAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenue = await Order.aggregate([
      {
        $match: { 
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get total users and sellers
    const [totalUsers, totalSellers] = await Promise.all([
      User.countDocuments({ profileType: 'consumer' }),
      User.countDocuments({ profileType: 'seller' })
    ]);

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('items.product', 'name price');

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock price')
      .limit(5);

    // Get order stats by status
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily revenue for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalOrders,
      revenue: revenue[0]?.total || 0,
      totalUsers,
      totalSellers,
      totalProducts,
      recentOrders,
      lowStockProducts,
      orderStats: orderStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      dailyRevenue
    });

  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Error getting admin stats' });
  }
});

// Get all users (excluding admins)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ 
      profileType: { $in: ['consumer', 'seller'] } 
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update user status (block/unblock)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: req.body.isBlocked },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ 
      profileType: 'seller' 
    }).select('-password');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers' });
  }
});

// Update seller approval status
router.patch('/sellers/:id/approve', async (req, res) => {
  try {
    const seller = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller status' });
  }
});

// Category management
router.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router; 