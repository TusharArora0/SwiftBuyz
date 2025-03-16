import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
  Divider,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  ListItemIcon,
  Tooltip,
  Badge,
  ListItemSecondaryAction,
  Switch
} from '@mui/material';
import {
  Store as StoreIcon,
  ShoppingCart as OrderIcon,
  Inventory as ProductIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonetizationOn as RevenueIcon,
  People as CustomersIcon,
  LocalShipping as ShippingIcon,
  ColorLens as ColorIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  ShoppingCart,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { PLACEHOLDER_IMAGE } from '../../utils/placeholderImage';
import { isLightColor } from '../../utils/colorUtils';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#FFA500' },  // Orange
  { value: 'processing', label: 'Processing', color: '#1976D2' },  // Blue
  { value: 'shipped', label: 'Shipped', color: '#9C27B0' },  // Purple
  { value: 'delivered', label: 'Delivered', color: '#4CAF50' },  // Green
  { value: 'cancelled', label: 'Cancelled', color: '#F44336' }  // Red
];

const SellerProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    orderCompletionRate: 0,
    averageOrderValue: 0
  });
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    briefDescription: '',
    price: '',
    category: '',
    stock: '',
    images: [{
      url: '',
      isMain: true
    }],
    specifications: [],
    colors: [],
    discount: 0,
  });
  const [editProductId, setEditProductId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [colorInput, setColorInput] = useState({
    name: '',
    code: '#000000',
    stock: 0
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data
    fetchDashboardData();
    
    // Only fetch products and orders data if needed
    if (activeTab === 1) {
      fetchSellerProducts();
    }
    if (activeTab === 2) {
      fetchSellerOrders();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch seller stats
      const statsResponse = await fetch(`http://localhost:5000/api/products/seller/${user.id}/stats`, {
        headers
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Received stats data:', statsData); // Debug log
        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalCustomers: statsData.totalCustomers || 0,
          // Order status counts
          pendingOrders: statsData.pendingOrders || 0,
          processingOrders: statsData.processingOrders || 0,
          shippedOrders: statsData.shippedOrders || 0,
          deliveredOrders: statsData.deliveredOrders || 0,
          cancelledOrders: statsData.cancelledOrders || 0,
          // Performance metrics
          orderCompletionRate: statsData.orderCompletionRate || 0,
          averageOrderValue: statsData.averageOrderValue || 0
        });
      }

      // Fetch products count
      const productsResponse = await fetch(`http://localhost:5000/api/products/seller/${user.id}`, {
        headers
      });
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
        // Update stats with actual product count
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.length
        }));
      }

      // Fetch orders
      const ordersResponse = await fetch(`http://localhost:5000/api/orders/seller/${user.id}`, {
        headers
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        
        // Calculate order status counts if not provided by the API
        if (!statsResponse.ok) {
          const statusCounts = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
          };
          
          ordersData.forEach(order => {
            if (order.status in statusCounts) {
              statusCounts[order.status]++;
            }
          });
          
          setStats(prev => ({
            ...prev,
            pendingOrders: statusCounts.pending,
            processingOrders: statusCounts.processing,
            shippedOrders: statusCounts.shipped,
            deliveredOrders: statusCounts.delivered,
            cancelledOrders: statusCounts.cancelled,
            totalOrders: ordersData.length
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/seller/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
      const data = await response.json();
      setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSellerOrders = async () => {
    try {
      if (!user?._id) {
        console.log('No seller ID available');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/seller/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched seller orders:', data); // Debug log
      setOrders(data);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      setError('Failed to load orders');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Fetch data based on the selected tab
    if (newValue === 1 && products.length === 0) {
      fetchSellerProducts();
    } else if (newValue === 2 && orders.length === 0) {
      fetchSellerOrders();
    }
  };

  const handleProductSubmit = async () => {
    // Validate required fields
    if (!productData.name || !productData.description || !productData.briefDescription || 
        !productData.price || !productData.category || !productData.stock || 
        !productData.images[0]?.url) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate image URLs
    const isValidImageUrl = (url) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    if (!isValidImageUrl(productData.images[0].url)) {
      alert('Please enter a valid main image URL');
      return;
    }

    // Validate all additional images
    const invalidImages = productData.images.slice(1).filter(img => img.url && !isValidImageUrl(img.url));
    if (invalidImages.length > 0) {
      alert('Please enter valid image URLs or remove them');
      return;
    }

    // Validate colors if any are present
    if (productData.colors.length > 0) {
      const totalColorStock = productData.colors.reduce((sum, color) => sum + color.stock, 0);
      if (totalColorStock !== Number(productData.stock)) {
        alert('Total color stock must equal product stock');
        return;
      }
    }

    // Validate discount
    if (productData.discount < 0 || productData.discount > 100) {
      alert('Discount must be between 0 and 100');
      return;
    }

    // Filter out empty image URLs
    const filteredImages = productData.images.filter(img => img.url.trim() !== '');

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productData,
          images: filteredImages,
          price: Number(productData.price),
          stock: Number(productData.stock),
          discount: Number(productData.discount)
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setOpenProductDialog(false);
        setProductData({
        name: '',
        description: '',
          briefDescription: '',
        price: '',
        category: '',
        stock: '',
          images: [{
            url: '',
            isMain: true
          }],
          specifications: [],
          colors: [],
          discount: 0,
        });
        // Update stats after adding a product
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts + 1
        }));
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Error adding product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        // Update stats after deleting a product
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1
        }));
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleEditClick = (product) => {
    setProductData({
      ...product,
      discount: product.discount || 0
    });
    setEditProductId(product._id);
    setOpenEditDialog(true);
  };

  const handleProductUpdate = async () => {
    // Validate required fields
    if (!productData.name || !productData.description || !productData.briefDescription || 
        !productData.price || !productData.category || !productData.stock || 
        !productData.images[0]?.url) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate image URLs
    const isValidImageUrl = (url) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    if (!isValidImageUrl(productData.images[0].url)) {
      alert('Please enter a valid main image URL');
      return;
    }

    // Validate all additional images
    const invalidImages = productData.images.slice(1).filter(img => img.url && !isValidImageUrl(img.url));
    if (invalidImages.length > 0) {
      alert('Please enter valid image URLs or remove them');
      return;
    }

    // Validate colors if any are present
    if (productData.colors.length > 0) {
      const totalColorStock = productData.colors.reduce((sum, color) => sum + color.stock, 0);
      if (totalColorStock !== Number(productData.stock)) {
        alert('Total color stock must equal product stock');
        return;
      }
    }

    // Filter out empty image URLs
    const filteredImages = productData.images.filter(img => img.url.trim() !== '');

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${productData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productData,
          images: filteredImages,
          price: Number(productData.price),
          stock: Number(productData.stock),
          discount: Number(productData.discount)
        })
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setOpenEditDialog(false);
        // Reset product data
        setProductData({
      name: '',
      description: '',
          briefDescription: '',
      price: '',
      category: '',
      stock: '',
          images: [{
            url: '',
            isMain: true
          }],
          specifications: [],
          colors: [],
          discount: 0,
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = () => {
    if (!colorInput.name || !colorInput.code) {
      alert('Please enter both color name and color code');
      return;
    }

    // Check if color name already exists
    if (productData.colors.some(color => color.name.toLowerCase() === colorInput.name.toLowerCase())) {
      alert('This color name already exists');
      return;
    }

    // Validate stock number
    if (colorInput.stock <= 0) {
      alert('Stock must be greater than 0');
      return;
    }

    // Calculate remaining stock
    const currentTotalStock = productData.colors.reduce((sum, color) => sum + color.stock, 0);
    const totalProductStock = Number(productData.stock) || 0;
    const remainingStock = totalProductStock - currentTotalStock;

    if (colorInput.stock > remainingStock) {
      alert(`Cannot add more stock than available. Remaining stock: ${remainingStock}`);
      return;
    }

    setProductData(prev => ({
      ...prev,
      colors: [...prev.colors, { 
        name: colorInput.name.trim(),
        code: colorInput.code,
        stock: Number(colorInput.stock)
      }]
    }));
    
    // Reset color input
    setColorInput({
      name: '',
      code: '#000000',
      stock: 0
    });
  };

  const handleRemoveColor = (index) => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleStockChange = (e) => {
    const newStock = Number(e.target.value);
    const currentColorStock = productData.colors.reduce((sum, color) => sum + color.stock, 0);

    if (newStock < currentColorStock) {
      alert('Cannot set stock lower than total color stock');
      return;
    }

    setProductData(prev => ({
      ...prev,
      stock: e.target.value
    }));
  };

  const handleWishlistToggle = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/wishlist`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p._id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p
        ));
        fetchDashboardData();
      } else {
        alert('Error toggling wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error toggling wishlist');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus, currentStatus) => {
    // Prevent status change if order is cancelled or delivered
    if (currentStatus === 'cancelled' || currentStatus === 'delivered') {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state to reflect the change
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

      } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const handleViewOrderDetails = (order) => {
    console.log('View order details:', order);
  };

  const renderDashboardOverview = () => (
      <Grid container spacing={3}>
      {/* Main Stats */}
      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RevenueIcon />
              <Box>
                <Typography variant="h6">{formatPrice(stats.totalRevenue)}</Typography>
                <Typography variant="body2">Revenue (Delivered)</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <OrderIcon />
              <Box>
                <Typography variant="h6">{stats.totalOrders}</Typography>
                <Typography variant="body2">Total Orders</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ProductIcon />
              <Box>
                <Typography variant="h6">{stats.totalProducts}</Typography>
                <Typography variant="body2">Products</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomersIcon />
              <Box>
                <Typography variant="h6">{stats.totalCustomers}</Typography>
                <Typography variant="body2">Customers</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Order Status Summary */}
      <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Order Status Summary</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {ORDER_STATUS_OPTIONS.map(status => (
                <Grid item xs={12} sm={6} md={2.4} key={status.value}>
                  <Card sx={{ 
                    bgcolor: status.color + '15',
                    border: 1,
                    borderColor: status.color + '30',
                    boxShadow: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-3px)'
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: status.color, mb: 1, fontWeight: 'bold' }}>
                        {stats[`${status.value}Orders`] || 0}
            </Typography>
                      <Typography variant="body2" sx={{ color: status.color, fontWeight: 'medium' }}>
                        {status.label} Orders
              </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Grid>

      {/* Shop Performance */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Shop Performance</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <TrendingIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Order Completion Rate"
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="body2">
                          {((stats.deliveredOrders / (stats.totalOrders - stats.cancelledOrders || 1)) * 100).toFixed(1)}% completed
              </Typography>
                        <Chip 
                          size="small"
                          color={
                            ((stats.deliveredOrders / (stats.totalOrders - stats.cancelledOrders || 1)) * 100) > 80 ? 'success' : 
                            ((stats.deliveredOrders / (stats.totalOrders - stats.cancelledOrders || 1)) * 100) > 50 ? 'warning' : 'error'
                          }
                          label={`${stats.deliveredOrders || 0} of ${(stats.totalOrders - stats.cancelledOrders) || 0}`}
                        />
                      </Box>
                    </Box>
              </Typography>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CartIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Active Orders"
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" variant="body2">
                        {(stats.pendingOrders || 0) + (stats.processingOrders || 0) + (stats.shippedOrders || 0)} orders in progress
                      </Typography>
                      {(stats.pendingOrders || 0) > 0 && 
                        <Chip 
                          label={`${stats.pendingOrders} new`}
                          size="small"
                          color="warning"
                        />
                      }
            </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {stats.pendingOrders > 0 && (
                        <Chip 
                          label={`${stats.pendingOrders} pending`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                      {stats.processingOrders > 0 && (
                        <Chip 
                          label={`${stats.processingOrders} processing`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {stats.shippedOrders > 0 && (
                        <Chip 
                          label={`${stats.shippedOrders} shipped`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Typography>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <MoneyIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Average Order Value"
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(stats.deliveredOrders ? (stats.totalRevenue / stats.deliveredOrders) : 0)}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        per completed order
                      </Typography>
                    </Box>
                  </Typography>
                }
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <ShippingIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Order Status"
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="body2">
                          <strong>{stats.deliveredOrders || 0}</strong> completed
                        </Typography>
                        <Chip 
                          label={`${stats.deliveredOrders || 0} delivered`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="body2">
                          <strong>{(stats.pendingOrders || 0) + (stats.processingOrders || 0) + (stats.shippedOrders || 0)}</strong> in progress
                        </Typography>
                        {stats.pendingOrders > 0 && (
                          <Chip 
                            label={`${stats.pendingOrders} pending`}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {stats.shippedOrders > 0 && (
                          <Chip 
                            label={`${stats.shippedOrders} shipped`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      {stats.cancelledOrders > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography component="span" variant="body2">
                            <strong>{stats.cancelledOrders}</strong> cancelled
                          </Typography>
                          <Chip 
                            label={`${stats.cancelledOrders} cancelled`}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        </Box>
                      )}
                    </Box>
                  </Typography>
                }
              />
            </ListItem>
          </List>
          </Paper>
        </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => setOpenProductDialog(true)}
                sx={{ py: 2 }}
              >
                Add New Product
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<OrderIcon />}
                onClick={() => setActiveTab(2)}
                sx={{ py: 2 }}
              >
                View Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<ProductIcon />}
                onClick={() => navigate('/profile/products')}
                sx={{ py: 2 }}
              >
                Manage Products
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<ShippingIcon />}
                onClick={() => setActiveTab(2)}
                sx={{ py: 2 }}
              >
                Process Orders
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderProducts = () => (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
          Your Products
              </Typography>
              <Button
                variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenProductDialog(true)}
              >
                Add Product
              </Button>
            </Box>

      {products.length === 0 ? (
        <Alert severity="info">No products found. Add your first product!</Alert>
      ) : (
        <Grid container spacing={3}>
                  {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                  {product.discount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: 'error.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        zIndex: 1,
                      }}
                    >
                      {product.discount}% OFF
                    </Box>
                  )}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    zIndex: 1
                  }}>
                    <IconButton 
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                      onClick={() => handleEditClick(product)}
                    >
                      <EditIcon fontSize="small" />
                        </IconButton>
                    <IconButton 
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <DeleteIcon fontSize="small" />
                        </IconButton>
                  </Box>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                    alt={product.name}
                    sx={{ 
                      height: 200,
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      padding: 1
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {product.discount > 0 ? (
                      <>
                        <Typography variant="body1" color="primary" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(product.price)}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {formatPrice(product.price * (1 - product.discount/100))}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body1" color="primary">
                        {formatPrice(product.price)}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Stock: {product.stock}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    size="small" 
                    sx={{ mt: 1 }} 
                    color="primary" 
                    variant="outlined" 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
          </Paper>
  );

  const renderOrders = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Orders ({orders.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Add any additional controls here */}
        </Box>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <CartIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            When customers place orders, they will appear here.
          </Typography>
        </Paper>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </Box>
  );

  const OrdersTable = ({ orders }) => {
    const isStatusLocked = (status) => status === 'cancelled' || status === 'delivered';

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer</TableCell>
              <TableCell sx={{ color: 'white' }}>Items</TableCell>
              <TableCell sx={{ color: 'white' }}>Total</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order._id}
                sx={{ 
                  '&:hover': { backgroundColor: 'action.hover' },
                  // Add subtle background for cancelled/delivered orders
                  backgroundColor: isStatusLocked(order.status) ? 'action.hover' : 'inherit'
                }}
              >
                      <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    #{order._id.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{order.user?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.user?.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <List dense disablePadding>
                    {order.items.map((item, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemAvatar>
                          <Avatar 
                            src={item.product?.images?.[0]?.url || PLACEHOLDER_IMAGE}
                            variant="rounded"
                            sx={{ 
                              width: 40, 
                              height: 40,
                              objectFit: 'contain',
                              bgcolor: '#f5f5f5',
                              p: 0.5
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" noWrap>
                              {item.product?.name} × {item.quantity}
                            </Typography>
                          }
                          secondary={formatPrice(item.price)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value, order.status)}
                      disabled={isStatusLocked(order.status)}
                      sx={{
                        minWidth: 130,
                        '& .MuiSelect-select': {
                          py: 1,
                          typography: 'body2',
                        },
                        backgroundColor: ORDER_STATUS_OPTIONS.find(
                          option => option.value === order.status
                        )?.color + '20',
                        // Add styles for disabled state
                        '&.Mui-disabled': {
                          backgroundColor: 'action.disabledBackground',
                          opacity: 0.7
                        }
                      }}
                    >
                      {ORDER_STATUS_OPTIONS.map((option) => (
                        <MenuItem 
                          key={option.value} 
                          value={option.value}
                          disabled={
                            // Prevent selecting cancelled if current status is delivered
                            (order.status === 'delivered' && option.value === 'cancelled') ||
                            // Prevent selecting any status if current status is cancelled
                            (order.status === 'cancelled')
                          }
                          sx={{
                            typography: 'body2',
                            color: option.color,
                            '&.Mui-selected': {
                              backgroundColor: option.color + '20',
                            },
                            '&:hover': {
                              backgroundColor: option.color + '10',
                            },
                            '&.Mui-disabled': {
                              opacity: 0.5
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: option.color
                              }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isStatusLocked(order.status) && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      Status locked
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
    );
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Seller Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.shopName}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<StoreIcon />} label="Overview" />
          <Tab icon={<ProductIcon />} label="Products" />
          <Tab icon={<OrderIcon />} label="Orders" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4 }}>
        {activeTab === 0 && renderDashboardOverview()}
        {activeTab === 1 && renderProducts()}
        {activeTab === 2 && renderOrders()}
      </Box>

      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brief Description"
              value={productData.briefDescription}
              onChange={(e) => setProductData({ ...productData, briefDescription: e.target.value })}
              helperText="A short summary of the product (max 200 characters)"
              inputProps={{ maxLength: 200 }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Full Description"
              multiline
              rows={4}
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Main Image URL"
              value={productData.images[0]?.url || ''}
              onChange={(e) => setProductData({
                ...productData,
                images: [
                  { url: e.target.value, isMain: true },
                  ...productData.images.slice(1)
                ]
              })}
              margin="normal"
              helperText="Enter a valid image URL (e.g., https://example.com/image.jpg)"
              error={productData.images[0]?.url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(productData.images[0].url)}
              required
            />
            
            {/* Image Preview */}
            {productData.images[0]?.url && (
              <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>Main Image Preview:</Typography>
                <Box
                  component="img"
                  src={productData.images[0].url}
                  alt="Main product image preview"
                  sx={{
                    maxHeight: 150,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 1
                  }}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                    e.target.onerror = null;
                  }}
                />
              </Box>
            )}
            
            {/* Additional Image Fields (up to 4 more) */}
            {[1, 2, 3, 4].map((index) => (
              <React.Fragment key={index}>
                <TextField
                  fullWidth
                  label={`Additional Image URL ${index} (Optional)`}
                  value={productData.images[index]?.url || ''}
                  onChange={(e) => {
                    const newImages = [...productData.images];
                    if (e.target.value) {
                      if (newImages[index]) {
                        newImages[index].url = e.target.value;
                      } else {
                        // Fill any gaps in the array
                        for (let i = newImages.length; i < index; i++) {
                          newImages.push({ url: '', isMain: false });
                        }
                        newImages.push({ url: e.target.value, isMain: false });
                      }
                    } else if (newImages[index]) {
                      newImages[index].url = '';
                      // Remove empty entries at the end
                      let lastNonEmpty = newImages.length - 1;
                      while (lastNonEmpty >= 0 && newImages[lastNonEmpty].url === '') {
                        lastNonEmpty--;
                      }
                      newImages.splice(lastNonEmpty + 1);
                      // Ensure we always have at least the main image
                      if (newImages.length === 0) {
                        newImages.push({ url: '', isMain: true });
                      }
                    }
                    setProductData({ ...productData, images: newImages });
                  }}
                  margin="normal"
                  helperText="Enter a valid image URL (optional)"
                  error={productData.images[index]?.url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(productData.images[index].url)}
                />
                
                {/* Additional Image Preview */}
                {productData.images[index]?.url && (
                  <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>Image {index} Preview:</Typography>
                    <Box
                      component="img"
                      src={productData.images[index].url}
                      alt={`Product image ${index} preview`}
                      sx={{
                        maxHeight: 100,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1
                      }}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                        e.target.onerror = null;
                      }}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              You can add up to 5 images (1 main + 4 additional)
            </Typography>
            
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              margin="normal"
            >
              {[
                { value: 'electronics', label: 'Electronics' },
                { value: 'fashion', label: 'Fashion' },
                { value: 'books', label: 'Books' },
                { value: 'home', label: 'Home & Kitchen' }
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={productData.stock}
              onChange={handleStockChange}
              margin="normal"
              helperText={
                productData.colors.length > 0 
                  ? `Allocated to colors: ${productData.colors.reduce((sum, color) => sum + color.stock, 0)}` 
                  : ''
              }
            />
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              value={productData.discount}
              onChange={(e) => {
                const value = Math.min(100, Math.max(0, Number(e.target.value)));
                setProductData(prev => ({
                  ...prev,
                  discount: value
                }));
              }}
              margin="normal"
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
              helperText="Enter discount percentage (0-100)"
            />
            
            {/* Technical Specifications Section */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Technical Specifications
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Add technical details like dimensions, materials, features, etc.
              </Typography>
              
              {productData.specifications.map((spec, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Specification Name"
                    value={spec.name}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].name = e.target.value;
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].value = e.target.value;
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      const newSpecs = [...productData.specifications];
                      newSpecs.splice(index, 1);
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProductData({
                    ...productData,
                    specifications: [...productData.specifications, { name: '', value: '' }]
                  });
                }}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Specification
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Color Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Color Name"
                  size="small"
                  value={colorInput.name}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  error={colorInput.name && productData.colors.some(
                    color => color.name.toLowerCase() === colorInput.name.toLowerCase()
                  )}
                  helperText={colorInput.name && productData.colors.some(
                    color => color.name.toLowerCase() === colorInput.name.toLowerCase()
                  ) ? 'Color name already exists' : ''}
                />
                <TextField
                  label="Color Code"
                  size="small"
                  type="color"
                  value={colorInput.code}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    code: e.target.value
                  }))}
                  sx={{ width: 100 }}
                />
                <TextField
              label="Stock"
                  size="small"
              type="number"
                  value={colorInput.stock}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0
                  }))}
                  sx={{ width: 100 }}
                  helperText={`Available: ${Number(productData.stock) - productData.colors.reduce((sum, color) => sum + color.stock, 0)}`}
                />
                <Button
                  variant="outlined"
                  startIcon={<ColorIcon />}
                  onClick={handleAddColor}
                  disabled={
                    !colorInput.name || 
                    !colorInput.code || 
                    colorInput.stock <= 0 ||
                    productData.colors.some(color => color.name.toLowerCase() === colorInput.name.toLowerCase())
                  }
                >
                  Add Color
                </Button>
              </Box>
              
              {productData.colors.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {productData.colors.map((color, index) => (
                    <Chip
                      key={index}
                      label={`${color.name} (${color.stock})`}
                      onDelete={() => handleRemoveColor(index)}
                      sx={{
                        backgroundColor: color.code,
                        color: isLightColor(color.code) ? 'black' : 'white',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleProductSubmit} 
            variant="contained"
            disabled={loading}
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brief Description"
              value={productData.briefDescription}
              onChange={(e) => setProductData({ ...productData, briefDescription: e.target.value })}
              helperText="A short summary of the product (max 200 characters)"
              inputProps={{ maxLength: 200 }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Full Description"
              multiline
              rows={4}
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Main Image URL"
              value={productData.images[0]?.url || ''}
              onChange={(e) => setProductData({
                ...productData,
                images: [
                  { url: e.target.value, isMain: true },
                  ...productData.images.slice(1)
                ]
              })}
              margin="normal"
              helperText="Enter a valid image URL (e.g., https://example.com/image.jpg)"
              error={productData.images[0]?.url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(productData.images[0].url)}
              required
            />
            
            {/* Image Preview */}
            {productData.images[0]?.url && (
              <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>Main Image Preview:</Typography>
                <Box
                  component="img"
                  src={productData.images[0].url}
                  alt="Main product image preview"
                  sx={{
                    maxHeight: 150,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 1
                  }}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                    e.target.onerror = null;
                  }}
                />
              </Box>
            )}
            
            {/* Additional Image Fields (up to 4 more) */}
            {[1, 2, 3, 4].map((index) => (
              <React.Fragment key={index}>
                <TextField
                  fullWidth
                  label={`Additional Image URL ${index} (Optional)`}
                  value={productData.images[index]?.url || ''}
                  onChange={(e) => {
                    const newImages = [...productData.images];
                    if (e.target.value) {
                      if (newImages[index]) {
                        newImages[index].url = e.target.value;
                      } else {
                        // Fill any gaps in the array
                        for (let i = newImages.length; i < index; i++) {
                          newImages.push({ url: '', isMain: false });
                        }
                        newImages.push({ url: e.target.value, isMain: false });
                      }
                    } else if (newImages[index]) {
                      newImages[index].url = '';
                      // Remove empty entries at the end
                      let lastNonEmpty = newImages.length - 1;
                      while (lastNonEmpty >= 0 && newImages[lastNonEmpty].url === '') {
                        lastNonEmpty--;
                      }
                      newImages.splice(lastNonEmpty + 1);
                      // Ensure we always have at least the main image
                      if (newImages.length === 0) {
                        newImages.push({ url: '', isMain: true });
                      }
                    }
                    setProductData({ ...productData, images: newImages });
                  }}
                  margin="normal"
                  helperText="Enter a valid image URL (optional)"
                  error={productData.images[index]?.url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(productData.images[index].url)}
                />
                
                {/* Additional Image Preview */}
                {productData.images[index]?.url && (
                  <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>Image {index} Preview:</Typography>
                    <Box
                      component="img"
                      src={productData.images[index].url}
                      alt={`Product image ${index} preview`}
                      sx={{
                        maxHeight: 100,
                        maxWidth: '100%',
                        objectFit: 'contain',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1
                      }}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                        e.target.onerror = null;
                      }}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              You can add up to 5 images (1 main + 4 additional)
            </Typography>
            
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              margin="normal"
            >
              {[
                { value: 'electronics', label: 'Electronics' },
                { value: 'fashion', label: 'Fashion' },
                { value: 'books', label: 'Books' },
                { value: 'home', label: 'Home & Kitchen' }
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={productData.stock}
              onChange={handleStockChange}
              margin="normal"
              helperText={
                productData.colors.length > 0 
                  ? `Allocated to colors: ${productData.colors.reduce((sum, color) => sum + color.stock, 0)}` 
                  : ''
              }
            />
            <TextField
              fullWidth
              label="Discount (%)"
              type="number"
              value={productData.discount}
              onChange={(e) => {
                const value = Math.min(100, Math.max(0, Number(e.target.value)));
                setProductData(prev => ({
                  ...prev,
                  discount: value
                }));
              }}
              margin="normal"
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
              helperText="Enter discount percentage (0-100)"
            />
            
            {/* Technical Specifications Section */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Technical Specifications
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Add technical details like dimensions, materials, features, etc.
              </Typography>
              
              {productData.specifications.map((spec, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Specification Name"
                    value={spec.name}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].name = e.target.value;
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...productData.specifications];
                      newSpecs[index].value = e.target.value;
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      const newSpecs = [...productData.specifications];
                      newSpecs.splice(index, 1);
                      setProductData({ ...productData, specifications: newSpecs });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProductData({
                    ...productData,
                    specifications: [...productData.specifications, { name: '', value: '' }]
                  });
                }}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Specification
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Color Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Color Name"
                  size="small"
                  value={colorInput.name}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  error={colorInput.name && productData.colors.some(
                    color => color.name.toLowerCase() === colorInput.name.toLowerCase()
                  )}
                  helperText={colorInput.name && productData.colors.some(
                    color => color.name.toLowerCase() === colorInput.name.toLowerCase()
                  ) ? 'Color name already exists' : ''}
                />
                <TextField
                  label="Color Code"
                  size="small"
                  type="color"
                  value={colorInput.code}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    code: e.target.value
                  }))}
                  sx={{ width: 100 }}
                />
                <TextField
                  label="Stock"
                  size="small"
                  type="number"
                  value={colorInput.stock}
                  onChange={(e) => setColorInput(prev => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0
                  }))}
                  sx={{ width: 100 }}
                  helperText={`Available: ${Number(productData.stock) - productData.colors.reduce((sum, color) => sum + color.stock, 0)}`}
                />
                <Button
                  variant="outlined"
                  startIcon={<ColorIcon />}
                  onClick={handleAddColor}
                  disabled={
                    !colorInput.name || 
                    !colorInput.code || 
                    colorInput.stock <= 0 ||
                    productData.colors.some(color => color.name.toLowerCase() === colorInput.name.toLowerCase())
                  }
                >
                  Add Color
                </Button>
              </Box>
              
              {productData.colors.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {productData.colors.map((color, index) => (
                    <Chip
                      key={index}
                      label={`${color.name} (${color.stock})`}
                      onDelete={() => handleRemoveColor(index)}
                      sx={{
                        backgroundColor: color.code,
                        color: isLightColor(color.code) ? 'black' : 'white',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenEditDialog(false);
            setEditProductId(null);
            setProductData({
              name: '',
              description: '',
              briefDescription: '',
              price: '',
              category: '',
              stock: '',
              images: [{
                url: '',
                isMain: true
              }],
              specifications: [],
              colors: [],
              discount: 0,
            });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleProductUpdate} 
            variant="contained"
            disabled={loading}
          >
            Update Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerProfile; 