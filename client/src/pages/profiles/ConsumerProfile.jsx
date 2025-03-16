import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  FormControlLabel,
  Switch,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalShipping as ShippingIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { loginSuccess } from '../../store/slices/authSlice';
import { addToCart } from '../../store/slices/cartSlice';
import OrderHistory from '../../components/OrderHistory';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../../utils/placeholderImage';

const ConsumerProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's an active tab in the location state
  const initialTab = location.state?.activeTab || 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    // Fetch wishlist data when the wishlist tab is active
    if (activeTab === 3) {
      fetchWishlist();
    }
  }, [activeTab, token]);

  const fetchWishlist = async () => {
    if (!token) return;
    
    setWishlistLoading(true);
    try {
      const response = await fetch('swiftbuyz-five.vercel.app/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load wishlist items');
      setTimeout(() => setError(null), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`swiftbuyz-five.vercel.app/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setWishlist(items => items.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    handleRemoveFromWishlist(product._id);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddressSubmit = async () => {
    try {
      setAddressLoading(true);
      
      // If editing an existing address, update it
      if (editingAddress !== null) {
        // For now, we'll delete the old address and add the new one
        // since the API doesn't support direct updates
        await handleDeleteAddress(editingAddress, false);
      }
      
      const response = await fetch('swiftbuyz-five.vercel.app/api/users/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: newAddress
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      const data = await response.json();
      
      // Update Redux store
      dispatch(loginSuccess({
        user: data.user,
        token: token
      }));

      // Update local addresses state
      setAddresses(data.user.addresses || []);
      
      setOpenAddressDialog(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
      });
      setEditingAddress(null);
      setSuccess('Address saved successfully!');
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('Error saving address:', error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (index) => {
    setEditingAddress(index);
    setNewAddress(addresses[index]);
    setOpenAddressDialog(true);
  };

  const handleDeleteAddress = async (index, showFeedback = true) => {
    try {
      setAddressLoading(true);
      const response = await fetch(`swiftbuyz-five.vercel.app/api/users/address/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      const data = await response.json();
      
      // Update local state
      setAddresses(data.user.addresses || []);

      // Update Redux store
      dispatch(loginSuccess({
        user: data.user,
        token: token
      }));

      if (showFeedback) {
        setSuccess('Address deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }

    } catch (error) {
      if (showFeedback) {
        setError(error.message);
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setOpenEdit(true);
    setError(null);
    setSuccess(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setError(null);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`swiftbuyz-five.vercel.app/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update the user in Redux store
      dispatch(loginSuccess({
        user: data.user,
        token: token
      }));

      setSuccess(true);
      setTimeout(() => {
        setOpenEdit(false);
        setSuccess(false);
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  const renderProfile = () => (
    <Paper sx={{ p: 4, mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.profileType?.charAt(0).toUpperCase() + user?.profileType?.slice(1)} Account
            </Typography>
          </Box>
        </Box>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          onClick={handleEditOpen}
          sx={{ borderRadius: 2 }}
        >
          Edit Profile
        </Button>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmailIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">Email</Typography>
          </Box>
          <Typography variant="body1">{user?.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PhoneIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">Phone</Typography>
          </Box>
          <Typography variant="body1">{user?.phone || 'Not provided'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">Default Address</Typography>
          </Box>
          {addresses.find(addr => addr.isDefault) ? (
            <Box>
              <Typography variant="body1">
                {addresses.find(addr => addr.isDefault).street}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${addresses.find(addr => addr.isDefault).city}, ${addresses.find(addr => addr.isDefault).state} ${addresses.find(addr => addr.isDefault).zipCode}, ${addresses.find(addr => addr.isDefault).country}`}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No default address set
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );

  const renderAddresses = () => (
    <Paper sx={{ p: 4, mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Shipping Addresses</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => {
            setNewAddress({
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              isDefault: false,
            });
            setEditingAddress(null);
            setOpenAddressDialog(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add New Address
        </Button>
      </Box>

      {addressLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : addresses.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2, 
            py: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography>You haven't added any addresses yet. Add an address to make checkout faster.</Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((address, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 2,
                  height: '100%',
                  position: 'relative',
                  border: address.isDefault ? '2px solid' : 'none',
                  borderColor: 'primary.main'
                }}
              >
                {address.isDefault && (
                  <Chip 
                    label="Default" 
                    color="primary" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      fontWeight: 'bold'
                    }} 
                  />
                )}
                <CardContent sx={{ pt: 3, pb: 1 }}>
            <Typography variant="h6" gutterBottom>
                    {address.street}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {`${address.city}, ${address.state} ${address.zipCode}`}
                    </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {address.country}
                    </Typography>
                  </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit Address">
                    <IconButton 
                      color="primary"
                      onClick={() => handleEditAddress(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Address">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
                </Card>
            </Grid>
          ))}
        </Grid>
            )}
          </Paper>
  );

  const renderOrderHistory = () => (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Order History
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to="/profile/orders"
          startIcon={<HistoryIcon />}
          sx={{ borderRadius: 2 }}
        >
          View All Orders
        </Button>
      </Box>
      <OrderHistory />
    </Paper>
  );

  const renderWishlist = () => (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Wishlist
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to="/wishlist"
          startIcon={<FavoriteIcon />}
          sx={{ borderRadius: 2 }}
        >
          View All Wishlist Items
        </Button>
      </Box>
      
      {wishlistLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : wishlist.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2, 
            py: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography>Your wishlist is empty. Browse products and add items to your wishlist!</Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                borderRadius: 2, 
                boxShadow: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${item._id}`)}
                />
                <CardContent sx={{ pb: 0 }}>
                  <Typography variant="h6" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: 'hidden' }}>
                    {item.briefDescription?.substring(0, 60)}
                    {item.briefDescription?.length > 60 ? '...' : ''}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    startIcon={<CartIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.stock}
                    sx={{ flexGrow: 1, borderRadius: 2 }}
                  >
                    Add to Cart
                  </Button>
                  <Tooltip title="Remove from Wishlist">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4, borderRadius: 2, boxShadow: 2, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontWeight: 'medium'
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Profile" 
            iconPosition="start"
          />
          <Tab 
            icon={<ShippingIcon />} 
            label="Addresses" 
            iconPosition="start"
            sx={{ position: 'relative' }}
          />
          <Tab 
            icon={<HistoryIcon />} 
            label="Orders" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge 
                badgeContent={wishlist.length} 
                color="error"
                max={99}
                sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}
              >
                <FavoriteIcon />
              </Badge>
            } 
            label="Wishlist" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {activeTab === 0 && renderProfile()}
      {activeTab === 1 && renderAddresses()}
      {activeTab === 2 && renderOrderHistory()}
      {activeTab === 3 && renderWishlist()}

      <Dialog 
        open={openEdit} 
        onClose={handleEditClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h5" fontWeight="bold">Edit Profile</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Profile updated successfully!
              </Alert>
            )}
            <TextField
              fullWidth
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleEditClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={success}
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openAddressDialog} 
        onClose={() => setOpenAddressDialog(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="address-dialog-title"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="address-dialog-title" sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {editingAddress !== null ? 'Edit Address' : 'Add New Address'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Street Address"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="ZIP Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  color="primary"
                />
              }
              label="Set as default address"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setOpenAddressDialog(false);
              setNewAddress({
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                isDefault: false,
              });
              setEditingAddress(null);
              setError(null);
            }}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddressSubmit} 
            variant="contained"
            disabled={!newAddress.street || !newAddress.city || !newAddress.state || 
                     !newAddress.zipCode || !newAddress.country || addressLoading}
            sx={{ borderRadius: 2 }}
            startIcon={addressLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {addressLoading ? 'Saving...' : (editingAddress !== null ? 'Save Changes' : 'Add Address')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsumerProfile; 