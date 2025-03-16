import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import wishlistRoutes from './routes/wishlist.js';

// Load environment variables before any other imports
dotenv.config();

// Verify environment variables are loaded
console.log('Environment check:');
console.log('- PORT:', process.env.PORT);
console.log('- JWT_SECRET length:', process.env.JWT_SECRET?.length);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://swift-buyz.vercel.app',
    'https://swift-buyz-27h7lc2ht-tushararora0s-projects.vercel.app',
    'https://swiftbuyz-five.vercel.app',
    'https://swiftbuyz-1belqlz6y-tushararora0s-projects.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process on Vercel
    console.error('Continuing despite MongoDB connection error');
  });

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Print registered routes
console.log('Mounted routes:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Routes registered directly on the app
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    // Router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const prefix = middleware.regexp.toString().includes('auth') ? '/api/auth' : 
                      middleware.regexp.toString().includes('products') ? '/api/products' :
                      middleware.regexp.toString().includes('orders') ? '/api/orders' :
                      middleware.regexp.toString().includes('admin') ? '/api/admin' :
                      middleware.regexp.toString().includes('wishlist') ? '/api/wishlist' : '';
        console.log(`${Object.keys(handler.route.methods)} ${prefix}${handler.route.path}`);
      }
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the auth routes at http://localhost:${PORT}/api/auth/test`);
  });
}

// Export the Express app for Vercel
export default app; 