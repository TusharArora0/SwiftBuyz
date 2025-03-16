import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { API_URL, fetchWithAuth } from '../utils/apiConfig';
import ApiTest from '../components/ApiTest';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      // Use the fetchWithAuth utility which has fallback capability
      const response = await fetchWithAuth('auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Try to parse the response as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, get the text response
        const textResponse = await response.text();
        throw new Error(`Server response is not valid JSON: ${textResponse.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Dispatch login success action
      dispatch(loginSuccess({
        token: data.token,
        user: data.user
      }));

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide a more user-friendly error message
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }}
      >
        <Box sx={{ 
          bgcolor: 'primary.main', 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar sx={{ bgcolor: 'white', mb: 1 }}>
            <LockIcon color="primary" />
          </Avatar>
          <Typography component="h1" variant="h5" color="white" fontWeight="bold">
            Sign In
          </Typography>
        </Box>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            p: 4,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              borderRadius: 2,
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              fullWidth
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Create an Account
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Add API Test component in development mode */}
      {process.env.NODE_ENV === 'development' && <ApiTest />}
    </Container>
  );
};

export default Login; 