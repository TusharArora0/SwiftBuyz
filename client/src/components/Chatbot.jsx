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
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL, fetchWithAuth } from '../utils/apiConfig';

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
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/chat/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
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
      const endpoint = user 
        ? `${API_URL}/chat/message`
        : `${API_URL}/chat/public`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ message: userMessage.content })
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

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 999,
      '& .chat-container': {
        position: 'absolute',
        bottom: '70px',
        right: 0,
      }
    }}>
      <Collapse in={isOpen} timeout="auto" className="chat-container">
        <Paper
          elevation={3}
          sx={{
            width: 320,
            height: 450,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Customer Support</Typography>
            <Box>
              <IconButton 
                size="small" 
                onClick={handleResetChat} 
                sx={{ color: 'white', mr: 1 }}
                title="Reset conversation"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setIsOpen(false)} 
                sx={{ color: 'white' }}
                title="Close chat"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {!isAuthenticated && (
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={handleLogin}
                  >
                    <LoginIcon />
                  </IconButton>
                }
              >
                Log in for personalized support
              </Alert>
            )}
            
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {message.type === 'bot' && (
                  <Avatar
                    sx={{
                      bgcolor: '#1a237e',
                      width: 32,
                      height: 32,
                    }}
                  >
                    CS
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1,
                    px: 2,
                    maxWidth: '70%',
                    bgcolor: message.type === 'user' ? '#1a237e' : '#f5f5f5',
                    color: message.type === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {/* Quick option buttons */}
            {showOptions && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  How can I help you today?
                </Typography>
                <Stack spacing={1}>
                  {quickOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      startIcon={option.icon}
                      onClick={() => handleQuickOption(option.query)}
                      sx={{ 
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderColor: '#e0e0e0',
                        '&:hover': { borderColor: '#1a237e', bgcolor: 'rgba(26, 35, 126, 0.04)' }
                      }}
                    >
                      {option.text}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Follow-up questions */}
            {showFollowUp && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  You might also want to know:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {followUpQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      onClick={() => handleFollowUpClick(question)}
                      sx={{ 
                        mb: 1, 
                        borderColor: '#e0e0e0',
                        '&:hover': { borderColor: '#1a237e', bgcolor: 'rgba(26, 35, 126, 0.04)' }
                      }}
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: '#1a237e',
                    width: 32,
                    height: 32,
                  }}
                >
                  CS
                </Avatar>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: 8 }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <IconButton 
                type="submit" 
                color="primary" 
                disabled={!input.trim() || isTyping}
              >
                <SendIcon />
              </IconButton>
            </form>
          </Box>
        </Paper>
      </Collapse>

      {/* Welcome Tooltip */}
      <Collapse 
        in={showWelcomeTooltip} 
        timeout="auto"
        sx={{ 
          position: 'absolute', 
          bottom: 70, 
          right: 0, 
          width: 250,
          zIndex: 1001,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#e3f2fd',
            border: '1px solid #bbdefb',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              right: 20,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #e3f2fd',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <ChatIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Need help with anything?
              </Typography>
              <Typography variant="body2">
                I'm your virtual assistant. Click here to chat with me!
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 2, right: 2 }}
            onClick={() => {
              setShowWelcomeTooltip(false);
              localStorage.setItem('hasSeenChatWelcome', 'true');
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Collapse>

      {/* Chat Toggle Button - Positioned just under the back-to-top button */}
      <Badge 
        color="error" 
        variant="dot" 
        invisible={!showBadge}
        overlap="circular"
        sx={{ 
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999,
          '& .MuiBadge-badge': { 
            right: 10, 
            top: 10,
            width: 12,
            height: 12,
            borderRadius: '50%',
            animation: showBadge ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.8)', opacity: 0.9 },
              '50%': { transform: 'scale(1.1)', opacity: 1 },
              '100%': { transform: 'scale(0.8)', opacity: 0.9 },
            },
          } 
        }}
      >
        <Fab
          color="primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="chat"
          sx={{
            bgcolor: '#1a237e',
            '&:hover': { bgcolor: '#0d47a1' },
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            height: 56,
            width: 56,
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Badge>
    </Box>
  );
};

export default Chatbot; 