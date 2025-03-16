import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import { LocalShipping as ShippingIcon } from '@mui/icons-material';

const ShippingPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShippingIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Shipping Policy
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          At SwiftBuyz, we strive to provide fast, reliable, and affordable shipping options for all our customers. 
          This policy outlines our shipping procedures, delivery timeframes, and associated costs.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Shipping Methods & Delivery Times
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Domestic Shipping (Within India)
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Standard Shipping (3-5 business days)" 
                secondary="Free for orders above ₹499, ₹49 for orders below ₹499"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Express Shipping (1-2 business days)" 
                secondary="₹99 flat rate for all orders"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Same-Day Delivery" 
                secondary="₹199 (Available only in select metro cities for orders placed before 12 PM)"
              />
            </ListItem>
          </List>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Note: Delivery times are estimates and may vary based on your location and product availability.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            International Shipping
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Standard International (7-14 business days)" 
                secondary="Starting from ₹999, varies by country and weight"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Express International (3-5 business days)" 
                secondary="Starting from ₹1999, varies by country and weight"
              />
            </ListItem>
          </List>
          
          <Typography variant="body2" color="text.secondary">
            International shipping costs are calculated at checkout based on destination, weight, and dimensions.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Order Processing
        </Typography>
        
        <Typography variant="body1" paragraph>
          All orders are processed within 24 hours of being placed (excluding weekends and holidays). 
          Once your order is processed, you will receive a confirmation email with tracking information.
        </Typography>
        
        <Typography variant="body1" paragraph>
          For pre-order or back-ordered items, estimated shipping dates will be provided at checkout.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Shipping Restrictions
        </Typography>
        
        <Typography variant="body1" paragraph>
          Some products may have shipping restrictions due to size, weight, or content. These restrictions 
          will be clearly indicated on the product page.
        </Typography>
        
        <Typography variant="body1" paragraph>
          We currently do not ship to P.O. boxes or APO/FPO addresses.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Tracking Your Order
        </Typography>
        
        <Typography variant="body1" paragraph>
          Once your order ships, you will receive a tracking number via email. You can also track your order 
          by logging into your account on our website and viewing your order history.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Shipping Delays
        </Typography>
        
        <Typography variant="body1" paragraph>
          While we strive to deliver all orders on time, delays may occur due to weather conditions, 
          customs clearance (for international orders), or other unforeseen circumstances. We will notify 
          you of any significant delays affecting your order.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Lost or Damaged Packages
        </Typography>
        
        <Typography variant="body1" paragraph>
          If your package is lost or damaged during transit, please contact our customer service team 
          within 48 hours of the expected delivery date. We will work with the shipping carrier to 
          resolve the issue and ensure you receive your order or are appropriately compensated.
        </Typography>

        <Box sx={{ mt: 4, bgcolor: 'primary.light', p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Have Questions About Shipping?
          </Typography>
          <Typography variant="body1">
            Our customer service team is available to assist you with any shipping-related inquiries. 
            Contact us at <strong>support@swiftbuyz.com</strong> or call <strong>+91 123 456 7890</strong> 
            during business hours (Monday to Friday, 9 AM to 6 PM IST).
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShippingPolicy; 