import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Add debug logging
    console.log('Creating token with secret length:', process.env.JWT_SECRET?.length);
    
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Verify the token immediately to ensure it's valid
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(500).json({ message: 'Error generating auth token' });
    }

    return res.json({
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add registration endpoint
export const register = async (req, res) => {
  try {
    const { name, email, password, profileType, shopName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileType,
      ...(shopName && { shopName })
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 