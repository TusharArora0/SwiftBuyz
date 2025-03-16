import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import ChatMessage from '../models/ChatMessage.js';
import { handleChatMessage } from '../controllers/chatController.js';

const router = express.Router();

// Get chat history (authenticated)
router.get('/history', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.userId })
      .sort('-createdAt')
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Send message (authenticated)
router.post('/message', auth, handleChatMessage);

// Public endpoint for non-authenticated users
router.post('/public', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid message format' });
    }
    
    // Import the getResponse function directly
    const { getResponse } = await import('../controllers/chatController.js');
    const response = getResponse(message);
    
    // Add a small delay to simulate thinking
    setTimeout(() => {
      res.json({ response });
    }, 500);
    
  } catch (error) {
    console.error('Public chat error:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
});

export default router; 