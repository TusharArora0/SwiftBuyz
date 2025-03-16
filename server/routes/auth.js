import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

// Debug logging
router.use((req, res, next) => {
  console.log('Auth route accessed:', {
    method: req.method,
    path: req.url,
    body: req.body
  });
  next();
});

const debugLog = (req, msg) => {
  console.log(`[${req.method}] ${req.path} - ${msg}`);
};

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working' });
});

// Add this near the top of your routes
router.get('/test-db', async (req, res) => {
  try {
    // Test MongoDB connection
    const collections = await mongoose.connection.db.collections();
    const dbName = mongoose.connection.db.databaseName;
    
    res.json({
      status: 'success',
      message: 'Database connection is working',
      database: dbName,
      collections: collections.map(c => c.collectionName)
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Add this at the top of your routes
router.use((req, res, next) => {
  console.log('Auth Route Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    body: req.method === 'POST' ? req.body : undefined,
    headers: {
      'content-type': req.headers['content-type'],
      'accept': req.headers['accept']
    }
  });
  next();
});

// Register
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit with data:', {
    ...req.body,
    password: req.body.password ? '[PRESENT]' : '[MISSING]'
  });
  
  try {
    const { name, email, password, profileType, shopName } = req.body;

    // Validate input
    if (!name || !email || !password || !profileType) {
      console.log('Missing required fields:', {
        name: !!name,
        email: !!email,
        password: !!password,
        profileType: !!profileType
      });
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'email', 'password', 'profileType'],
        received: Object.keys(req.body)
      });
    }

    // Additional validation for seller
    if (profileType === 'seller' && !shopName) {
      console.log('Shop name missing for seller account');
      return res.status(400).json({
        message: 'Shop name is required for seller accounts'
      });
    }

    // Check if user exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    console.log('Creating new user object...');
    const userData = {
      name,
      email,
      password: hashedPassword,
      profileType,
      ...(profileType === 'seller' && shopName && { shopName })
    };

    console.log('User data to be saved:', { ...userData, password: '[HIDDEN]' });

    // Save user to database
    const user = new User(userData);
    await user.save();
    console.log('User saved successfully with ID:', user._id);

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileType: user.profileType,
        ...(user.shopName && { shopName: user.shopName })
      }
    });

  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Send appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        details: 'This email is already registered'
      });
    }

    res.status(500).json({ 
      message: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileType: user.profileType,
        shopName: user.shopName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this test endpoint
router.post('/test-register', (req, res) => {
  console.log('Test register endpoint hit');
  res.json({
    message: 'Test register endpoint working',
    receivedData: {
      ...req.body,
      password: req.body.password ? '[PRESENT]' : '[MISSING]'
    }
  });
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save the reset code to the user
    user.resetCode = resetCode;
    user.resetExpires = resetExpires;
    await user.save();

    // Send email with reset code
    try {
      await sendPasswordResetEmail(email, resetCode);
      console.log('Reset code email sent successfully');
      
      // In development mode or if email is not configured, return the reset code for testing
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({ 
          message: 'Reset code sent to your email',
          resetCode: resetCode 
        });
      }
      
      return res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // If in development mode, still return the code even if email fails
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({ 
          message: 'Failed to send email, but here is your reset code (development mode only)',
          resetCode: resetCode 
        });
      }
      
      return res.status(500).json({ message: 'Failed to send reset code email. Please try again later.' });
    }
  } catch (error) {
    console.error('Server error in forgot-password route:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify reset code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Find user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if reset code exists and is valid
    if (!user.resetCode || !user.resetExpires) {
      return res.status(400).json({ message: 'No reset code found for this email' });
    }

    if (user.resetExpires < Date.now()) {
      // Clear expired reset code
      user.resetCode = null;
      user.resetExpires = null;
      await user.save();
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    res.json({ message: 'Reset code verified successfully' });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    // Find user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if reset code exists and is valid
    if (!user.resetCode || !user.resetExpires) {
      return res.status(400).json({ message: 'No reset code found for this email' });
    }

    if (user.resetExpires < Date.now()) {
      // Clear expired reset code
      user.resetCode = null;
      user.resetExpires = null;
      await user.save();
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear reset code
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 