import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Zoom,
  Fade,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to get order data from location state
    if (location.state) {
      console.log('Order confirmation data received from location state:', location.state);
      setOrderData(location.state);
      setLoading(false);
      return;
    }
    
    // If not in location state, try to get from sessionStorage
    try {
      const storedData = sessionStorage.getItem('orderConfirmationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Order confirmation data retrieved from sessionStorage:', parsedData);
        setOrderData(parsedData);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error getting data from sessionStorage:', error);
    }
    
    // If we still don't have the data, show error and redirect
    console.error('No order data found in location state or sessionStorage', {
      locationState: location.state,
      locationPathname: location.pathname,
      locationSearch: location.search,
      sessionStorageData: sessionStorage.getItem('orderConfirmationData')
    });
    
    // Show alert before redirecting
    alert('Order confirmation data not found. You will be redirected to the home page.');
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
    
  }, [location, navigate]);

  // When component unmounts or after successful display, clear the session storage
  useEffect(() => {
    return () => {
      if (orderData) {
        // Only clear if we successfully loaded the data
        sessionStorage.removeItem('orderConfirmationData');
      }
    };
  }, [orderData]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Order information not found. Please check your orders in your account.
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Return to Home
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/profile/orders"
            startIcon={<ReceiptIcon />}
          >
            View Orders
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Success banner with animation */}
        <Fade in={true} timeout={800}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bgcolor: 'success.main', 
              color: 'white',
              py: 1.5,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <CheckCircleIcon sx={{ animation: 'pulse 1.5s infinite' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Order Placed Successfully
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ mt: 4, textAlign: 'center', mb: 5 }}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <CheckCircleIcon 
              color="success" 
              sx={{ 
                fontSize: 80, 
                mb: 2,
                animation: 'bounce 1s ease infinite'
              }} 
            />
          </Zoom>
          <Fade in={true} timeout={1000}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Thank You For Your Order!
            </Typography>
          </Fade>
          <Fade in={true} timeout={1500}>
            <Typography variant="subtitle1" color="text.secondary">
              Your order has been placed and is being processed
            </Typography>
          </Fade>
          <Fade in={true} timeout={2000}>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="body1">
                Order Number:
              </Typography>
              <Chip 
                label={`#${orderData.orderNumber}`} 
                color="primary" 
                sx={{ fontWeight: 'bold', fontSize: '1rem' }} 
              />
            </Box>
          </Fade>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Placed on {formatDate(orderData.orderDate)}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="primary" />
              Order Summary
            </Typography>
            
            <Paper variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              <List sx={{ width: '100%' }}>
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item, index) => (
                    <Box key={index}>
                      <ListItem alignItems="flex-start" sx={{ px: 2 }}>
                        <ListItemAvatar>
                          <Avatar 
                            variant="rounded" 
                            src={item.image || PLACEHOLDER_IMAGE} 
                            alt={item.name || 'Product'}
                            sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {item.name || 'Product'}
                            </Typography>
                          }
                          secondary={
                            <Box component="div">
                              <Typography variant="body2" component="span" color="text.secondary">
                                Quantity: {item.quantity || 1}
                              </Typography>
                              {item.discount > 0 && (
                                <Typography variant="body2" component="span" color="error" sx={{ display: 'block' }}>
                                  Discount: {item.discount}% off
                                </Typography>
                              )}
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          {item.discount > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              {formatPrice(item.price * item.quantity)}
                            </Typography>
                          )}
                          <Typography variant="subtitle1" fontWeight="medium">
                            {formatPrice(item.discount > 0 
                              ? item.price * item.quantity * (1 - item.discount/100) 
                              : item.price * item.quantity)}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < orderData.items.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText 
                      primary="No items found" 
                      secondary="There seems to be an issue with the order data"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShippingIcon color="primary" />
                Shipping Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  {orderData.shippingAddress.street}
                </Typography>
                <Typography variant="body2">
                  {`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}`}
                </Typography>
                <Typography variant="body2">
                  {orderData.shippingAddress.country}
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon color="primary" />
                Payment Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body1">
                  Payment Method: {orderData.paymentMethod}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {orderData.paymentMethod === 'Cash on Delivery' 
                    ? 'You will pay when your order is delivered' 
                    : 'Your payment has been processed'}
                </Typography>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper',
                position: 'sticky',
                top: 20
              }}
            >
              <Typography variant="h6" gutterBottom>
                Order Total
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Total Amount</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatPrice(orderData.totalAmount)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estimated Delivery
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/"
                  startIcon={<HomeIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/profile"
                  state={{ activeTab: 2 }}
                  startIcon={<ShoppingBagIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  View My Orders
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation; 