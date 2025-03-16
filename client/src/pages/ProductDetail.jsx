import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Badge,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  YouTube as YouTubeIcon,
  PhotoCamera,
  Videocam,
  Close as CloseIcon,
  FlashOn as FlashOnIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '../utils/placeholderImage';
import { fetchWithAuth } from '../utils/api';

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    photos: [],
    video: null
  });
  const [selectedColor, setSelectedColor] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;

      try {
        const response = await fetchWithAuth(`swiftbuyz-five.vercel.app/api/wishlist/check/${id}`);
        if (response.ok) {
          const { isWishlisted } = await response.json();
          setIsWishlisted(isWishlisted);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    if (product) {
      checkWishlistStatus();
    }
  }, [product, id, user]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`swiftbuyz-five.vercel.app/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
      setSelectedImage(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      showSnackbar('Please select a color', 'error');
      return;
    }
    if (product.stock <= 0) {
      showSnackbar('This product is out of stock', 'error');
      return;
    }
    dispatch(addToCart({ 
      ...product, 
      quantity,
      selectedColor: selectedColor || null 
    }));
    showSnackbar('Added to cart successfully!', 'success');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      showSnackbar('Please select a color', 'error');
      return;
    }
    if (product.stock <= 0) {
      showSnackbar('This product is out of stock', 'error');
      return;
    }
    dispatch(addToCart({ 
      ...product, 
      quantity,
      selectedColor: selectedColor || null 
    }));
    navigate('/checkout');
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch(`swiftbuyz-five.vercel.app/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        setReviewDialog(false);
        setReviewData({ rating: 5, comment: '', photos: [], video: null });
        showSnackbar('Review added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      showSnackbar('Failed to add review', 'error');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`swiftbuyz-five.vercel.app/api/wishlist/${id}`, {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        showSnackbar(
          isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 
          'success'
        );
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showSnackbar('Failed to update wishlist', 'error');
    }
  };

  const handleExternalReviews = () => {
    const searchQuery = `${product.name} ${product.category} review`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    
    window.open(youtubeUrl, '_blank');
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    setReviewData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles].slice(0, 3) // Limit to 3 photos
    }));
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/') && file.size <= 50 * 1024 * 1024) { // 50MB limit
      setReviewData(prev => ({
        ...prev,
        video: file
      }));
    } else {
      alert('Please select a valid video file under 50MB');
    }
  };

  const removePhoto = (index) => {
    setReviewData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = () => {
    setReviewData(prev => ({
      ...prev,
      video: null
    }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
        {/* Product Images */}
          <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ mb: 2, position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
            <img
                src={product.images[selectedImage]?.url || PLACEHOLDER_IMAGE}
              alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  padding: '16px'
                }}
              />
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
                    fontWeight: 'bold',
                    boxShadow: 2,
                  }}
                >
                  {product.discount}% OFF
                </Box>
              )}
            </Box>
            {product.images?.length > 1 && (
              <ImageList sx={{ height: 100, mt: 2 }} cols={4} rowHeight={100}>
                {product.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      style={{ 
                        height: '100%', 
                        width: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        padding: 4
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
          
          {/* Watch Reviews Card */}
          <Card 
            sx={{ 
              mt: 2, 
              borderRadius: 2, 
              boxShadow: 3,
              background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
              }
            }}
            onClick={handleExternalReviews}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Watch Video Reviews
                </Typography>
                <Typography variant="body2">
                  See what others are saying about this product
                </Typography>
              </Box>
            </CardContent>
          </Card>
          </Grid>

        {/* Product Details */}
          <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating?.average || 0} precision={0.5} readOnly size="large" />
              <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                ({product.rating?.count || 0} reviews)
              </Typography>
            </Box>

            {/* Enhanced Seller Information */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2, overflow: 'hidden' }}>
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                py: 1, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <StoreIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Seller Information
                </Typography>
              </Box>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main',
                      width: 50,
                      height: 50,
                      fontSize: '1.5rem'
                    }}
                  >
                    {(product.seller?.shopName || product.seller?.name || 'U')[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {product.seller?.shopName || 'Shop Name Not Available'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seller: {product.seller?.name || 'Unknown Seller'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 1, py: 1 }}
              />
              <Chip
                label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                color={product.stock > 0 ? 'success' : 'error'}
                variant="outlined"
                sx={{ borderRadius: 1, py: 1 }}
              />
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3, 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              boxShadow: 1
            }}>
              {product.discount > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(product.price * (1 - product.discount/100))}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {formatPrice(product.price)}
                  </Typography>
                  <Chip 
                    label={`${product.discount}% OFF`}
                    color="error"
                    sx={{ height: 28, fontWeight: 'bold' }}
                  />
                </Box>
              ) : (
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(product.price)}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {product.briefDescription}
            </Typography>

            {product.colors && product.colors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Available Colors
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.colors.map((color, index) => (
                    <Chip
                      key={index}
                      label={color.name}
                      onClick={() => setSelectedColor(color)}
                      variant={selectedColor?.name === color.name ? "filled" : "outlined"}
                      sx={{
                        backgroundColor: color.code,
                        color: isLightColor(color.code) ? 'black' : 'white',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                        border: selectedColor?.name === color.name ? '2px solid' : 'none',
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        fontWeight: 'medium'
                      }}
                      disabled={color.stock === 0}
                    />
                  ))}
                </Box>
                {selectedColor && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedColor.stock > 0 
                      ? `${selectedColor.stock} units available in ${selectedColor.name}`
                      : `Out of stock in ${selectedColor.name}`}
            </Typography>
                )}
              </Box>
            )}

            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quantity
            </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                width: 'fit-content',
                p: 0.5
              }}>
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography 
                  sx={{ 
                    mx: 2,
                    minWidth: '40px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {quantity}
            </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
                startIcon={<CartIcon />}
              onClick={handleAddToCart}
                disabled={product.stock <= 0}
                sx={{ 
                  py: 1.5, 
                  flex: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  fontWeight: 'bold'
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<FlashOnIcon />}
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                sx={{ 
                  py: 1.5, 
                  flex: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  fontWeight: 'bold'
                }}
              >
                Buy Now
              </Button>
              <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                <Button
                  variant={isWishlisted ? "contained" : "outlined"}
                  color="secondary"
                  size="large"
                  onClick={handleWishlistToggle}
                  sx={{ 
                    minWidth: '56px',
                    borderRadius: 2,
                    boxShadow: isWishlisted ? 2 : 0
                  }}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Button>
              </Tooltip>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Enhanced Product Description with Tabs */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                aria-label="product information tabs"
                sx={{
                  mb: 2,
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }
                }}
              >
                <Tab label="Description" id="tab-0" />
                {product.specifications?.length > 0 && <Tab label="Specifications" id="tab-1" />}
                <Tab label="Reviews" id="tab-2" />
              </Tabs>

              {/* Description Tab */}
              <TabPanel value={activeTab} index={0}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    About This Product
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                  
                  {/* Key Features Section */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Key Features
                    </Typography>
                    <List>
                      {product.description.split('.').filter(sentence => sentence.trim().length > 10).slice(0, 4).map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'primary.main',
                                    mr: 2
                                  }} 
                                />
                                <Typography variant="body1">{feature.trim()}</Typography>
                              </Box>
                            } 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Paper>
              </TabPanel>

              {/* Specifications Tab */}
              {product.specifications?.length > 0 && (
                <TabPanel value={activeTab} index={1}>
                  <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: 'grey.100', p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Technical Specifications
                      </Typography>
                    </Box>
                    <List sx={{ bgcolor: 'background.paper' }}>
                      {product.specifications.map((spec, index) => (
                        <ListItem 
                          key={index} 
                          divider={index < product.specifications.length - 1}
                          sx={{ 
                            py: 2,
                            bgcolor: index % 2 === 0 ? 'background.paper' : 'grey.50'
                          }}
                        >
                          <Grid container>
                            <Grid item xs={5} md={4}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {spec.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={7} md={8}>
                              <Typography variant="body2">
                                {spec.value}
                              </Typography>
                            </Grid>
          </Grid>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </TabPanel>
              )}

              {/* Reviews Tab */}
              <TabPanel value={activeTab} index={2}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Customer Reviews
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {user && user.profileType === 'consumer' && (
                        <Button 
                          variant="outlined" 
                          onClick={() => setReviewDialog(true)}
                          sx={{ borderRadius: 2 }}
                        >
                          Write a Review
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {product.reviews?.length > 0 ? (
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                      {product.reviews.map((review, index) => (
                        <ListItem key={index} divider={index < product.reviews.length - 1}>
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>{review.userName?.[0]}</Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {review.userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                              {review.comment}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        No reviews yet. Be the first to review this product!
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </TabPanel>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialog} 
        onClose={() => setReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Rating
              value={reviewData.rating}
              onChange={(_, value) => setReviewData(prev => ({ ...prev, rating: value }))}
              size="large"
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            />

            {/* Photo Upload Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Add Photos (Optional - Max 3)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                multiple
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={reviewData.photos.length >= 3}
                >
                  Upload Photos
                </Button>
              </label>
              
              {/* Photo Preview */}
              {reviewData.photos.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {reviewData.photos.map((photo, index) => (
                    <Box
                      key={index}
                      sx={{ position: 'relative' }}
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Review photo ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { bgcolor: 'background.paper' }
                        }}
                        onClick={() => removePhoto(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Video Upload Section */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Add Video (Optional - Max 50MB)
              </Typography>
              <input
                accept="video/*"
                style={{ display: 'none' }}
                id="video-upload"
                type="file"
                onChange={handleVideoUpload}
              />
              <label htmlFor="video-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Videocam />}
                  disabled={reviewData.video !== null}
                >
                  Upload Video
                </Button>
              </label>

              {/* Video Preview */}
              {reviewData.video && (
                <Box sx={{ mt: 2, position: 'relative', width: 'fit-content' }}>
                  <video
                    width="200"
                    height="120"
                    controls
                    style={{ borderRadius: 4 }}
                  >
                    <source src={URL.createObjectURL(reviewData.video)} />
                    Your browser does not support the video tag.
                  </video>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                    onClick={removeVideo}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setReviewDialog(false);
            setReviewData({ rating: 5, comment: '', photos: [], video: null });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddReview} 
            variant="contained"
            disabled={!reviewData.comment.trim() || !reviewData.rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 