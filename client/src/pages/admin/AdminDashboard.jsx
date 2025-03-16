import { useState, useEffect } from 'react';
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
  Switch,
  ListItemSecondaryAction,
  Fab,
  Snackbar,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as SellersIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalShipping as OrdersIcon,
  Report as ReportsIcon,
  Refresh as RefreshIcon,
  MonetizationOn as RevenueIcon,
  Inventory as ProductsIcon,
} from '@mui/icons-material';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    revenue: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: [],
    orderStats: {},
    dailyRevenue: []
  });
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch stats
      const statsResponse = await fetch('swiftbuyz-five.vercel.app/api/admin/stats', {
        headers
      });
      if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(errorData.message || 'Failed to fetch stats');
      }
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch all users
      const usersResponse = await fetch('swiftbuyz-five.vercel.app/api/admin/users', {
        headers
      });
      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      if (Array.isArray(usersData)) {
        setUsers(usersData.filter(user => user.profileType === 'consumer'));
      } else {
        console.error('Users data is not an array:', usersData);
        setUsers([]);
      }

      // Fetch all sellers
      const sellersResponse = await fetch('swiftbuyz-five.vercel.app/api/admin/sellers', {
        headers
      });
      if (!sellersResponse.ok) {
        const errorData = await sellersResponse.json();
        throw new Error(errorData.message || 'Failed to fetch sellers');
      }
      const sellersData = await sellersResponse.json();
      if (Array.isArray(sellersData)) {
        setSellers(sellersData);
      } else {
        console.error('Sellers data is not an array:', sellersData);
        setSellers([]);
      }

      // Fetch all orders
      const ordersResponse = await fetch('swiftbuyz-five.vercel.app/api/admin/orders', {
        headers
      });
      if (!ordersResponse.ok) {
        const errorData = await ordersResponse.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }
      const ordersData = await ordersResponse.json();
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else {
        console.error('Orders data is not an array:', ordersData);
        setOrders([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserStatusChange = async (userId, isBlocked) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`swiftbuyz-five.vercel.app/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked })
      });

      if (response.ok) {
        setSuccess(`User status updated successfully`);
        // Refresh users data
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleSellerApproval = async (sellerId, isApproved) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`swiftbuyz-five.vercel.app/api/admin/sellers/${sellerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved })
      });

      if (response.ok) {
        setSuccess(`Seller ${isApproved ? 'approved' : 'unapproved'} successfully`);
        // Refresh sellers data
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update seller status');
      }
    } catch (error) {
      console.error('Error updating seller status:', error);
      setError('Failed to update seller status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`swiftbuyz-five.vercel.app/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove user from both users and sellers lists
        setUsers(users.filter(user => user._id !== userToDelete._id));
        setSellers(sellers.filter(seller => seller._id !== userToDelete._id));
        setSuccess(`User ${userToDelete.name} deleted successfully`);
        setError('');
        // Refresh dashboard data to update counts
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  const renderDashboardOverview = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Dashboard Overview</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outlined"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <UsersIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                  <Typography variant="body2">Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SellersIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats.totalSellers}</Typography>
                  <Typography variant="body2">Total Sellers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <OrdersIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
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
                <RevenueIcon fontSize="large" />
                <Box>
                  <Typography variant="h4">{formatPrice(stats.revenue || 0)}</Typography>
                  <Typography variant="body2">Total Revenue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <List>
                {stats.recentOrders.map((order) => (
                  <ListItem key={order._id} divider>
                    <ListItemText
                      primary={`Order #${order._id.slice(-6)}`}
                      secondary={`${order.user?.name || 'Unknown'} - ${formatPrice(order.totalAmount)}`}
                    />
                    <Chip 
                      label={order.status} 
                      color={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'processing' ? 'warning' :
                        order.status === 'cancelled' ? 'error' : 'default'
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No recent orders</Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Low Stock Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Low Stock Products</Typography>
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <List>
                {stats.lowStockProducts.map((product) => (
                  <ListItem key={product._id} divider>
                    <ListItemText
                      primary={product.name}
                      secondary={`Price: ${formatPrice(product.price)}`}
                    />
                    <Chip 
                      label={`Stock: ${product.stock}`} 
                      color={product.stock === 0 ? 'error' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No low stock products</Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Order Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Status</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(stats.orderStats || {}).map(([status, count]) => (
                <Grid item xs={6} sm={4} md={2} key={status}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5">{count}</Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderUsers = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Manage Users</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Total: {users.length} users
        </Typography>
      </Box>
      
      {users.length === 0 ? (
        <Alert severity="info">No users found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={!user.isBlocked}
                        onChange={() => handleUserStatusChange(user._id, !user.isBlocked)}
                        color="primary"
                        disabled={loading}
                      />
                      <Typography variant="caption" color={user.isBlocked ? "error" : "success"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(user)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  const renderSellers = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Manage Sellers</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Total: {sellers.length} sellers
        </Typography>
      </Box>
      
      {sellers.length === 0 ? (
        <Alert severity="info">No sellers found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shop Name</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell>{seller.shopName || 'N/A'}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={seller.isApproved}
                        onChange={() => handleSellerApproval(seller._id, !seller.isApproved)}
                        color="primary"
                        disabled={loading}
                      />
                      <Typography variant="caption" color={seller.isApproved ? "success" : "error"}>
                        {seller.isApproved ? "Approved" : "Pending"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(seller)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  const renderOrders = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Manage Orders</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Total: {orders.length} orders
        </Typography>
      </Box>
      
      {orders.length === 0 ? (
        <Alert severity="info">No orders found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                // Ensure payment status is consistent with order status
                let displayPaymentStatus = order.paymentStatus;
                if (order.status === 'delivered' && order.paymentStatus === 'pending') {
                  displayPaymentStatus = 'completed';
                } else if (order.status === 'cancelled') {
                  displayPaymentStatus = order.paymentStatus === 'completed' ? 'refunded' : 'cancelled';
                }
                
                return (
                  <TableRow key={order._id}>
                    <TableCell>#{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'processing' ? 'warning' :
                          order.status === 'shipped' ? 'info' :
                          order.status === 'cancelled' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={displayPaymentStatus}
                        color={
                          displayPaymentStatus === 'completed' ? 'success' :
                          displayPaymentStatus === 'pending' ? 'warning' :
                          displayPaymentStatus === 'refunded' ? 'info' :
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary"
                        onClick={() => handleViewOrderDetails(order)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  // Add a function to handle viewing order details
  const handleViewOrderDetails = (order) => {
    // For now, just show an alert with order details
    setSuccess(`Viewing details for Order #${order._id.slice(-6)}`);
    console.log('Order details:', order);
    // In a real implementation, you would open a dialog with order details
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<UsersIcon />} label="Users" />
          <Tab icon={<SellersIcon />} label="Sellers" />
          <Tab icon={<OrdersIcon />} label="Orders" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4 }}>
        {activeTab === 0 && renderDashboardOverview()}
        {activeTab === 1 && renderUsers()}
        {activeTab === 2 && renderSellers()}
        {activeTab === 3 && renderOrders()}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {userToDelete?.name}? 
          </Typography>
          {userToDelete?.profileType === 'seller' && (
            <Typography color="error" sx={{ mt: 1 }}>
              This will also delete all products associated with this seller.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={success}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          onClose={handleCloseSnackbar}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default AdminDashboard; 