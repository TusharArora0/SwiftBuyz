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
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  Paper,
  Zoom,
  Tooltip,
  Skeleton,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer as OfferIcon,
  Timer as TimerIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, pulse, getFadeInUpStaggered, shimmer } from '../utils/animations';

// Styled Components
const DealCard = styled(Card)(({ theme }) => ({
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
  '&:hover .deal-image': {
    transform: 'scale(1.05)',
  },
  '&:hover .deal-actions': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const DealImage = styled(CardMedia)(({ theme }) => ({
  height: 280,
  objectFit: 'contain',
  backgroundColor: '#f5f5f5',
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

const DealContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const DealActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  opacity: 0.95,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.error.main,
  color: 'white',
  padding: '6px 12px',
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 'bold',
  zIndex: 1,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  animation: `${pulse} 2s infinite ease-in-out`,
  fontSize: '0.875rem',
  letterSpacing: '0.5px',
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

const ShimmerSkeleton = styled(Skeleton)(({ theme }) => ({
  '&::after': {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
    animation: `${shimmer} 2s infinite`,
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

const Deals = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [selectedRange, setSelectedRange] = useState(null);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [sortBy, setSortBy] = useState('discount');
  const [error, setError] = useState(null);

  // Update countdown timer state with end time
  const [timeLeft, setTimeLeft] = useState(() => {
    // Set end time to 24 hours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    return {
      hours: 24,
      minutes: 0,
      seconds: 0,
      endTime: endTime.getTime()
    };
  });

  // Add timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = timeLeft.endTime - now;
      
      if (difference <= 0) {
        // Reset timer to 24 hours when it reaches 0
        const newEndTime = new Date();
        newEndTime.setHours(newEndTime.getHours() + 24);
        
        setTimeLeft({
          hours: 24,
          minutes: 0,
          seconds: 0,
          endTime: newEndTime.getTime()
        });
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(prev => ({
        ...prev,
        hours,
        minutes,
        seconds
      }));
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [timeLeft.endTime]);

  useEffect(() => {
    fetchDeals();
    if (user) {
      fetchWishlistStatus();
    }
  }, [user, token]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/products/deals');
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }
      const data = await response.json();
      const sortedDeals = data.sort((a, b) => b.discount - a.discount);
      setDeals(sortedDeals);
      setFilteredDeals(sortedDeals);
      
      const initialQuantities = {};
      data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to load deals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
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

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const method = wishlistedProducts.has(productId) ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
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
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleDiscountFilter = (range) => {
    if (selectedRange === range) {
      setSelectedRange(null);
      setFilteredDeals(deals);
      return;
    }

    setSelectedRange(range);
    const [min, max] = range.split('-').map(num => parseInt(num));
    const filtered = deals.filter(deal => 
      deal.discount >= min && deal.discount <= max
    );
    setFilteredDeals(filtered);
  };

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...filteredDeals].sort((a, b) => {
      switch (value) {
        case 'discount':
          return b.discount - a.discount;
        case 'price':
          return (a.price * (1 - a.discount/100)) - (b.price * (1 - b.discount/100));
        case 'rating':
          return (b.rating?.average || 0) - (a.rating?.average || 0);
        default:
          return 0;
      }
    });
    setFilteredDeals(sorted);
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
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textShadow: '0 2px 10px rgba(255,107,107,0.2)',
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
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                borderRadius: 2,
              }
            }}
          >
            Today's Hot Deals
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.secondary',
            mb: 4,
            fontWeight: 500,
            opacity: 1,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.5,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: -40,
              width: 20,
              height: 2,
              background: 'linear-gradient(45deg, #FF6B6B 30%, transparent)',
              transform: 'translateY(-50%)',
              display: { xs: 'none', md: 'block' }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: -40,
              width: 20,
              height: 2,
              background: 'linear-gradient(45deg, transparent, #FF8E53 70%)',
              transform: 'translateY(-50%)',
              display: { xs: 'none', md: 'block' }
            }
          }}
        >
          Grab these amazing offers before they're gone!
        </Typography>
        
        {/* Updated Countdown Timer */}
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            animation: `${fadeInUp} 0.5s ease-out`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,107,107,0.05), rgba(255,142,83,0.05))',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            }
          }}
        >
          <TimerIcon color="error" sx={{ fontSize: 28 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ textAlign: 'center', minWidth: '60px' }}>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Hours
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700, opacity: 0.75 }}>:</Typography>
            <Box sx={{ textAlign: 'center', minWidth: '60px' }}>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Minutes
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700, opacity: 0.75 }}>:</Typography>
            <Box sx={{ textAlign: 'center', minWidth: '60px' }}>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Seconds
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Features Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <FeatureCard>
              <BoltIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              <Typography variant="h6">Flash Deals</Typography>
              <Typography variant="body2" color="text.secondary">
                Up to 70% off on selected items
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <FeatureCard>
              <ShippingIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Typography variant="h6">Free Shipping</Typography>
              <Typography variant="body2" color="text.secondary">
                On orders above ₹499
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '400ms' }}>
            <FeatureCard>
              <VerifiedIcon sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h6">Genuine Products</Typography>
              <Typography variant="body2" color="text.secondary">
                100% authentic items
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <FeatureCard>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'error.main' }} />
              <Typography variant="h6">Trending Deals</Typography>
              <Typography variant="body2" color="text.secondary">
                Most popular discounts
              </Typography>
            </FeatureCard>
          </Zoom>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['10-25%', '26-50%', '51-75%'].map((range) => (
            <Chip
              key={range}
              label={range}
              onClick={() => handleDiscountFilter(range)}
              color={selectedRange === range ? 'primary' : 'default'}
              variant={selectedRange === range ? 'filled' : 'outlined'}
              sx={{ 
                '&:hover': { opacity: 0.9 },
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            />
          ))}
        </Stack>
        
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="discount">Highest Discount</MenuItem>
          <MenuItem value="price">Lowest Price</MenuItem>
          <MenuItem value="rating">Highest Rating</MenuItem>
        </Select>
      </Box>

      {/* Results Summary */}
      <Typography 
        variant="subtitle1" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        Showing {filteredDeals.length} products with special discounts
        {selectedRange && ` in ${selectedRange} range`}
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : filteredDeals.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No deals available at the moment. Check back soon!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredDeals.map((product, index) => (
            <Grid 
              item 
              key={product._id} 
              xs={12} 
              sm={6} 
              md={4}
              sx={getFadeInUpStaggered(index)}
            >
              <DealCard>
                <DiscountBadge>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <OfferIcon fontSize="small" />
                    {product.discount}% OFF
                  </Stack>
                </DiscountBadge>

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

                <DealImage
                  className="deal-image"
                  component="img"
                  image={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  onClick={() => navigate(`/products/${product._id}`)}
                />

                <DealContent>
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
                      {formatPrice(product.price * (1 - product.discount/100))}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
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
                </DealContent>

                <DealActions className="deal-actions">
                  <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 0.5
                      }}
                    >
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(
                          product._id, 
                          Math.max(1, (quantities[product._id] || 1) - 1)
                        )}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>
                        {quantities[product._id] || 1}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(
                          product._id, 
                          Math.min(product.stock, (quantities[product._id] || 1) + 1)
                        )}
                        disabled={quantities[product._id] >= product.stock}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
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
                      }}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </Box>
                </DealActions>
              </DealCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Deals; 