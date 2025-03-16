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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { API_URL, fetchWithAuth } from '../utils/apiConfig';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: code, 3: new password
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetShowPassword, setResetShowPassword] = useState(false);

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

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Dispatch login action
      dispatch(login({
        token: data.token,
        user: data.user
      }));

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handlers
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetStep(1);
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetSuccess('');
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  const handleRequestReset = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset code');
      }

      // In development mode, show the reset code to the user
      if (data.resetCode) {
        setResetSuccess(`Reset code sent to your email: ${data.resetCode} (This is only shown in development mode)`);
      } else {
        setResetSuccess('Reset code sent to your email');
      }
      
      setResetStep(2);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode) {
      setResetError('Please enter the reset code');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail, code: resetCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid reset code');
      }

      setResetSuccess('Code verified successfully');
      setResetStep(3);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setResetError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setResetSuccess('Password reset successfully');
      setResetModalOpen(false);
      
      // Clear form
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setResetStep(1);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setResetSuccess('');
  };

  const renderForgotPasswordContent = () => {
    switch (resetStep) {
      case 1:
        return (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: 'primary.light',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon />
                <Typography variant="h6">Forgot Password</Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleForgotPasswordClose}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a code to reset your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              {resetError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {resetError}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={handleForgotPasswordClose}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestReset}
                variant="contained"
                disabled={resetLoading}
                sx={{ borderRadius: 2 }}
              >
                {resetLoading ? <CircularProgress size={24} /> : 'Send Reset Code'}
              </Button>
            </DialogActions>
          </>
        );
      case 2:
        return (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: 'primary.light',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon />
                <Typography variant="h6">Verify Reset Code</Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleForgotPasswordClose}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Enter the 6-digit code sent to your email address.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Reset Code"
                type="text"
                fullWidth
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                variant="outlined"
                sx={{ 
                  '& input': { 
                    letterSpacing: '0.5em',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  } 
                }}
              />
              {resetError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {resetError}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={() => setResetStep(1)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyCode}
                variant="contained"
                disabled={resetLoading}
                sx={{ borderRadius: 2 }}
              >
                {resetLoading ? <CircularProgress size={24} /> : 'Verify Code'}
              </Button>
            </DialogActions>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: 'primary.light',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon />
                <Typography variant="h6">Reset Password</Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleForgotPasswordClose}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Enter your new password.
              </Typography>
              <TextField
                margin="dense"
                label="New Password"
                type={resetShowPassword ? 'text' : 'password'}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setResetShowPassword(!resetShowPassword)}
                        edge="end"
                      >
                        {resetShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                type={resetShowPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setResetShowPassword(!resetShowPassword)}
                        edge="end"
                      >
                        {resetShowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {resetError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {resetError}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={() => setResetStep(2)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              <Button
                onClick={handleResetPassword}
                variant="contained"
                disabled={resetLoading}
                sx={{ borderRadius: 2 }}
              >
                {resetLoading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </DialogActions>
          </>
        );
      default:
        return null;
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
            <LockIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Sign In
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Enter your credentials to access your account
          </Typography>
        </Box>
        
        <Box sx={{ p: 3, pt: 4 }}>
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
          
          <Box component="form" onSubmit={handleSubmit}>
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
              sx={{ mb: 2 }}
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
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={handleForgotPasswordOpen}
                sx={{ 
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Link>
            </Box>
            
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
        </Box>
      </Paper>

      {/* Forgot Password Dialog */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleForgotPasswordClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {renderForgotPasswordContent()}
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!resetSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={resetSuccess}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default Login; 