import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Container,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isStandalonePage = location.pathname === '/profile/orders';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://swiftbuyz-five.vercel.app/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders data:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setSuccess('Order cancelled successfully');
      fetchOrders(); // Refresh orders
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to cancel order');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const renderReturnPolicy = () => (
    <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Return & Refund Policy</Typography>
      </Box>
      <Typography variant="body2" paragraph>
        All prices displayed are in <strong>Indian Rupees (INR)</strong>. Please note our return policy:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Return Eligibility
              </Typography>
              <Typography variant="body2">
                • Items can be returned within 7 days of delivery<br />
                • Products must be unused and in original packaging<br />
                • Certain items like perishables and personalized products cannot be returned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Refund Process
              </Typography>
              <Typography variant="body2">
                • Refunds are processed within 5-7 business days<br />
                • Original payment method will be refunded<br />
                • Shipping charges are non-refundable unless item was defective
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          component={Link} 
          to="/return-policy" 
          color="primary" 
          endIcon={<ArrowForwardIcon />}
        >
          View Full Return Policy
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        For initiating a return, please contact our customer support at support@example.com with your order number.
      </Typography>
    </Paper>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (!orders || orders.length === 0) {
      return (
        <Alert severity="info" icon={<InfoIcon />}>
          You haven't placed any orders yet.
        </Alert>
      );
    }

    return (
      <Box>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {orders.map((order) => (
          <Accordion key={order._id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.createdAt ? formatDate(order.createdAt) : 'Date not available'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Chip
                    icon={<ShippingIcon />}
                    label={order.status ? order.status.toUpperCase() : 'PROCESSING'}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" align="right" component="div">
                    {formatPrice(order.totalAmount)} 
                    <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                      INR
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                <Grid container spacing={2}>
                  {order.items && order.items.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            variant="rounded" 
                            src={
                              item.product && 
                              typeof item.product === 'object' && 
                              item.product.images && 
                              item.product.images.length > 0 
                                ? item.product.images[0].url 
                                : PLACEHOLDER_IMAGE
                            } 
                            alt={item.product && typeof item.product === 'object' ? item.product.name : 'Product'}
                            sx={{ width: 60, height: 60, borderRadius: 1 }}
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">
                              {item.product && typeof item.product === 'object' 
                                ? item.product.name 
                                : 'Product'} × {item.quantity}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary" component="span">
                                Price: {formatPrice(item.price)} 
                              </Typography>
                              <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                                INR
                              </Typography>
                              {item.discount > 0 && (
                                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                                  ({item.discount}% off)
                                </Typography>
                              )}
                            </Box>
                            {order.status === 'delivered' && (
                              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                Eligible for return until {
                                  formatDate(new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000))
                                }
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />

                {order.shippingAddress && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography>
                      {order.shippingAddress.street}
                    </Typography>
                    <Typography>
                      {`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`}
                    </Typography>
                    <Typography gutterBottom>
                      {order.shippingAddress.country}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                <Typography>
                  Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                </Typography>
                <Typography>
                  Status: {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" component="span">
                    Total Amount: {formatPrice(order.totalAmount)} 
                  </Typography>
                  <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                    INR
                  </Typography>
                </Box>

                {order.status === 'pending' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelOrder(order._id)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Order
                  </Button>
                )}
                
                {order.status === 'delivered' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => window.open('mailto:support@example.com?subject=Return Request for Order ' + order._id.slice(-6))}
                  >
                    Request Return
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  if (isStandalonePage) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            My Orders
          </Typography>
          {renderContent()}
        </Paper>
        {renderReturnPolicy()}
      </Container>
    );
  }

  return renderContent();
};

export default OrderHistory; 