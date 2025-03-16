import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { API_URL } from '../utils/apiConfig';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Store as StoreIcon,
  HowToReg as RegisterIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileType: 'consumer', // default to consumer
    shopName: '', // Add this field
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const steps = [
    'Account Type',
    'Personal Information',
    'Security'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      // No validation needed for profile type
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Validate name and email
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Validate shop name for sellers
      if (formData.profileType === 'seller' && !formData.shopName.trim()) {
        setError('Shop name is required for seller accounts');
        return;
      }
      
      setActiveStep(2);
      setError(null);
    } else if (activeStep === 2) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Log the request payload
    console.log('Sending registration request with data:', {
      ...formData,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]'
    });

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profileType: formData.profileType,
          ...(formData.profileType === 'seller' && { shopName: formData.shopName })
        }),
      });

      // Log the response status
      console.log('Response status:', response.status);

      const data = await response.json();
      
      // Log the response data
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAccountTypeStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Choose Account Type
      </Typography>
      
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          name="profileType"
          value={formData.profileType}
          onChange={handleChange}
        >
          <Paper 
            elevation={formData.profileType === 'consumer' ? 3 : 1}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              border: formData.profileType === 'consumer' ? '2px solid' : '1px solid',
              borderColor: formData.profileType === 'consumer' ? 'primary.main' : 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              }
            }}
            onClick={() => setFormData({...formData, profileType: 'consumer'})}
          >
            <FormControlLabel 
              value="consumer" 
              control={<Radio />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Consumer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shop products and make purchases
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>
          
          <Paper 
            elevation={formData.profileType === 'seller' ? 3 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: formData.profileType === 'seller' ? '2px solid' : '1px solid',
              borderColor: formData.profileType === 'seller' ? 'primary.main' : 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.light',
                boxShadow: 2
              }
            }}
            onClick={() => setFormData({...formData, profileType: 'seller'})}
          >
            <FormControlLabel 
              value="seller" 
              control={<Radio />} 
              label={
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    List and sell your products
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderPersonalInfoStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Personal Information
      </Typography>
      
      <TextField
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        value={formData.name}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      {formData.profileType === 'seller' && (
        <TextField
          required
          fullWidth
          name="shopName"
          label="Shop Name"
          id="shopName"
          value={formData.shopName}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StoreIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      )}
    </Box>
  );

  const renderSecurityStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Create Password
      </Typography>
      
      <TextField
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        value={formData.password}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      <TextField
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Password must be at least 6 characters long.
      </Typography>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderAccountTypeStep();
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderSecurityStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            py: 3, 
            px: 2, 
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Avatar 
            sx={{ 
              mx: 'auto', 
              bgcolor: 'white', 
              color: 'primary.main',
              width: 56,
              height: 56,
              mb: 1
            }}
          >
            <RegisterIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Join our community today
          </Typography>
        </Box>
        
        <Box sx={{ p: 3, pt: 4 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            sx={{ mb: 4, display: { xs: 'none', sm: 'flex' } }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Mobile step indicator */}
          <Box sx={{ mb: 3, display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Step {activeStep + 1} of {steps.length}: <strong>{steps[activeStep]}</strong>
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-icon': { alignItems: 'center' }
              }}
            >
              {error}
            </Alert>
          )}
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                borderRadius: 2,
                visibility: activeStep === 0 ? 'hidden' : 'visible'
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                minWidth: 100,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Sign Up'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 