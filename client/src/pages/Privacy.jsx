import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider
} from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Privacy Policy
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to SwiftBuyz! We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our 
            website or make a purchase.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            2. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect personal information that you voluntarily provide to us when you register on our website, 
            express interest in obtaining information about us or our products, or when you participate in activities 
            on the website.
          </Typography>
          <Typography variant="body1" paragraph>
            This information may include:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Name and contact details</Typography>
            </li>
            <li>
              <Typography variant="body1">Billing and shipping address</Typography>
            </li>
            <li>
              <Typography variant="body1">Payment information</Typography>
            </li>
            <li>
              <Typography variant="body1">Account credentials</Typography>
            </li>
            <li>
              <Typography variant="body1">Purchase history</Typography>
            </li>
          </ul>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use your information for various purposes, including:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Processing and fulfilling your orders</Typography>
            </li>
            <li>
              <Typography variant="body1">Creating and managing your account</Typography>
            </li>
            <li>
              <Typography variant="body1">Sending transactional emails and order updates</Typography>
            </li>
            <li>
              <Typography variant="body1">Providing customer support</Typography>
            </li>
            <li>
              <Typography variant="body1">Improving our website and services</Typography>
            </li>
          </ul>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            4. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to collect information about your browsing activities. 
            These technologies help us analyze website traffic, personalize content, and improve your experience.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            5. Third-Party Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We may share your information with trusted third parties, such as payment processors, shipping 
            companies, and service providers who assist us in operating our website and conducting our business.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            6. Security Measures
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information. However, no method of 
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            7. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">Access to your personal data</Typography>
            </li>
            <li>
              <Typography variant="body1">Correction of inaccurate data</Typography>
            </li>
            <li>
              <Typography variant="body1">Deletion of your data</Typography>
            </li>
            <li>
              <Typography variant="body1">Objection to processing</Typography>
            </li>
            <li>
              <Typography variant="body1">Data portability</Typography>
            </li>
          </ul>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            8. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and 
            if significant changes are made, we will provide a more prominent notice.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions or concerns about our Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            support@swiftbuyz.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy; 