import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if trying to access cart without auth
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discount 
        ? item.price * (1 - item.discount/100) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
    if (newQuantity !== item.quantity) {
      dispatch(updateQuantity({ 
        id: item._id,
        quantity: newQuantity 
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      // Add your checkout logic here
      navigate('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item._id} sx={{ mb: 2, position: 'relative' }}>
              <Box sx={{ display: 'flex', p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, height: 140, objectFit: 'cover' }}
                  image={item.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.category}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      {item.discount > 0 ? (
                        <>
                          <Typography variant="h6" color="primary">
                            {formatPrice(item.price * (1 - item.discount/100) * item.quantity)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" color="primary">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>{formatPrice(calculateTotal())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 