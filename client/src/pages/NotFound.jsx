import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          borderRadius: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <SadIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
        
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 5 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 450 }}>
          <Grid item xs={12} sm={6}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              fullWidth
              startIcon={<HomeIcon />}
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              Back to Home
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              fullWidth
              startIcon={<SearchIcon />}
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              Browse Products
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5, pt: 3, borderTop: 1, borderColor: 'divider', width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please contact our support team.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound; 