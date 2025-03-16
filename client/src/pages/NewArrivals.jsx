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
  Box,
  IconButton,
  Rating,
  Chip,
  Alert,
  Stack,
  Skeleton,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  NewReleases as NewIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, pulse, getFadeInUpStaggered, shimmer } from '../utils/animations';
import { API_URL, fetchWithAuth } from '../utils/apiConfig';

// Styled Components
const NewArrivalCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
  '&:hover .product-image': {
    transform: 'scale(1.05)',
  },
  '&:hover .card-actions': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 280,
  objectFit: 'contain',
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(2),
  transition: 'transform 0.5s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.02), transparent)',
    pointerEvents: 'none',
  },
}));

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const CardActionArea = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  opacity: 0.95,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
}));

const NewBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '6px 12px',
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 'bold',
  zIndex: 1,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  animation: `${pulse} 2s infinite ease-in-out`,
  fontSize: '0.875rem',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  transition: 'all 0.3s ease',
  zIndex: 1,
  padding: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ShimmerSkeleton = styled(Skeleton)(({ theme }) => ({
  '&::after': {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
    animation: `${shimmer} 2s infinite`,
  },
}));

const NewArrivals = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());

  useEffect(() => {
    fetchNewArrivals();
    if (user) {
      fetchWishlistStatus();
    }
  }, [user, token]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/products/new-arrivals`);
      if (!response.ok) {
        throw new Error('Failed to fetch new arrivals');
      }
      const data = await response.json();
      setNewArrivals(data);
      setFilteredArrivals(data);
      
      const initialQuantities = {};
      data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setError('Failed to load new arrivals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const wishlist = await response.json();
        setWishlistedProducts(new Set(wishlist.map(item => item._id)));
      }
    } catch (error) {
      console.error('Error fetching wishlist status:', error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const method = wishlistedProducts.has(productId) ? 'DELETE' : 'POST';
      const response = await fetch(`${API_URL}/wishlist/${productId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          if (method === 'DELETE') {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" gap={2} p={4}>
        <LinearProgress />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item key={item} xs={12} sm={6} md={4}>
              <ShimmerSkeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Box 
          sx={{ 
            position: 'relative',
            display: 'inline-block',
            mb: 3,
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textShadow: '0 2px 10px rgba(33,150,243,0.2)',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: 4,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
              }
            }}
          >
            New Arrivals
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.secondary',
            mb: 4,
            fontWeight: 500,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Discover our latest collection of fresh and exciting products
        </Typography>
      </Box>

      {/* Features Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <FeatureCard>
              <NewIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h6">Latest Products</Typography>
              <Typography variant="body2" color="text.secondary">
                Fresh from our collection
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <FeatureCard>
              <ShippingIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Typography variant="h6">Fast Delivery</Typography>
              <Typography variant="body2" color="text.secondary">
                Quick shipping worldwide
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '400ms' }}>
            <FeatureCard>
              <VerifiedIcon sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h6">Quality Assured</Typography>
              <Typography variant="body2" color="text.secondary">
                Premium quality products
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <FeatureCard>
              <TimeIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              <Typography variant="h6">Limited Time</Typography>
              <Typography variant="body2" color="text.secondary">
                Get them while they last
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
      </Grid>

      {/* Products Grid */}
      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : newArrivals.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No new arrivals available at the moment. Check back soon!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {newArrivals.map((product, index) => (
            <Grid 
              item 
              key={product._id} 
              xs={12} 
              sm={6} 
              md={4}
              sx={getFadeInUpStaggered(index)}
            >
              <NewArrivalCard>
                <NewBadge>
                  <NewIcon fontSize="small" />
                  New Arrival
                </NewBadge>

                {user?.profileType === 'consumer' && (
                  <WishlistButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product._id);
                    }}
                  >
                    {wishlistedProducts.has(product._id) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </WishlistButton>
                )}

                <ProductImage
                  className="product-image"
                  component="img"
                  image={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  onClick={() => navigate(`/products/${product._id}`)}
                />

                <ProductContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      height: '2.6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {formatPrice(product.price)}
                    </Typography>
                    {product.discount > 0 && (
                      <Chip 
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>

                  {product.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={product.rating.average} 
                        precision={0.5} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({product.rating.count})
                      </Typography>
                    </Box>
                  )}

                  <Chip
                    label={product.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />

                  {product.briefDescription && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        height: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.briefDescription}
                    </Typography>
                  )}
                </ProductContent>

                <CardActionArea className="card-actions">
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock === 0}
                    sx={{
                      borderRadius: theme => theme.shape.borderRadius * 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                    }}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardActionArea>
              </NewArrivalCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default NewArrivals; 