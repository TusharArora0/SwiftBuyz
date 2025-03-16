import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    console.log('OrderSuccess mounted with order:', order); // Debug log
    
    // If no order data, redirect to home after a short delay
    if (!order) {
      const timer = setTimeout(() => {
        console.log('No order data, redirecting to home'); // Debug log
        navigate('/', { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  // Show loading state while checking order data
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info">
          Checking order information...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: green[500],
              mb: 2,
              animation: 'bounce 1s ease'
            }} 
          />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Thank You for Your Order!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Order #{order._id?.slice(-6) || 'Processing'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {order.createdAt ? formatDate(order.createdAt) : new Date().toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            {order.items.map((item, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <Typography>
                  {item.product.name} × {item.quantity}
                </Typography>
                <Typography>
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontWeight: 'bold',
              p: 1
            }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Details
          </Typography>
          <Typography>
            {order.shippingAddress.street}
          </Typography>
          <Typography>
            {`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`}
          </Typography>
          <Typography>
            {order.shippingAddress.country}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          mt: 4 
        }}>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate('/profile', { state: { activeTab: 2 }})}
            sx={{ 
              minWidth: 200,
              bgcolor: green[500],
              '&:hover': {
                bgcolor: green[700]
              }
            }}
          >
            View Order History
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ minWidth: 200 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 