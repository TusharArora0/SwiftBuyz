import { Container, Typography, Paper, Box, Grid, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Assignment as AssignmentIcon, CheckCircle, Cancel, LocalShipping, Payment, Info } from '@mui/icons-material';

const ReturnPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4">Return & Refund Policy</Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          At our e-commerce platform, we strive to ensure your complete satisfaction with every purchase. 
          All prices displayed throughout our website are in <strong>Indian Rupees (INR)</strong>. 
          Please read our return and refund policy carefully.
        </Typography>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom color="primary">
          Return Eligibility
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText 
              primary="7-Day Return Window" 
              secondary="Items can be returned within 7 days from the date of delivery"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText 
              primary="Unused Condition" 
              secondary="Products must be unused, unworn, unwashed, and in the original packaging"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText 
              primary="Original Tags & Accessories" 
              secondary="All tags, labels, accessories, and documentation must be intact"
            />
          </ListItem>
        </List>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Non-Returnable Items
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon><Cancel color="error" /></ListItemIcon>
            <ListItemText 
              primary="Perishable Goods" 
              secondary="Food items, flowers, and other perishable goods"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Cancel color="error" /></ListItemIcon>
            <ListItemText 
              primary="Personalized Products" 
              secondary="Custom or personalized items made to your specifications"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Cancel color="error" /></ListItemIcon>
            <ListItemText 
              primary="Digital Products" 
              secondary="Downloaded software, e-books, or digital content"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Cancel color="error" /></ListItemIcon>
            <ListItemText 
              primary="Intimate Items" 
              secondary="Undergarments, swimwear, and personal care products"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom color="primary">
          Refund Process
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Payment color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Refund Timeline</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  • Refund initiation: Within 24 hours of return approval<br />
                  • Processing time: 5-7 business days<br />
                  • Bank processing: Additional 2-5 business days depending on your bank
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShipping color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Shipping Charges</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  • Original shipping charges are non-refundable<br />
                  • Return shipping is free for defective or incorrect items<br />
                  • Customer bears return shipping cost for change of mind
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          Refund Methods
        </Typography>
        
        <Typography variant="body2" paragraph>
          Refunds will be processed to the original payment method used for the purchase:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Credit/Debit Cards" 
              secondary="Refunded to the original card used for purchase"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="UPI/Net Banking" 
              secondary="Refunded to the original bank account"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Cash on Delivery" 
              secondary="Refunded via bank transfer (bank details will be requested)"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom color="primary">
          How to Initiate a Return
        </Typography>
        
        <List sx={{ mb: 3 }}>
          <ListItem>
            <ListItemIcon><Info color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Contact Customer Support" 
              secondary="Email us at support@example.com with your order number and return reason"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Info color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Return Authorization" 
              secondary="Wait for our team to review and approve your return request"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Info color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Package the Item" 
              secondary="Securely pack the item in its original packaging with all tags and accessories"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Info color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Ship the Item" 
              secondary="Use the provided return label or ship to the address provided by customer support"
            />
          </ListItem>
        </List>
        
        <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Contact Information
          </Typography>
          <Typography variant="body2">
            For any questions regarding our return and refund policy, please contact our customer support:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Email: support@example.com<br />
            Phone: +91 1234567890<br />
            Hours: Monday to Saturday, 9:00 AM to 6:00 PM IST
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReturnPolicy; 