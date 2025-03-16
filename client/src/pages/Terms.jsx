import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Gavel as TermsIcon } from '@mui/icons-material';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TermsIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Terms and Conditions
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', mb: 4 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to SwiftBuyz. These Terms and Conditions govern your use of our website and services. 
          By accessing or using our platform, you agree to be bound by these Terms. Please read them carefully.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          1. Definitions
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>"SwiftBuyz"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong> refers to SwiftBuyz E-commerce Pvt. Ltd., the company that operates this website.
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>"User"</strong>, <strong>"you"</strong>, or <strong>"your"</strong> refers to any individual or entity that accesses or uses our website.
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>"Website"</strong> refers to the SwiftBuyz e-commerce platform, accessible at www.swiftbuyz.com.
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>"Products"</strong> refers to the items available for purchase on our website.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          2. Account Registration
        </Typography>
        
        <Typography variant="body1" paragraph>
          2.1. To access certain features of our website, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process.
        </Typography>
        
        <Typography variant="body1" paragraph>
          2.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </Typography>
        
        <Typography variant="body1" paragraph>
          2.3. You must notify us immediately of any unauthorized use of your account or any other breach of security.
        </Typography>
        
        <Typography variant="body1" paragraph>
          2.4. We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be inaccurate, false, or outdated.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          3. Products and Pricing
        </Typography>
        
        <Typography variant="body1" paragraph>
          3.1. We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions or other content on the website are accurate, complete, reliable, current, or error-free.
        </Typography>
        
        <Typography variant="body1" paragraph>
          3.2. Prices for products are subject to change without notice. We reserve the right to modify or discontinue any product without notice.
        </Typography>
        
        <Typography variant="body1" paragraph>
          3.3. All prices are in Indian Rupees (INR) unless otherwise specified.
        </Typography>
        
        <Typography variant="body1" paragraph>
          3.4. We reserve the right to refuse or cancel orders, including after an order has been submitted, whether or not the order has been confirmed and your payment method charged.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          4. Orders and Payment
        </Typography>
        
        <Typography variant="body1" paragraph>
          4.1. When you place an order, you offer to purchase the product at the price stated. We will confirm acceptance of your order by sending you an order confirmation email.
        </Typography>
        
        <Typography variant="body1" paragraph>
          4.2. We accept various payment methods as indicated on our website. By providing payment information, you represent and warrant that you have the legal right to use the payment method provided.
        </Typography>
        
        <Typography variant="body1" paragraph>
          4.3. Payment must be received in full before your order is processed. Orders are subject to verification and acceptance by us.
        </Typography>
        
        <Typography variant="body1" paragraph>
          4.4. For certain orders, we may conduct verification checks to ensure the legitimacy of the order and prevent fraud.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          5. Shipping and Delivery
        </Typography>
        
        <Typography variant="body1" paragraph>
          5.1. We will make reasonable efforts to deliver products within the estimated delivery time indicated on our website or in the order confirmation.
        </Typography>
        
        <Typography variant="body1" paragraph>
          5.2. Delivery times are estimates only and are not guaranteed. We are not liable for any delays in delivery.
        </Typography>
        
        <Typography variant="body1" paragraph>
          5.3. Risk of loss and title for products pass to you upon delivery of the products to the shipping carrier.
        </Typography>
        
        <Typography variant="body1" paragraph>
          5.4. For more details on shipping and delivery, please refer to our Shipping Policy.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          6. Returns and Refunds
        </Typography>
        
        <Typography variant="body1" paragraph>
          6.1. Returns and refunds are subject to our Return Policy, which is incorporated by reference into these Terms and Conditions.
        </Typography>
        
        <Typography variant="body1" paragraph>
          6.2. Some products may not be eligible for return or refund, as specified in our Return Policy.
        </Typography>
        
        <Typography variant="body1" paragraph>
          6.3. To be eligible for a return, products must be in their original condition, unused, and with all original packaging and tags.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          7. User Conduct
        </Typography>
        
        <Typography variant="body1" paragraph>
          7.1. You agree not to use our website for any illegal or unauthorized purpose.
        </Typography>
        
        <Typography variant="body1" paragraph>
          7.2. You agree not to attempt to interfere with the proper functioning of the website or any transactions being conducted on the website.
        </Typography>
        
        <Typography variant="body1" paragraph>
          7.3. You agree not to use any data mining, robots, scraping, or similar data gathering methods on our website.
        </Typography>
        
        <Typography variant="body1" paragraph>
          7.4. We reserve the right to refuse service, terminate accounts, and/or cancel orders at our discretion, including if we believe that user conduct violates applicable law or is harmful to our interests.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          8. Intellectual Property
        </Typography>
        
        <Typography variant="body1" paragraph>
          8.1. All content on our website, including text, graphics, logos, images, and software, is the property of SwiftBuyz or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
        </Typography>
        
        <Typography variant="body1" paragraph>
          8.2. You may not reproduce, distribute, modify, display, or use any content from our website without our prior written permission.
        </Typography>
        
        <Typography variant="body1" paragraph>
          8.3. Any feedback, comments, or suggestions you provide regarding our website or services is entirely voluntary, and we will be free to use such feedback, comments, or suggestions without any obligation to you.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          9. Privacy
        </Typography>
        
        <Typography variant="body1" paragraph>
          9.1. Your use of our website is also governed by our Privacy Policy, which is incorporated by reference into these Terms and Conditions.
        </Typography>
        
        <Typography variant="body1" paragraph>
          9.2. By using our website, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          10. Limitation of Liability
        </Typography>
        
        <Typography variant="body1" paragraph>
          10.1. To the maximum extent permitted by law, SwiftBuyz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText primary="(a) Your access to or use of or inability to access or use the website;" />
          </ListItem>
          <ListItem>
            <ListItemText primary="(b) Any conduct or content of any third party on the website;" />
          </ListItem>
          <ListItem>
            <ListItemText primary="(c) Any content obtained from the website; or" />
          </ListItem>
          <ListItem>
            <ListItemText primary="(d) Unauthorized access, use, or alteration of your transmissions or content." />
          </ListItem>
        </List>
        
        <Typography variant="body1" paragraph>
          10.2. In no event shall our total liability to you for all claims exceed the amount paid by you to us for products purchased through our website in the past six months.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          11. Indemnification
        </Typography>
        
        <Typography variant="body1" paragraph>
          11.1. You agree to indemnify, defend, and hold harmless SwiftBuyz, its officers, directors, employees, agents, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms and Conditions or your use of the website.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          12. Governing Law and Jurisdiction
        </Typography>
        
        <Typography variant="body1" paragraph>
          12.1. These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </Typography>
        
        <Typography variant="body1" paragraph>
          12.2. Any dispute arising out of or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          13. Changes to Terms and Conditions
        </Typography>
        
        <Typography variant="body1" paragraph>
          13.1. We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website.
        </Typography>
        
        <Typography variant="body1" paragraph>
          13.2. Your continued use of the website after any changes to the Terms and Conditions constitutes your acceptance of the new Terms and Conditions.
        </Typography>
        
        <Typography variant="body1" paragraph>
          13.3. It is your responsibility to review these Terms and Conditions periodically for changes.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          14. Severability
        </Typography>
        
        <Typography variant="body1" paragraph>
          14.1. If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          15. Entire Agreement
        </Typography>
        
        <Typography variant="body1" paragraph>
          15.1. These Terms and Conditions, together with our Privacy Policy and Return Policy, constitute the entire agreement between you and SwiftBuyz regarding your use of the website.
        </Typography>

        <Box sx={{ mt: 4, bgcolor: 'primary.light', p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about these Terms and Conditions, please contact us at <strong>legal@swiftbuyz.com</strong> or write to us at:
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            SwiftBuyz E-commerce Pvt. Ltd.<br />
            123 Shopping Street<br />
            Delhi, Delhi 110001<br />
            India
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms; 