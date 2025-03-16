import { Box, Container, Grid, Typography, Link, IconButton, Stack, Divider, Button, TextField, InputAdornment } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  Send as SendIcon,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, pulse, float } from '../utils/animations';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  marginTop: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #EB455F, #FCFFE7, #2B3467)',
    opacity: 0.7,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: 0,
  },
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40px',
    height: '3px',
    background: theme.palette.secondary.main,
    borderRadius: '3px',
  },
  animation: `${fadeInUp} 0.5s ease-out forwards`,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    color: theme.palette.secondary.light,
    transform: 'translateX(5px)',
    textDecoration: 'none',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    transform: 'translateY(-5px)',
  },
  animation: `${float} 3s infinite ease-in-out`,
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
  },
}));

const NewsletterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  animation: `${fadeInUp} 0.7s ease-out forwards`,
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4} sx={{ animation: `${fadeInUp} 0.5s ease-out forwards` }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff, #82b1ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              SwiftBuyz
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.7 }}>
              Your ultimate shopping destination for all your needs. Quality products, great prices, and excellent service.
              We strive to provide the best shopping experience for our customers.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <SocialIconButton 
                color="inherit" 
                href="https://facebook.com" 
                target="_blank"
                aria-label="Facebook"
                sx={{ animationDelay: '0.1s' }}
              >
                <Facebook />
              </SocialIconButton>
              <SocialIconButton 
                color="inherit" 
                href="https://twitter.com" 
                target="_blank"
                aria-label="Twitter"
                sx={{ animationDelay: '0.2s' }}
              >
                <Twitter />
              </SocialIconButton>
              <SocialIconButton 
                color="inherit" 
                href="https://instagram.com" 
                target="_blank"
                aria-label="Instagram"
                sx={{ animationDelay: '0.3s' }}
              >
                <Instagram />
              </SocialIconButton>
              <SocialIconButton 
                color="inherit" 
                href="https://linkedin.com" 
                target="_blank"
                aria-label="LinkedIn"
                sx={{ animationDelay: '0.4s' }}
              >
                <LinkedIn />
              </SocialIconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterHeading variant="h6" gutterBottom>
              Quick Links
            </FooterHeading>
            <Stack spacing={1.5}>
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Products', path: '/products' },
                { name: 'Categories', path: '/categories' },
                { name: 'New Arrivals', path: '/new-arrivals' },
              ].map((link, index) => (
                <FooterLink 
                  component={RouterLink} 
                  to={link.path} 
                  key={link.name}
                  underline="hover"
                  sx={{ 
                    opacity: 0,
                    animation: `${fadeInUp} 0.5s ease-out forwards`,
                    animationDelay: `${0.1 * (index + 1)}s`,
                  }}
                >
                  <KeyboardArrowRight sx={{ fontSize: 18, mr: 0.5, color: 'secondary.light' }} />
                  {link.name}
                </FooterLink>
              ))}
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6" gutterBottom sx={{ animationDelay: '0.1s' }}>
              Customer Service
            </FooterHeading>
            <Stack spacing={1.5}>
              {[
                { name: 'Shipping Policy', path: '/shipping-policy' },
                { name: 'Return Policy', path: '/return-policy' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Terms & Conditions', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' },
              ].map((link, index) => (
                <FooterLink 
                  component={RouterLink} 
                  to={link.path} 
                  key={link.name}
                  underline="hover"
                  sx={{ 
                    opacity: 0,
                    animation: `${fadeInUp} 0.5s ease-out forwards`,
                    animationDelay: `${0.1 * (index + 1)}s`,
                  }}
                >
                  <KeyboardArrowRight sx={{ fontSize: 18, mr: 0.5, color: 'secondary.light' }} />
                  {link.name}
                </FooterLink>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <FooterHeading variant="h6" gutterBottom sx={{ animationDelay: '0.2s' }}>
              Contact Us
            </FooterHeading>
            <Stack spacing={2}>
              <ContactItem>
                <LocationOn sx={{ color: 'secondary.light' }} />
                <Typography variant="body2">
                  123 Shopping Street, Delhi, India
                </Typography>
              </ContactItem>
              <ContactItem>
                <Phone sx={{ color: 'secondary.light' }} />
                <Typography variant="body2">
                  +91 123 456 7890
                </Typography>
              </ContactItem>
              <ContactItem>
                <Email sx={{ color: 'secondary.light' }} />
                <Typography variant="body2">
                  support@swiftbuyz.com
                </Typography>
              </ContactItem>
            </Stack>

            {/* Newsletter */}
            <NewsletterBox mt={4}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Subscribe to Our Newsletter
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Get the latest updates and offers
              </Typography>
              <TextField
                fullWidth
                placeholder="Your email address"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        sx={{ 
                          color: 'white',
                          bgcolor: 'secondary.main',
                          '&:hover': {
                            bgcolor: 'secondary.dark',
                          },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </NewsletterBox>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2,
            animation: `${fadeIn} 0.8s ease-out forwards`,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} SwiftBuyz. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <FooterLink href="/privacy" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
              Terms of Use
            </FooterLink>
          </Stack>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 