import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Skeleton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  IconButton,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  Zoom,
  Tooltip,
} from '@mui/material';
import {
  Sort as SortIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, pulse, getFadeInUpStaggered, shimmer } from '../utils/animations';

// Styled Components
const CategoryCard = styled(Card)(({ theme }) => ({
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
  '&:hover .category-image': {
    transform: 'scale(1.05)',
  },
}));

const CategoryImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
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

const ProductCard = styled(Card)(({ theme }) => ({
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
  '&:hover .product-actions': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
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

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ProductActions = styled(CardActions)(({ theme }) => ({
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

const categories = [
  {
    id: 1,
    name: 'Electronics',
    value: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500',
    description: 'Latest gadgets and electronic devices',
    color: '#2196f3',
  },
  {
    id: 2,
    name: 'Fashion',
    value: 'fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500',
    description: 'Trendy clothing and accessories',
    color: '#f50057',
  },
  {
    id: 3,
    name: 'Home & Living',
    value: 'home',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500',
    description: 'Furniture and home decor',
    color: '#8d6e63',
  },
  {
    id: 4,
    name: 'Books',
    value: 'books',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=500',
    description: 'Books across all genres',
    color: '#4caf50',
  },
  {
    id: 5,
    name: 'Sports',
    value: 'sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500',
    description: 'Sports equipment and accessories',
    color: '#ff9800',
  },
  {
    id: 6,
    name: 'Beauty',
    value: 'beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500',
    description: 'Beauty and personal care',
    color: '#e91e63',
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { user, token } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    // If a category is specified in the URL, fetch products for that category
    if (categoryParam) {
      const category = categories.find(cat => cat.value === categoryParam);
      if (category) {
        setSelectedCategory(category);
        fetchCategoryProducts(categoryParam);
        // Smooth scroll to top when category changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSelectedCategory(null);
      setProducts([]);
      // Smooth scroll to top when returning to categories list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [categoryParam]);

  useEffect(() => {
    if (user && selectedCategory) {
      fetchWishlistStatus();
    }
  }, [user, selectedCategory]);

  const fetchCategoryProducts = async (categoryValue) => {
    setProductsLoading(true);
    try {
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/products?category=${categoryValue}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    if (!user) return;
    try {
      const response = await fetch('https://swiftbuyz-five.vercel.app/api/wishlist', {
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

  const handleCategoryClick = (category) => {
    setLoading(true);
    // Smooth scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/categories?category=${category.value}`);
  };

  const handleSort = (event) => {
    const value = event.target.value;
    setSortBy(value);
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
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/wishlist/${productId}`, {
        method: wishlistedProducts.has(productId) ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

  // Sort products based on selected sort option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.price * (1 - a.discount/100)) - (b.price * (1 - b.discount/100));
      case 'price-desc':
        return (b.price * (1 - b.discount/100)) - (a.price * (1 - a.discount/100));
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'newest':
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Render category grid if no category is selected
  const renderCategoryGrid = () => (
    <>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Categories
          </Typography>
        </Breadcrumbs>
        <CategoryTitle variant="h4" gutterBottom>
          Shop by Category
        </CategoryTitle>
      </Box>
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item key={category.id} xs={12} sm={6} md={4}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <CategoryCard
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CategoryImage
                  className="category-image"
                  image={category.image}
                  title={category.name}
                  sx={{
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: `${category.color}33`,
                      transition: 'all 0.3s ease',
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CategoryCard>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </>
  );

  // Render products grid when a category is selected
  const renderProductsGrid = () => (
    <>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            color="inherit"
            href="/categories"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Categories
          </Link>
          <Typography color="text.primary">
            {selectedCategory?.name}
          </Typography>
        </Breadcrumbs>
        <CategoryTitle variant="h4" gutterBottom>
          {selectedCategory?.name}
        </CategoryTitle>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSort}
            label="Sort By"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Best Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {productsLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item key={item} xs={12} sm={6} md={4}>
              <ShimmerSkeleton variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <ShimmerSkeleton />
                <ShimmerSkeleton width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {sortedProducts.map((product, index) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <ProductCard>
                  {product.discount > 0 && (
                    <DiscountBadge>
                      {product.discount}% OFF
                    </DiscountBadge>
                  )}
                  <WishlistButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product._id);
                    }}
                    size="small"
                  >
                    {wishlistedProducts.has(product._id) ? (
                      <FavoriteIcon color="error" fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </WishlistButton>
                  <ProductImage
                    className="product-image"
                    image={product.images?.[0]?.url || product.images?.[0] || PLACEHOLDER_IMAGE}
                    title={product.name}
                    onClick={() => navigate(`/products/${product._id}`)}
                    sx={{
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                  <ProductContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.3,
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
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        {formatPrice(product.price * (1 - product.discount/100))}
                      </Typography>
                      {product.discount > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {formatPrice(product.price)}
                        </Typography>
                      )}
                    </Box>
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
                  <ProductActions className="product-actions">
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CartIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      sx={{
                        borderRadius: theme => theme.shape.borderRadius * 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </ProductActions>
                </ProductCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {selectedCategory ? renderProductsGrid() : renderCategoryGrid()}
    </Container>
  );
};

export default Categories; 