import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { PLACEHOLDER_IMAGE } from '../../utils/placeholderImage';
import { formatPrice } from '../../utils/formatPrice';

const SellerProducts = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/products/seller/${user.id}`, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`https://swiftbuyz-five.vercel.app/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditClick = (product) => {
    navigate('/profile', { state: { activeTab: 1, editProduct: product } });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">
            Your Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/profile', { state: { activeTab: 1, openProductDialog: true } })}
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
                      sx={{ objectFit: 'cover' }}
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
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default SellerProducts; 