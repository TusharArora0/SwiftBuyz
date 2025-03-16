import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Badge,
  Divider,
  useScrollTrigger,
  Slide,
  Zoom,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  NewReleases as NewReleasesIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  Favorite as FavoriteIcon,
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  Settings as SettingsIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { fadeIn, fadeInDown, pulse } from '../utils/animations';
import { styled } from '@mui/material/styles';

// Hide navbar on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  position: 'sticky',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #EB455F, #FCFFE7, #2B3467)',
    opacity: 0.7,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 800,
  letterSpacing: '.2rem',
  color: 'inherit',
  textDecoration: 'none',
  background: 'linear-gradient(45deg, #fff, #82b1ff)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: { xs: '1.3rem', md: '1.7rem' },
  flexShrink: 0,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #82b1ff, #fff)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  animation: `${fadeIn} 0.5s ease-out`,
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  color: 'white',
  textTransform: 'capitalize',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: active ? '80%' : '0%',
    height: '2px',
    background: theme.palette.secondary.main,
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-3px)',
    '&::after': {
      width: '80%',
    },
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.1)',
    background: 'rgba(255,255,255,0.1)',
  },
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const AvatarStyled = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isAuthenticated'
})(({ theme, isAuthenticated }) => ({
  width: 38,
  height: 38,
  bgcolor: isAuthenticated ? theme.palette.secondary.main : 'rgba(255,255,255,0.3)',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: theme.palette.secondary.light,
    boxShadow: '0 0 10px rgba(235, 69, 95, 0.5)',
  },
}));

const ScrollTopButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 90,
  right: 20,
  zIndex: 999,
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
  },
}));

const Navbar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleCloseUserMenu();
  };

  const pages = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Products', path: '/products', icon: <StoreIcon /> },
    { name: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Deals', path: '/deals', icon: <LocalOfferIcon /> },
    { name: 'New Arrivals', path: '/new-arrivals', icon: <NewReleasesIcon /> },
    { name: 'About', path: '/about', icon: <InfoIcon /> },
    { name: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  ];

  const userMenuItems = isAuthenticated ? [
    ...(user?.profileType === 'seller' ? [
      { 
        name: 'Dashboard', 
        path: '/profile', 
        icon: <DashboardIcon />,
        description: 'Manage your store'
      },
      { 
        name: 'My Products', 
        path: '/profile/products', 
        icon: <StoreIcon />,
        description: 'View and edit products'
      },
    ] : [
      { 
        name: 'My Profile', 
        path: '/profile', 
        icon: <PersonIcon />,
        description: 'View and edit profile'
      },
      { 
        name: 'My Orders', 
        path: '/profile/orders', 
        icon: <OrdersIcon />,
        description: 'Track your orders'
      },
    ]),
    { 
      name: 'Settings', 
      path: '/profile/settings', 
      icon: <SettingsIcon />,
      description: 'Account settings'
    },
    { 
      name: 'Logout', 
      action: handleLogout, 
      icon: <LogoutIcon />,
      description: 'Sign out of your account'
    },
  ] : [
    { 
      name: 'Login', 
      path: '/login', 
      icon: <PersonIcon />,
      description: 'Sign in to your account'
    },
    { 
      name: 'Register', 
      path: '/register', 
      icon: <PersonIcon />,
      description: 'Create a new account'
    },
  ];

  useEffect(() => {
    if (user) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://swiftbuyz-five.vercel.app/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const wishlist = await response.json();
        setWishlistCount(wishlist.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check if a page is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Scroll trigger for scroll-to-top button
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <>
      <HideOnScroll {...props}>
        <StyledAppBar 
          sx={{
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.1)',
            py: scrolled ? 0.5 : 1,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                minHeight: { xs: '60px', md: '70px' },
                gap: { xs: 1, md: 2 },
                transition: 'all 0.3s ease',
              }}
            >
              {/* Logo/Brand */}
              <LogoText
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  fontSize: { xs: scrolled ? '1.2rem' : '1.3rem', md: scrolled ? '1.5rem' : '1.7rem' },
                }}
              >
                SwiftBuyz
              </LogoText>

              {/* Desktop Navigation */}
              <Box sx={{ 
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' }, 
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                ml: 2,
              }}>
                {pages.map((page, index) => (
                  <NavButton
                    key={page.name}
                    component={RouterLink}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    startIcon={page.icon}
                    active={isActive(page.path)}
                    sx={{
                      animation: `${fadeInDown} 0.5s ease-out forwards`,
                      animationDelay: `${0.1 * index}s`,
                    }}
                  >
                    {page.name}
                  </NavButton>
                ))}
              </Box>

              {/* Search Icon */}
              <IconButtonStyled 
                color="inherit"
                onClick={() => navigate('/products')}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <SearchIcon />
              </IconButtonStyled>

              {/* Right Side Icons */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, md: 2 },
                ml: { xs: 0, md: 2 }
              }}>
                <IconButtonStyled 
                  color="inherit" 
                  onClick={() => navigate(isAuthenticated ? '/wishlist' : '/login')}
                  aria-label="wishlist"
                >
                  <Badge 
                    badgeContent={isAuthenticated && wishlistCount > 0 ? wishlistCount : 0}
                    invisible={!isAuthenticated || wishlistCount === 0}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: `${pulse} 2s infinite ease-in-out`,
                        fontSize: '0.65rem',
                        height: '16px',
                        minWidth: '16px',
                        padding: '0 3px',
                        right: -3,
                        top: 3
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </Badge>
                </IconButtonStyled>

                <IconButtonStyled 
                  component={RouterLink} 
                  to={isAuthenticated ? "/cart" : "/login"}
                  aria-label="cart"
                >
                  <Badge 
                    badgeContent={isAuthenticated && items.length > 0 ? items.length : 0}
                    invisible={!isAuthenticated || items.length === 0}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: `${pulse} 2s infinite ease-in-out`,
                        fontSize: '0.65rem',
                        height: '16px',
                        minWidth: '16px',
                        padding: '0 3px',
                        right: -3,
                        top: 3
                      }
                    }}
                  >
                    <CartIcon />
                  </Badge>
                </IconButtonStyled>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButtonStyled
                    size="large"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    aria-label="menu"
                  >
                    <MenuIcon />
                  </IconButtonStyled>
                </Box>

                {/* User Menu */}
                <Tooltip title={isAuthenticated ? "Account settings" : "Login"}>
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                    }}
                  >
                    <AvatarStyled isAuthenticated={isAuthenticated}>
                      {isAuthenticated ? user.name[0].toUpperCase() : <PersonIcon />}
                    </AvatarStyled>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>

      {/* Mobile Navigation Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiPaper-root': {
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        {pages.map((page) => (
          <MenuItem 
            key={page.name} 
            onClick={() => {
              navigate(page.path);
              handleCloseNavMenu();
            }}
            sx={{
              color: 'white',
              py: 1.5,
              borderRadius: 1,
              mx: 0.5,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {page.icon}
              <Typography>{page.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        sx={{
          mt: '45px',
          '& .MuiPaper-root': {
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            minWidth: '250px',
            borderRadius: 2,
          },
        }}
      >
        {[
          ...(isAuthenticated ? [
            <Box key="user-info" sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user.email}
              </Typography>
            </Box>,
            <Divider key="divider" sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          ] : []),

          ...userMenuItems.map((item) => (
            <MenuItem
              key={item.name}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                  handleCloseUserMenu();
                }
              }}
              sx={{
                py: 1.5,
                px: 2,
                gap: 2,
                borderRadius: 1,
                mx: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <Box sx={{ 
                color: 'white', 
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                width: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                </Box>
                {item.description && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      pl: 4
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))
        ]}
      </Menu>

      {/* Scroll to top button */}
      <Zoom in={useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
      })}>
        <ScrollTopButton
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          aria-label="scroll back to top"
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            zIndex: 999
          }}
        >
          <KeyboardArrowUpIcon />
        </ScrollTopButton>
      </Zoom>
    </>
  );
};

export default Navbar; 