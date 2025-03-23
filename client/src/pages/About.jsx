import { Box, Container, Typography, Grid, Paper, Avatar, Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import {
  Store as StoreIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  Support as SupportIcon,
  People as PeopleIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Storefront as StorefrontIcon
} from '@mui/icons-material';
import { fadeIn, fadeInUp } from '../utils/animations';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
}));

const ValueIcon = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #2B3467 30%, #4C5BB3 90%)',
  boxShadow: '0 3px 10px rgba(43, 52, 103, 0.2)',
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(45deg, #2B3467 30%, #4C5BB3 90%)',
  borderRadius: theme.shape.borderRadius * 2,
  color: 'white',
  boxShadow: '0 4px 20px rgba(43, 52, 103, 0.25)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

// Number counter component
const CountUp = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;
    
    const startValue = 0;
    const endValue = parseInt(end);
    
    const counter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(counter);
      }
    };
    
    animationFrame = requestAnimationFrame(counter);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return (
    <div ref={countRef}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {count}+
      </Typography>
      <Typography variant="subtitle1">{label}</Typography>
    </div>
  );
};

const About = () => {
  const [stats, setStats] = useState([
    { number: '500', label: 'Happy Customers' },
    { number: '1000', label: 'Products Available' },
    { number: '25', label: 'Active Sellers' },
    { number: '20', label: 'Product Categories' },
    { number: '150', label: 'Orders Completed' }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch product count
        const productsResponse = await fetch('https://swiftbuyz-five.vercel.app/api/products');
        const productsData = await productsResponse.json();
        
        // Get product count
        const productCount = productsData.length;
        
        // Get unique categories count
        const uniqueCategories = new Set();
        productsData.forEach(product => {
          if (product.category) {
            uniqueCategories.add(product.category);
          }
        });
        const categoryCount = uniqueCategories.size;
        
        // Get unique sellers count
        const uniqueSellers = new Set();
        productsData.forEach(product => {
          if (product.seller) {
            uniqueSellers.add(typeof product.seller === 'object' ? product.seller._id : product.seller);
          }
        });
        const sellerCount = uniqueSellers.size;
        
        // Estimate customer count based on product reviews
        let customerSet = new Set();
        productsData.forEach(product => {
          if (product.reviews && Array.isArray(product.reviews)) {
            product.reviews.forEach(review => {
              if (review.user) {
                customerSet.add(typeof review.user === 'object' ? review.user._id : review.user);
              }
            });
          }
        });
        const customerCount = Math.max(customerSet.size, 500); // Use at least 500 as a minimum
        
        // Update all stats based on product data
        setStats([
          { number: customerCount.toString(), label: 'Happy Customers' },
          { number: productCount.toString(), label: 'Products Available' },
          { number: sellerCount.toString(), label: 'Active Sellers' },
          { number: categoryCount.toString(), label: 'Product Categories' },
          { number: Math.round(productCount * 1.5).toString(), label: 'Orders Completed' } // Estimate orders as 1.5x products
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Stats will remain at their default values
      }
    };
    
    fetchStats();
  }, []);

  const values = [
    {
      icon: <SecurityIcon />,
      title: 'Secure Shopping',
      description: 'Your security is our top priority. We ensure safe and encrypted transactions.',
    },
    {
      icon: <ShippingIcon />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your products to you as soon as possible.',
    },
    {
      icon: <SupportIcon />,
      title: '24/7 Support',
      description: 'Our dedicated support team is always here to help you with any queries.',
    },
    {
      icon: <HeartIcon />,
      title: 'Quality Products',
      description: 'We carefully curate our products to ensure the highest quality standards.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeInUp} 0.6s ease-out` }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(45deg, #2B3467 30%, #4C5BB3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
        >
          Welcome to SwiftBuyz, your one-stop destination for all your shopping needs. 
          We're dedicated to providing you with the best shopping experience possible.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {stats.slice(0, 4).map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <StatBox>
              <CountUp end={stat.number} label={stat.label} />
            </StatBox>
          </Grid>
        ))}
        {/* Center the fifth stat (Orders) */}
        {stats.length > 4 && (
          <Grid item xs={12} md={6} sx={{ mx: 'auto', mt: { xs: 1, md: 3 } }}>
            <StatBox>
              <CountUp end={stats[4].number} label={stats[4].label} />
            </StatBox>
          </Grid>
        )}
      </Grid>

      {/* Our Story Section */}
      <Box sx={{ mb: 8, animation: `${fadeInUp} 0.6s ease-out` }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
          Our Story
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
          }}
        >
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Founded in 2023, SwiftBuyz began with a simple mission: to make quality products accessible to everyone. 
            What started as a small online store has grown into a thriving marketplace, connecting thousands of sellers 
            with customers across the country.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            We believe in the power of e-commerce to transform lives, whether it's helping small businesses reach 
            new customers or enabling shoppers to find exactly what they need from the comfort of their homes. 
            Our platform is built on trust, innovation, and customer satisfaction.
          </Typography>
        </Paper>
      </Box>

      {/* Our Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ animation: `${fadeInUp} 0.6s ease-out` }}>
              <StyledPaper elevation={2}>
                <ValueIcon>{value.icon}</ValueIcon>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission & Vision Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <StarIcon sx={{ fontSize: 40, color: '#2B3467' }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" textAlign="center" sx={{ lineHeight: 1.8 }}>
                To create a seamless and enjoyable shopping experience that connects quality products 
                with passionate customers, while supporting sellers in growing their businesses.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <StorefrontIcon sx={{ fontSize: 40, color: '#2B3467' }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" textAlign="center" sx={{ lineHeight: 1.8 }}>
                To become the most trusted and innovative e-commerce platform, setting new standards 
                for online shopping and empowering both buyers and sellers to achieve their goals.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Join Us Section */}
      <Box
        sx={{
          textAlign: 'center',
          p: 6,
          borderRadius: 4,
          background: 'linear-gradient(45deg, #2B3467 30%, #4C5BB3 90%)',
          color: 'white',
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Join Our Growing Community
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
          Be part of our journey as we continue to revolutionize the online shopping experience.
        </Typography>
      </Box>
    </Container>
  );
};

export default About; 