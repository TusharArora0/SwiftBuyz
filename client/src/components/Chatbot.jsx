import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Collapse,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  ShoppingBag as OrderIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [showBadge, setShowBadge] = useState(true);
  const messagesEndRef = useRef(null);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showOptions, showFollowUp]);

  // Hide badge when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
    }
  }, [isOpen]);

  // Load chat history when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen && messages.length === 0) {
      fetchChatHistory();
    } else if (isOpen && messages.length === 0) {
      // Initial greeting for all users
      setMessages([
        {
          type: 'bot',
          content: `Hi${user ? ` ${user.name}` : ''}! How can I help you today?`,
          timestamp: new Date(),
        },
      ]);
      // Show quick options after greeting
      setShowOptions(true);
    }
  }, [isOpen, isAuthenticated, user]);

  // Show welcome tooltip after a delay
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenChatWelcome');
    
    if (!hasSeenWelcome && !isOpen) {
      const timer = setTimeout(() => {
        setShowWelcomeTooltip(true);
        // Hide after 8 seconds
        setTimeout(() => {
          setShowWelcomeTooltip(false);
          localStorage.setItem('hasSeenChatWelcome', 'true');
        }, 8000);
      }, 3000); // Show after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsTyping(true);
      const response = await fetch('https://swiftbuyz-five.vercel.app/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          // Convert history to chat format
          const formattedMessages = [];
          data.forEach(msg => {
            formattedMessages.push({
              type: 'user',
              content: msg.message,
              timestamp: new Date(msg.createdAt),
            });
            formattedMessages.push({
              type: 'bot',
              content: msg.response,
              timestamp: new Date(msg.createdAt),
            });
          });
          
          // Only show last 10 messages to avoid cluttering
          const recentMessages = formattedMessages.slice(-10);
          setMessages(recentMessages);
        } else {
          // No history, show greeting
          setMessages([
            {
              type: 'bot',
              content: `Hi${user ? ` ${user.name}` : ''}! How can I help you today?`,
              timestamp: new Date(),
            },
          ]);
          // Show quick options after greeting
          setShowOptions(true);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate follow-up questions based on the last bot response
  const generateFollowUpQuestions = (lastMessage) => {
    const lowercaseMessage = lastMessage.toLowerCase();
    
    if (lowercaseMessage.includes('order') || lowercaseMessage.includes('track')) {
      return [
        "How long does shipping take?",
        "Can I change my delivery address?",
        "What if my order is delayed?"
      ];
    } else if (lowercaseMessage.includes('return') || lowercaseMessage.includes('refund')) {
      return [
        "How do I package my return?",
        "How long do refunds take?",
        "Can I exchange instead of return?"
      ];
    } else if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('pay')) {
      return [
        "Is my payment information secure?",
        "Can I use multiple payment methods?",
        "Do you offer installment payments?"
      ];
    } else if (lowercaseMessage.includes('shipping')) {
      return [
        "Do you ship internationally?",
        "How can I track my package?",
        "What are the shipping costs?"
      ];
    } else {
      return [
        "Tell me about your return policy",
        "What payment methods do you accept?",
        "How can I track my order?"
      ];
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowOptions(false); // Hide options when user sends a message
    setShowFollowUp(false); // Hide any existing follow-up questions

    try {
      // Use different endpoints based on authentication status
      const endpoint = isAuthenticated 
        ? 'https://swiftbuyz-five.vercel.app/api/chat/message' 
        : 'https://swiftbuyz-five.vercel.app/api/chat/public';
      
      const headers = {
        'Content-Type': 'application/json',
        ...(isAuthenticated && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = {
          type: 'bot',
          content: data.response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Generate follow-up questions based on the bot's response
        const questions = generateFollowUpQuestions(data.response);
        setFollowUpQuestions(questions);
        
        // Show follow-up questions after a short delay
        setTimeout(() => {
          setShowFollowUp(true);
        }, 1000);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickOption = (option) => {
    // Set the input field to the selected option
    setInput(option);
    // Submit the message
    handleSend();
  };

  const handleFollowUpClick = (question) => {
    setInput(question);
    handleSend();
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleResetChat = () => {
    setMessages([
      {
        type: 'bot',
        content: `Hi${user ? ` ${user.name}` : ''}! How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
    setShowOptions(true);
    setShowFollowUp(false);
  };

  // Quick option buttons that appear after greeting
  const quickOptions = [
    { text: "Track my order", icon: <OrderIcon fontSize="small" />, query: "Track my order" },
    { text: "Shipping info", icon: <ShippingIcon fontSize="small" />, query: "Shipping information" },
    { text: "Payment methods", icon: <PaymentIcon fontSize="small" />, query: "Payment methods" },
    { text: "Return policy", icon: <HelpIcon fontSize="small" />, query: "Return policy" },
  ];

  // Simple toggle function for opening/closing the chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowBadge(false);
  };

  // Help button handlers
  const handleHelp = () => {
    navigate('/faq');
  };

  const handleContact = () => {
    window.location.href = 'mailto:support@swiftbuyz.com';
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      {/* Chat bubble button */}
      <Badge color="error" variant="dot" invisible={!showBadge}>
        <Fab 
          color="primary" 
          onClick={toggleChat}
          sx={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Badge>

      {/* Chat window */}
      <Collapse in={isOpen} sx={{ position: 'absolute', bottom: 80, right: 0 }}>
        <Paper
          elevation={6}
          sx={{
            width: { xs: 300, sm: 350 },
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'white', mr: 1 }}>
                <ChatIcon color="primary" />
              </Avatar>
              <Typography variant="h6">Support</Typography>
            </Box>
            <IconButton onClick={toggleChat} color="inherit" size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat body - maintenance message */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflowY: 'hidden',
              bgcolor: '#f9f9f9',
            }}
          >
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ 
                mb: 3, 
                width: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Chat Support Unavailable
              </Typography>
              <Typography variant="body2">
                Our chat support is currently undergoing maintenance.
              </Typography>
            </Alert>
            
            <Typography variant="body1" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              Please use one of the following options to get help:
            </Typography>
            
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Button 
                variant="contained" 
                onClick={handleHelp}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Visit FAQ Page
              </Button>
              <Button 
                variant="outlined"
                onClick={handleContact}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Email Support
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default Chatbot; 