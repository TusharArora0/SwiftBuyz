import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Paper,
  Divider,
  Skeleton,
  Pagination,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Zoom,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { 
  Search as SearchIcon, 
  ShoppingCart as CartIcon, 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon, 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Sort as SortIcon,
  FilterList as FilterListIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { 
  fadeIn, 
  fadeInUp, 
  pulse, 
  getFadeInUpStaggered,
  shimmer,
} from '../utils/animations';

// Styled components
const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
  '&:hover .product-image': {
    transform: 'scale(1.05)',
  },
  '&:hover .quick-view-button': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 250,
  objectFit: 'contain',
  backgroundColor: '#f5f5f5',
  padding: 1,
  transition: 'transform 0.5s ease',
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.error.main,
  color: 'white',
  padding: '4px 8px',
  borderRadius: 4,
  fontWeight: 'bold',
  zIndex: 1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  transition: 'all 0.3s ease',
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
}));

const QuickViewButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '50%',
  left: '50%',
  transform: 'translate(-50%, 20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  zIndex: 2,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
    },
  },
}));

const SortSelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
    },
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
  },
  animation: `${fadeInUp} 0.5s ease-out`,
}));

const ShimmerSkeleton = styled(Skeleton)(({ theme }) => ({
  '&::after': {
    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
    animation: `${shimmer} 2s infinite`,
  },
}));

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [page, setPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    // If we have search results in the location state, use them
    if (location.state?.searchResults) {
      setProducts(location.state.searchResults);
      setLoading(false);
    } else {
      // Otherwise fetch products normally
      fetchProducts();
    }
    if (user) {
      fetchWishlistStatus();
    }
    // Reset to first page when filters change
    setPage(1);
  }, [location.state, categoryFilter, user, token]);

  const fetchProducts = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');
      const categoryParam = searchParams.get('category');
      
      let url = 'http://localhost:5000/api/products';
      const queryParams = new URLSearchParams();
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      if (categoryParam) {
        queryParams.append('category', categoryParam);
      }
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    if (!user) return;
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
    if (!user) {
      navigate('/login');
      return;
    }
    const quantity = quantities[product._id] || 1;
    dispatch(addToCart({ ...product, quantity }));
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: wishlistedProducts.has(productId) ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          if (wishlistedProducts.has(productId)) {
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

  const handleSort = (event) => {
    const value = event.target.value;
    setSortBy(value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price * (1 - a.discount/100)) - (b.price * (1 - b.discount/100));
      case 'price-desc':
        return (b.price * (1 - b.discount/100)) - (a.price * (1 - a.discount/100));
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'newest':
      default:
        // Assuming products have a createdAt field, otherwise fallback to default order
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <ShimmerSkeleton variant="rectangular" width={300} height={40} />
          <Box sx={{ mt: 2 }}>
            <ShimmerSkeleton variant="rectangular" width="100%" height={56} />
          </Box>
        </Box>
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <ShimmerSkeleton variant="rectangular" height={250} />
                <CardContent>
                  <ShimmerSkeleton variant="text" height={30} width="80%" />
                  <ShimmerSkeleton variant="text" height={24} width="40%" />
                  <ShimmerSkeleton variant="text" height={20} width="100%" />
                  <ShimmerSkeleton variant="text" height={20} width="60%" />
                </CardContent>
                <CardActions>
                  <ShimmerSkeleton variant="rectangular" height={40} width="100%" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)',
      minHeight: '100vh',
      pt: 2,
      pb: 6,
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3, animation: `${fadeIn} 0.5s ease-out` }}
        >
          <MuiLink 
            component={Link} 
            to="/" 
            underline="hover" 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </MuiLink>
          <Typography color="text.primary">
            {categoryFilter 
              ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}` 
              : 'All Products'}
          </Typography>
        </Breadcrumbs>

        {/* Title with category if filtered */}
        <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
          <CategoryTitle variant="h4" gutterBottom>
            {categoryFilter 
              ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` 
              : 'All Products'}
          </CategoryTitle>
          <Typography variant="subtitle1" color="text.secondary">
            {sortedProducts.length} products found
          </Typography>
        </Box>

        {/* Search and Sort */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
            animation: `${fadeInUp} 0.6s ease-out`,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <SearchBar
                fullWidth
                variant="outlined"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SortSelect fullWidth variant="outlined">
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortBy}
                  onChange={handleSort}
                  label="Sort By"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </SortSelect>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              animation: `${fadeInUp} 0.7s ease-out`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {currentProducts.map((product, index) => (
              <Grid 
                item 
                key={product._id} 
                xs={12} 
                sm={6} 
                md={4}
                sx={getFadeInUpStaggered(index)}
              >
                <ProductCard>
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <DiscountBadge>
                      {product.discount}% OFF
                    </DiscountBadge>
                  )}

                  {/* Wishlist Button */}
                  {user && (
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

                  {/* Product Image */}
                  <Box 
                    sx={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0)',
                        transition: 'all 0.3s ease',
                        zIndex: 1,
                      },
                      '&:hover::after': {
                        background: 'rgba(0,0,0,0.05)',
                      }
                    }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <ProductImage
                      component="img"
                      className="product-image"
                      image={
                        product.images?.[0]?.url || 
                        product.images?.find(img => img.isMain)?.url || 
                        PLACEHOLDER_IMAGE
                      }
                      alt={product.name}
                    />
                    <QuickViewButton
                      className="quick-view-button"
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product._id}`);
                      }}
                    >
                      Quick View
                    </QuickViewButton>
                  </Box>

                  {/* Product Details */}
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    {/* Price Display */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {product.discount > 0 ? (
                        <>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatPrice(product.price * (1 - product.discount/100))}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {formatPrice(product.price)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {formatPrice(product.price)}
                        </Typography>
                      )}
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1.5,
                        height: '40px',
                      }}
                    >
                      {product.briefDescription || product.description}
                    </Typography>

                    {/* Category and Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '16px' }}
                      />
                      
                      {product.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={product.rating.average} 
                            precision={0.5} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({product.rating.count})
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Stock Status */}
                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? 'success.main' : 'error.main'}
                      sx={{ 
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: product.stock > 0 ? 'success.main' : 'error.main',
                          display: 'inline-block',
                        }} 
                      />
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Typography>
                  </CardContent>

                  <Divider />

                  {/* Add to Cart */}
                  <CardActions sx={{ p: 2 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        width: '100%', 
                        gap: 1, 
                        alignItems: 'center' 
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
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
                        <Tooltip title="Decrease quantity">
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(
                              product._id, 
                              Math.max(1, (quantities[product._id] || 1) - 1)
                            )}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography 
                          sx={{ 
                            mx: 2,
                            minWidth: '20px',
                            textAlign: 'center'
                          }}
                        >
                          {quantities[product._id] || 1}
                        </Typography>
                        <Tooltip title="Increase quantity">
                          <span>
                            <IconButton 
                              size="small"
                              onClick={() => handleQuantityChange(
                                product._id, 
                                Math.min(product.stock, (quantities[product._id] || 1) + 1)
                              )}
                              disabled={quantities[product._id] >= product.stock || product.stock === 0}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
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
                          borderRadius: '50px',
                          py: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </Box>
                  </CardActions>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              animation: `${fadeInUp} 0.8s ease-out`,
            }}
          >
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Zoom}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 4,
          }}
        >
          Product added to cart successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products; 