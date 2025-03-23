import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import OrderSuccessAnimation from '../components/OrderSuccessAnimation';

const steps = [
  { label: 'Shipping Address', icon: <ShippingIcon /> },
  { label: 'Payment Method', icon: <PaymentIcon /> },
  { label: 'Review Order', icon: <ReceiptIcon /> }
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart');
      return;
    }
    
    // Set first default address as selected if available
    if (user.addresses && user.addresses.length > 0) {
      const defaultIndex = user.addresses.findIndex(addr => addr.isDefault);
      if (defaultIndex !== -1) {
        setSelectedAddressIndex(defaultIndex);
      } else {
        setSelectedAddressIndex(0); // Select first address if no default
      }
    }
  }, [user, items, navigate, orderPlaced]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return items.reduce((total, item) => {
      const discount = item.discount ? (item.price * item.quantity * item.discount / 100) : 0;
      return total + discount;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedAddressIndex === -1) {
      setError('Please select a shipping address');
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
    setActiveStep((prevStep) => prevStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === -1) {
      setError('Please select a shipping address');
      return;
    }

    // Validate payment method specific fields
    if (paymentMethod === 'card') {
      // In a real app, you would validate card details here
      // For this demo, we'll just simulate a successful payment
    } else if (paymentMethod === 'upi') {
      // Validate UPI ID
      const upiInput = document.querySelector('input[placeholder="yourname@upi"]');
      if (upiInput && (!upiInput.value || !upiInput.value.includes('@'))) {
        setError('Please enter a valid UPI ID');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const selectedAddress = user.addresses[selectedAddressIndex];
      
      // Map our UI payment methods to server-expected values
      let serverPaymentMethod = 'cod';
      if (paymentMethod === 'card' || paymentMethod === 'upi' || paymentMethod === 'netbanking') {
        serverPaymentMethod = 'online';
      }
      
      // Format items according to the server's expected structure
      // Make sure we're using the correct product ID format
      const orderItems = items.map(item => {
        // Ensure the product ID is a string
        const productId = typeof item._id === 'string' ? item._id : String(item._id);
        
        return {
          product: productId,
          quantity: item.quantity,
          price: item.price
        };
      });

      console.log('Order items:', orderItems);
      
      // Create a properly formatted order object
      const orderData = {
        items: orderItems,
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country || 'India'
        },
        paymentMethod: serverPaymentMethod,
        totalAmount: calculateTotal()
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      // Make sure we have a valid token
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const response = await fetch('https://swiftbuyz-five.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to place order';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          if (errorData.details) {
            console.error('Error details:', errorData.details);
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        throw new Error('Invalid response from server');
      }
      
      console.log('Order placed successfully:', data);

      // Set order placed flag to prevent redirect on cart empty
      setOrderPlaced(true);
      
      // Clear the cart
      dispatch(clearCart());

      // Get payment method display name
      const paymentMethodDisplay = getPaymentMethodDisplay(paymentMethod);

      // Create confirmation data with proper order ID handling
      const orderConfirmationData = {
        orderNumber: data.order && data.order._id ? data.order._id.slice(-6) : 'NEW',
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          image: item.images?.[0]?.url || PLACEHOLDER_IMAGE
        })),
        totalAmount: calculateTotal(),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethodDisplay,
        orderDate: new Date().toISOString()
      };

      // Store confirmation data for later use
      setConfirmationData(orderConfirmationData);
      
      // Also store in sessionStorage in case React Router loses the state
      sessionStorage.setItem('orderConfirmationData', JSON.stringify(orderConfirmationData));
      
      // Show success animation
      setLoading(false);
      setShowSuccessAnimation(true);
      
      // Backup: If animation doesn't trigger navigation, do it directly after 5 seconds
      setTimeout(() => {
        if (showSuccessAnimation) {
          console.log('Animation callback not triggered, navigating directly to confirmation page');
          setShowSuccessAnimation(false);
          navigate('/order-confirmation', {
            state: orderConfirmationData,
            replace: true
          });
        }
      }, 5000);

    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.message || 'An error occurred while placing your order');
      setLoading(false);
    }
  };

  // Helper function to get payment method display name
  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'upi':
        return 'UPI Payment';
      case 'netbanking':
        return 'Net Banking';
      default:
        return 'Unknown Payment Method';
    }
  };

  // Handle completion of success animation
  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    
    console.log('Animation completed, preparing to navigate to confirmation page');
    console.log('Confirmation data:', confirmationData);
    
    // Make sure we have confirmation data before navigating
    if (!confirmationData) {
      console.error('Missing confirmation data');
      navigate('/profile/orders', { replace: true });
      return;
    }
    
    // Navigate to confirmation page with the stored data
    console.log('Navigating to order confirmation page with state:', confirmationData);
    
    // Ensure data is in sessionStorage before navigation
    sessionStorage.setItem('orderConfirmationData', JSON.stringify(confirmationData));
    
    navigate('/order-confirmation', {
      state: confirmationData,
      replace: true
    });
  };

  const renderAddressSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShippingIcon color="primary" />
        Select Shipping Address
      </Typography>
      
      {user?.addresses?.length > 0 ? (
        <Box>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedAddressIndex.toString()}
              onChange={(e) => setSelectedAddressIndex(parseInt(e.target.value))}
            >
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {user.addresses.map((address, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper 
                      elevation={selectedAddressIndex === index ? 3 : 1}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: selectedAddressIndex === index ? '2px solid' : '1px solid',
                        borderColor: selectedAddressIndex === index ? 'primary.main' : 'divider',
                        position: 'relative',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.light',
                          boxShadow: 2
                        }
                      }}
                    >
                      {address.isDefault && (
                        <Chip 
                          label="Default" 
                          color="primary" 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            fontWeight: 'bold'
                          }} 
                        />
                      )}
                      <FormControlLabel
                        value={index.toString()}
                        control={<Radio />}
                        sx={{ width: '100%' }}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {address.street}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {`${address.city}, ${address.state} ${address.zipCode}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.country}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              component={Link}
              to="/profile"
              state={{ activeTab: 1 }}
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2 }}
            >
              Add New Address
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            You don't have any shipping addresses saved. Please add an address to continue.
          </Alert>
          <Button
            variant="contained"
            component={Link}
            to="/profile"
            state={{ activeTab: 1 }}
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            Add New Address
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderPaymentMethod = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentIcon color="primary" />
        Select Payment Method
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={paymentMethod === 'cod' ? 3 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: paymentMethod === 'cod' ? '2px solid' : '1px solid',
              borderColor: paymentMethod === 'cod' ? 'primary.main' : 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              },
              cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('cod')}
          >
            <FormControlLabel 
              value="cod" 
              control={<Radio checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">Cash on Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pay when your order is delivered
                  </Typography>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={paymentMethod === 'card' ? 3 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: paymentMethod === 'card' ? '2px solid' : '1px solid',
              borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              },
              cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('card')}
          >
            <FormControlLabel 
              value="card" 
              control={<Radio checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">Credit/Debit Card</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pay securely with your card
                  </Typography>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={paymentMethod === 'upi' ? 3 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: paymentMethod === 'upi' ? '2px solid' : '1px solid',
              borderColor: paymentMethod === 'upi' ? 'primary.main' : 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              },
              cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('upi')}
          >
            <FormControlLabel 
              value="upi" 
              control={<Radio checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">UPI Payment</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pay using Google Pay, PhonePe, Paytm, etc.
                  </Typography>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={paymentMethod === 'netbanking' ? 3 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: paymentMethod === 'netbanking' ? '2px solid' : '1px solid',
              borderColor: paymentMethod === 'netbanking' ? 'primary.main' : 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              },
              cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('netbanking')}
          >
            <FormControlLabel 
              value="netbanking" 
              control={<Radio checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">Net Banking</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pay directly from your bank account
                  </Typography>
                </Box>
              }
              sx={{ width: '100%' }}
            />
          </Paper>
        </Grid>
      </Grid>

      {paymentMethod === 'card' && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" gutterBottom>
            Card Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Card Number</Typography>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Expiry Date</Typography>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>CVV</Typography>
                <input 
                  type="password" 
                  placeholder="123"
                  maxLength="3"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <Typography variant="body2" sx={{ mb: 1 }}>Name on Card</Typography>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </FormControl>
        </Grid>
      </Grid>
        </Paper>
      )}

      {paymentMethod === 'upi' && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" gutterBottom>
            UPI Details
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Typography variant="body2" sx={{ mb: 1 }}>UPI ID</Typography>
            <input 
              type="text" 
              placeholder="yourname@upi"
              style={{ 
                padding: '12px 16px', 
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '16px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Example: yourname@okaxis, yourname@ybl, etc.
      </Typography>
          </FormControl>
        </Paper>
      )}

      {paymentMethod === 'netbanking' && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Your Bank
      </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  },
                  cursor: 'pointer'
                }}
              >
                <Typography variant="body2">SBI</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  },
                  cursor: 'pointer'
                }}
              >
                <Typography variant="body2">HDFC Bank</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  },
                  cursor: 'pointer'
                }}
              >
                <Typography variant="body2">ICICI Bank</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  },
                  cursor: 'pointer'
                }}
              >
                <Typography variant="body2">Axis Bank</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptIcon color="primary" />
        Review Your Order
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <List sx={{ width: '100%' }}>
              {items.map((item) => (
                <ListItem key={item._id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded" 
                      src={item.images?.[0]?.url || PLACEHOLDER_IMAGE} 
                      alt={item.name}
                      sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box component="div">
                        <Typography variant="body2" component="span" color="text.secondary">
                Quantity: {item.quantity}
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
                      {formatPrice(item.discount 
                        ? item.price * item.quantity * (1 - item.discount/100) 
                        : item.price * item.quantity)}
                    </Typography>
        </Box>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            {selectedAddressIndex !== -1 && user?.addresses?.[selectedAddressIndex] && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  {user.addresses[selectedAddressIndex].street}
                </Typography>
                <Typography variant="body2">
                  {`${user.addresses[selectedAddressIndex].city}, ${user.addresses[selectedAddressIndex].state} ${user.addresses[selectedAddressIndex].zipCode}`}
                </Typography>
                <Typography variant="body2">
                  {user.addresses[selectedAddressIndex].country}
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body1">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{formatPrice(calculateSubtotal())}</Typography>
            </Box>
            
            {calculateDiscount() > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="error">Discount</Typography>
                <Typography variant="body1" color="error">-{formatPrice(calculateDiscount())}</Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Free</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(calculateTotal())}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

    return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Animation */}
      <OrderSuccessAnimation 
        open={showSuccessAnimation} 
        onAnimationComplete={handleAnimationComplete} 
      />

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mr: 2 }}
            aria-label="Go back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
          Checkout
        </Typography>
        </Box>
        
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={() => (
                <Avatar 
                  sx={{ 
                    bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                    color: activeStep >= index ? 'white' : 'grey.700',
                    width: 32,
                    height: 32
                  }}
                >
                  {step.icon}
                </Avatar>
              )}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Mobile stepper title */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
          <Typography variant="h6" align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            {steps[activeStep].icon}
            {steps[activeStep].label}
          </Typography>
        </Box>

        {activeStep === 0 && renderAddressSelection()}
        {activeStep === 1 && renderPaymentMethod()}
        {activeStep === 2 && renderOrderSummary()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep !== 0 ? (
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 2 }}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outlined"
              component={Link}
              to="/cart"
              startIcon={<CartIcon />}
              sx={{ borderRadius: 2 }}
            >
              Back to Cart
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && selectedAddressIndex === -1) || 
              loading
            }
            sx={{ 
              borderRadius: 2,
              minWidth: 150,
              position: 'relative'
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', position: 'absolute', left: 'calc(50% - 12px)' }} />
                <span style={{ visibility: 'hidden' }}>Processing...</span>
              </>
            ) : (
              activeStep === steps.length - 1 ? 'Place Order' : 'Continue'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 