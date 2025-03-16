import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    let decoded;
    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET?.slice(0, 10) + '...');
      console.log('Token:', token.slice(0, 20) + '...');
      
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    req.userId = user._id.toString();
    
    console.log('Auth middleware:', {
      userId: req.userId,
      userObjectId: user._id
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Please authenticate',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    console.log('Checking seller status:', {
      profileType: req.user.profileType,
      userId: req.userId
    });

    if (req.user.profileType !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }
    next();
  } catch (error) {
    console.error('Seller check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.profileType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 