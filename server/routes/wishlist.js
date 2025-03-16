import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching wishlist for user:', req.userId);
    
    const user = await User.findById(req.userId)
      .populate('wishlist')
      .select('wishlist');
    
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found wishlist:', user.wishlist);
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ 
      message: 'Error fetching wishlist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isWishlisted = user.wishlist.includes(req.params.productId);
    res.json({ isWishlisted });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({ 
      message: 'Error checking wishlist status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add item to wishlist
router.post('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }

    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ 
      message: 'Error adding to wishlist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove item from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

export default router; 