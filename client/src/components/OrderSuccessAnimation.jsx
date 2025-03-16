import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  CircularProgress,
  Zoom,
  Fade
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const OrderSuccessAnimation = ({ open, onAnimationComplete }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  
  useEffect(() => {
    if (open) {
      // Show loading spinner for 2 seconds, then show checkmark
      const timer = setTimeout(() => {
        setShowCheckmark(true);
      }, 2000);
      
      // After showing checkmark for 1.5 seconds, trigger completion callback
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, 3500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowCheckmark(false);
    }
  }, [open, onAnimationComplete]);
  
  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: 24
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 200
        }}>
          {!showCheckmark ? (
            <Fade in={!showCheckmark}>
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
          ) : (
            <Zoom in={showCheckmark} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  bgcolor: 'success.light', 
                  borderRadius: '50%', 
                  p: 2, 
                  display: 'inline-flex',
                  mb: 3,
                  boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
                }}>
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ 
                      fontSize: 100, 
                      animation: 'bounce 1s ease'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ animation: 'fadeInUp 0.5s ease-out' }}
                >
                  Order Placed Successfully!
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary"
                  sx={{ animation: 'fadeInUp 0.5s ease-out 0.2s', animationFillMode: 'both' }}
                >
                  Thank you for your purchase
                </Typography>
              </Box>
            </Zoom>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessAnimation; 