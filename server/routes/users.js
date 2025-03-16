import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Debug middleware for user routes
router.use((req, res, next) => {
  console.log('User route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body,
    userId: req.userId
  });
  next();
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add/Update address
router.post('/address', auth, async (req, res) => {
  try {
    const { address } = req.body;
    console.log('Adding address:', address);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize addresses array if it doesn't exist
    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    // Add the new address
    user.addresses.push(address);

    // If this is the first address or it's marked as default
    if (user.addresses.length === 1 || address.isDefault) {
      // Make this address the default
      user.addresses[user.addresses.length - 1].isDefault = true;
      
      // Set all other addresses to non-default
      user.addresses.forEach((addr, i) => {
        if (i !== user.addresses.length - 1) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();

    res.json({
      message: 'Address added successfully',
      user: {
        ...user.toObject(),
        password: undefined
      }
    });

  } catch (error) {
    console.error('Address save error:', error);
    res.status(500).json({ message: 'Error saving address' });
  }
});

// Delete address
router.delete('/address/:index', auth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const user = await User.findById(req.userId);

    if (!user || !user.addresses || index >= user.addresses.length) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Remove the address
    user.addresses.splice(index, 1);

    // If we removed the default address and there are other addresses
    if (user.addresses.length > 0) {
      // Make the first address the default
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: 'Address deleted successfully',
      user: {
        ...user.toObject(),
        password: undefined
      }
    });

  } catch (error) {
    console.error('Address deletion error:', error);
    res.status(500).json({ message: 'Error deleting address' });
  }
});

// Get count of all users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'customer' });
    res.json({ count });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'Error counting users' });
  }
});

// Get count of all sellers
router.get('/sellers/count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'seller' });
    res.json({ count });
  } catch (error) {
    console.error('Error counting sellers:', error);
    res.status(500).json({ message: 'Error counting sellers' });
  }
});

export default router; 