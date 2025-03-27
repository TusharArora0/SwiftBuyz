import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  CircularProgress,
  Zoom,
  Fade,
  Paper
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, LocalShipping as ShippingIcon } from '@mui/icons-material';

const OrderSuccessAnimation = ({ open, onAnimationComplete }) => {
  const [animationStage, setAnimationStage] = useState('loading'); // loading, success, complete
  
  useEffect(() => {
    if (open) {
      console.log('OrderSuccessAnimation opened');
      
      // Show loading spinner for 1.5 seconds, then show success animation
      const timer = setTimeout(() => {
        console.log('Showing success animation');
        setAnimationStage('success');
      }, 1500);
      
      // After showing success animation for 2.5 seconds, trigger completion callback
      const completeTimer = setTimeout(() => {
        console.log('Animation complete, calling onAnimationComplete');
        setAnimationStage('complete');
        if (onAnimationComplete && typeof onAnimationComplete === 'function') {
          onAnimationComplete();
        } else {
          console.error('onAnimationComplete is not a valid function', onAnimationComplete);
        }
      }, 4000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setAnimationStage('loading');
    }
  }, [open, onAnimationComplete]);
  
  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      style={{ zIndex: 9999 }}
      PaperProps={{
        sx: { 
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: 24,
          position: 'relative'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6, px: 4, overflow: 'hidden' }}>
        {/* Animated background elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          opacity: animationStage === 'success' ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}>
          {/* Confetti-like elements */}
          {[...Array(20)].map((_, i) => (
            <Box 
              key={i}
              sx={{
                position: 'absolute',
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                backgroundColor: ['#FFC107', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'][Math.floor(Math.random() * 5)],
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.7,
                animation: `confetti-fall ${Math.random() * 3 + 2}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                '@keyframes confetti-fall': {
                  '0%': { transform: 'translateY(-100px) rotate(0deg)' },
                  '100%': { transform: 'translateY(500px) rotate(360deg)' }
                }
              }}
            />
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 250,
          position: 'relative',
          zIndex: 1
        }}>
          {animationStage === 'loading' && (
            <Fade in={animationStage === 'loading'}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={80} 
                  thickness={4} 
                  sx={{ 
                    mb: 3,
                    animation: 'pulse 1.5s infinite ease-in-out'
                  }} 
                />
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ animation: 'fadeInUp 0.5s ease-out' }}
                >
                  Processing your order...
                </Typography>
              </Box>
            </Fade>
          )}

          {animationStage === 'success' && (
            <Zoom in={animationStage === 'success'} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    bgcolor: 'success.light', 
                    borderRadius: '50%', 
                    p: 2, 
                    display: 'inline-flex',
                    mb: 3,
                    boxShadow: '0 0 30px rgba(76, 175, 80, 0.7)',
                    animation: 'pulse 1.5s infinite ease-in-out'
                  }}
                >
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ 
                      fontSize: 100, 
                      animation: 'bounce 1.5s ease infinite'
                    }} 
                  />
                </Paper>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ animation: 'fadeInUp 0.5s ease-out' }}
                >
                  Congratulations!
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary"
                  fontWeight="medium"
                  gutterBottom
                  sx={{ animation: 'fadeInUp 0.5s ease-out 0.2s', animationFillMode: 'both' }}
                >
                  Your Order Has Been Placed Successfully!
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 2,
                  animation: 'fadeInUp 0.5s ease-out 0.4s', 
                  animationFillMode: 'both'
                }}>
                  <ShippingIcon color="primary" sx={{ mr: 1 }} />
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                  >
                    Preparing your package for delivery
                  </Typography>
                </Box>
              </Box>
            </Zoom>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessAnimation;