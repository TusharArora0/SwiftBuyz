import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme, Chip, Stack, IconButton, Paper, Rating, Badge, CardMedia, Avatar, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DevicesIcon from '@mui/icons-material/Devices';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentsIcon from '@mui/icons-material/Payments';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { 
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Mouse,
  Camera,
  SportsEsports as Gaming,
  Memory as Components,
  LocalOffer,
  ArrowForward,
  Bolt as FlashIcon,
  Timer as TimerIcon,
  Storefront,
  Home as HomeIcon,
  FitnessCenter as FitnessCenterIcon,
  Toys as ToysIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  Face as FaceIcon,
  MoreHoriz as MoreHorizIcon,
  Devices as ElectronicsIcon,
  Checkroom as FashionIcon,
  Book as BookIcon,
  SportsBasketball as SportsIcon,
  Face as BeautyIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Swift Shopping',
    description: 'Lightning-fast checkout process with smart recommendations',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: 'Tech Focused',
    description: 'Latest gadgets and tech accessories at your fingertips',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Platform',
    description: 'Advanced security measures to protect your transactions',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: '24/7 Tech Support',
    description: 'Expert assistance for all your tech-related queries',
  },
];

const benefits = [
  {
    icon: <ShoppingCartIcon />,
    title: 'Smart Shopping',
    description: 'AI-powered product recommendations'
  },
  {
    icon: <LocalShippingIcon />,
    title: 'Express Delivery',
    description: 'Next-day delivery on tech products'
  },
  {
    icon: <PaymentsIcon />,
    title: 'Secure Payments',
    description: 'Multiple payment options with encryption'
  },
  {
    icon: <VerifiedUserIcon />,
    title: 'Quality Assured',
    description: 'Genuine products with warranty'
  }
];

const categories = [
  { 
    icon: <FashionIcon />, 
    name: 'Fashion', 
    color: '#1565c0',
    description: 'Clothing, Accessories & More'
  },
  { 
    icon: <ElectronicsIcon />, 
    name: 'Electronics', 
    color: '#00838f',
    description: 'Gadgets & Devices'
  },
  { 
    icon: <HomeIcon />, 
    name: 'Home & Living', 
    color: '#2e7d32',
    description: 'Furniture & Decor'
  },
  { 
    icon: <BookIcon />, 
    name: 'Books', 
    color: '#c62828',
    description: 'Books & Stationery'
  },
  { 
    icon: <SportsIcon />, 
    name: 'Sports', 
    color: '#f57c00',
    description: 'Sports & Fitness Gear'
  },
  { 
    icon: <BeautyIcon />, 
    name: 'Beauty', 
    color: '#d81b60',
    description: 'Beauty & Personal Care'
  },
];

const Home = () => {
  const theme = useTheme();
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch flash sale products
      const flashResponse = await fetch('https://swiftbuyz-five.vercel.app/api/products/deals');
      
      // Check if response is OK
      if (!flashResponse.ok) {
        const errorText = await flashResponse.text();
        throw new Error(`Failed to fetch deals: ${errorText.substring(0, 100)}...`);
      }
      
      const flashData = await flashResponse.json();
      setFlashSaleProducts(flashData);

      // Fetch trending products
      const trendingResponse = await fetch('https://swiftbuyz-five.vercel.app/api/products?sort=rating');
      
      // Check if response is OK
      if (!trendingResponse.ok) {
        const errorText = await trendingResponse.text();
        throw new Error(`Failed to fetch trending products: ${errorText.substring(0, 100)}...`);
      }
      
      const trendingData = await trendingResponse.json();
      setTrendingProducts(trendingData.slice(0, 6)); // Get top 6 products

      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Tech Pattern Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: 'linear-gradient(45deg, #fff, #82b1ff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3,
                  }}
                >
                  Welcome to SwiftBuyz
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 4, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: 500,
                    lineHeight: 1.5 
                  }}
                >
                  Your Ultimate Shopping Destination. Discover Amazing Products Across Categories at Great Prices!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      bgcolor: '#2196f3',
                      '&:hover': {
                        bgcolor: '#1976d2',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Start Shopping
                  </Button>
                  <Button
                    component={Link}
                    to="/deals"
                    variant="outlined"
                    size="large"
                    startIcon={<LocalOffer />}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: '#82b1ff',
                        bgcolor: 'rgba(130, 177, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s',
                      px: 4,
                    }}
                  >
                    Today's Deals
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: '400px',
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 4,
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  p: 1,
                  bgcolor: 'white',
                }}
              >
                <Box
                  component="img"
                  src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg"
                  alt="Fashion"
                  sx={{ borderRadius: 2, objectFit: 'cover', height: '100%', width: '100%' }}
                />
                <Box
                  component="img"
                  src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
                  alt="Electronics"
                  sx={{ borderRadius: 2, objectFit: 'cover', height: '100%', width: '100%' }}
                />
                <Box
                  component="img"
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                  alt="Home & Living"
                  sx={{ borderRadius: 2, objectFit: 'cover', height: '100%', width: '100%' }}
                />
                <Box
                  component="img"
                  src="https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg"
                  alt="Beauty"
                  sx={{ borderRadius: 2, objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ 
            mb: 6, 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: '#1a237e'
          }}
        >
          Why Choose SwiftBuyz
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                  background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
                }}
              >
                <Box 
                  sx={{ 
                    mb: 2,
                    color: '#1976d2',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 1, color: '#1a237e' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: '#1a237e'
            }}
          >
            Shopping Benefits
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 3,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1a237e' }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: 700,
              color: '#1a237e',
              mb: 1
            }}
          >
            Popular Categories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Browse products by category
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.name}>
              <Paper
                component={Link}
                to={`/products?category=${category.name.toLowerCase()}`}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: `linear-gradient(45deg, ${category.color}15, ${category.color}08)`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                    background: `linear-gradient(45deg, ${category.color}25, ${category.color}15)`,
                  },
                  height: '100%',
                }}
              >
                <Box sx={{ 
                  color: category.color,
                  transform: 'scale(1.5)',
                  mb: 1
                }}>
                  {category.icon}
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      mb: 0.5
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.85rem',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {category.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Flash Sale Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FlashIcon sx={{ color: '#f57c00', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                Flash Sale
              </Typography>
              <Chip
                icon={<TimerIcon />}
                label="Ends in 05:23:45"
                color="error"
                sx={{ ml: 2 }}
              />
            </Stack>
            <Button
              endIcon={<ArrowForward />}
              component={Link}
              to="/deals"
              sx={{ color: '#1976d2' }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {flashSaleProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  component={Link}
                  to={`/products/${product._id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                    color: 'inherit',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                    '&:hover::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(25, 118, 210, 0.05)',
                      zIndex: 1,
                    },
                    '&:hover .MuiCardMedia-root': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]?.url || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    sx={{
                      transition: 'transform 0.3s ease',
                      height: 200,
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      padding: 1
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating?.average || 0} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating?.count || 0})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {formatPrice(product.price * (1 - product.discount/100))}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Chip
                        label={`-${product.discount}%`}
                        color="error"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trending Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            Trending
          </Typography>
          <Button
            endIcon={<ArrowForward />}
            component={Link}
            to="/products"
            sx={{ color: '#1976d2' }}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={3}>
          {trendingProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
              <Card
                component={Link}
                to={`/products/${product._id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  color: 'inherit',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                  '&:hover::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(25, 118, 210, 0.05)',
                    zIndex: 1,
                  },
                  '&:hover .MuiCardMedia-root': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0]?.url || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  sx={{
                    transition: 'transform 0.3s ease',
                    height: 200,
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    padding: 1
                  }}
                />
                <CardContent>
                  <Typography variant="body1" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(product.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Chatbot Highlight Section */}
      <Box sx={{ bgcolor: '#e8f5e9', py: 8, mb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    color: '#1a237e',
                    mb: 2
                  }}
                >
                  Need Help? Try Our Smart Assistant!
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem' }}>
                  Our AI-powered chatbot is available 24/7 to answer your questions about products, 
                  orders, shipping, returns, and more. Just click the chat icon in the bottom right corner.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  <Chip 
                    icon={<ShoppingCartIcon />} 
                    label="Track Orders" 
                    sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }} 
                  />
                  <Chip 
                    icon={<LocalShippingIcon />} 
                    label="Shipping Info" 
                    sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }} 
                  />
                  <Chip 
                    icon={<PaymentsIcon />} 
                    label="Payment Help" 
                    sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }} 
                  />
                  <Chip 
                    icon={<SupportAgentIcon />} 
                    label="24/7 Support" 
                    sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }} 
                  />
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SupportAgentIcon />}
                  onClick={() => {
                    // Find the chatbot button and click it
                    const chatButton = document.querySelector('[aria-label="chat"]') || 
                                      document.querySelector('.MuiFab-root');
                    if (chatButton) chatButton.click();
                  }}
                  sx={{
                    bgcolor: '#1a237e',
                    '&:hover': {
                      bgcolor: '#0d47a1',
                    },
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Start Chatting Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    width: { xs: '100%', sm: '80%' },
                    maxWidth: 350,
                    height: 400,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Chat Header */}
                  <Box
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6">Customer Support</Typography>
                    <IconButton size="small" sx={{ color: 'white' }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Chat Messages Preview */}
                  <Box
                    sx={{
                      p: 2,
                      height: 'calc(100% - 120px)',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      bgcolor: '#f5f5f5',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32 }}>CS</Avatar>
                      <Paper sx={{ p: 1.5, maxWidth: '80%', bgcolor: 'white' }}>
                        <Typography variant="body2">
                          Hi there! How can I help you today?
                        </Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Paper sx={{ p: 1.5, maxWidth: '80%', bgcolor: '#1a237e', color: 'white' }}>
                        <Typography variant="body2">
                          I'd like to track my recent order
                        </Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32 }}>CS</Avatar>
                      <Paper sx={{ p: 1.5, maxWidth: '80%', bgcolor: 'white' }}>
                        <Typography variant="body2">
                          To track your order, please go to your Profile {'>'}  Orders section. There you can see the status of all your orders.
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>

                  {/* Chat Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type your message..."
                        disabled
                      />
                      <IconButton color="primary" disabled>
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    top: -20,
                    right: '15%',
                    zIndex: -1,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    bottom: -30,
                    left: '10%',
                    zIndex: -1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 