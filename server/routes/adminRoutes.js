import express from 'express';
import { deleteUser } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add this route to your existing admin routes
router.delete('/users/:id', protect, admin, deleteUser);

export default router; 