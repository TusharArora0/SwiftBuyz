import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useState } from 'react';
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'Message sent successfully!' });
    // Add your contact form submission logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Contact Us
      </Typography>
      
      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Get In Touch
              </Typography>
              
              <Typography variant="body1" paragraph>
                We'd love to hear from you! Please feel free to contact us using any of the methods below.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <LocationIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Our Location
                    </Typography>
                    <Typography variant="body2">
                      SwiftBuyz E-commerce Pvt. Ltd.<br />
                      123 Shopping Street<br />
                      Delhi, Delhi 110001<br />
                      India
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <PhoneIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      +91 123 456 7890
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <EmailIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Email
                    </Typography>
                    <Typography variant="body2">
                      support@swiftbuyz.com
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Business Hours
              </Typography>
              <Typography variant="body2">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Send Us a Message
            </Typography>
            
            {status && (
              <Alert severity={status.type} sx={{ mb: 3 }}>
                {status.message}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact; 