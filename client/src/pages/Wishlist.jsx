import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://swiftbuyz-five.vercel.app/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setWishlistItems(items => items.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    handleRemoveFromWishlist(product._id);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Alert severity="info">
          Your wishlist is empty. Browse our products to add items to your wishlist!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${item._id}`)}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.briefDescription}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<CartIcon />}
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.stock}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 