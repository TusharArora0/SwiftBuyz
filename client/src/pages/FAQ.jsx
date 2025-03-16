import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Chip
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  AssignmentReturn as ReturnIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const faqCategories = [
  { id: 'account', label: 'Account', icon: <AccountIcon /> },
  { id: 'orders', label: 'Orders', icon: <CartIcon /> },
  { id: 'payment', label: 'Payment', icon: <PaymentIcon /> },
  { id: 'shipping', label: 'Shipping', icon: <ShippingIcon /> },
  { id: 'returns', label: 'Returns & Refunds', icon: <ReturnIcon /> },
  { id: 'security', label: 'Security & Privacy', icon: <SecurityIcon /> },
];

const faqData = [
  {
    id: 1,
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Click on the "Sign Up" button in the top right corner of the page. Fill in your details including name, email address, and password. Verify your email address through the confirmation link we send you, and you\'re all set to start shopping!'
  },
  {
    id: 2,
    category: 'account',
    question: 'I forgot my password. How can I reset it?',
    answer: 'Click on the "Login" button and then select "Forgot Password". Enter the email address associated with your account, and we\'ll send you a link to reset your password. Follow the instructions in the email to create a new password.'
  },
  {
    id: 3,
    category: 'account',
    question: 'How can I update my account information?',
    answer: 'Log in to your account and navigate to "My Profile" or "Account Settings". Here you can update your personal information, change your password, manage your addresses, and update payment methods.'
  },
  {
    id: 4,
    category: 'orders',
    question: 'How do I place an order?',
    answer: 'Browse our products, add items to your cart, and proceed to checkout when you\'re ready. Review your order, select shipping and payment methods, and confirm your purchase. You\'ll receive an order confirmation email once your order is placed successfully.'
  },
  {
    id: 5,
    category: 'orders',
    question: 'How can I check the status of my order?',
    answer: 'Log in to your account and go to "My Orders" to view all your orders and their current status. You can also track your shipment using the tracking number provided in your shipping confirmation email.'
  },
  {
    id: 6,
    category: 'orders',
    question: 'Can I modify or cancel my order after it\'s placed?',
    answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t entered the processing stage. To do so, go to "My Orders", find the order you wish to modify or cancel, and follow the instructions. If the order has already been processed, please contact our customer service team for assistance.'
  },
  {
    id: 7,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard, American Express), net banking, UPI, digital wallets (PayTM, PhonePe, Google Pay), and Cash on Delivery (for eligible orders).'
  },
  {
    id: 8,
    category: 'payment',
    question: 'Is it safe to use my credit card on your website?',
    answer: 'Yes, we use industry-standard encryption and security protocols to ensure your payment information is secure. We are PCI DSS compliant and never store your full credit card details on our servers.'
  },
  {
    id: 9,
    category: 'payment',
    question: 'When will my credit card be charged?',
    answer: 'Your credit card will be authorized when you place the order but will only be charged when your order ships. For pre-orders or back-ordered items, your card will be charged when the item is ready to ship.'
  },
  {
    id: 10,
    category: 'shipping',
    question: 'How long will it take to receive my order?',
    answer: 'Delivery times depend on your location and the shipping method selected. Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days. You can find more detailed information on our Shipping Policy page.'
  },
  {
    id: 11,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International shipping times and costs vary by destination. You can see the shipping options available to your country during checkout.'
  },
  {
    id: 12,
    category: 'shipping',
    question: 'How can I track my shipment?',
    answer: 'Once your order ships, you\'ll receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website or directly on the carrier\'s website.'
  },
  {
    id: 13,
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items, such as personalized products or intimate apparel, may not be eligible for return. Please visit our Return Policy page for more details.'
  },
  {
    id: 14,
    category: 'returns',
    question: 'How do I initiate a return?',
    answer: 'Log in to your account, go to "My Orders", find the order containing the item you wish to return, and select "Return Item". Follow the instructions to complete the return process. You\'ll receive a return shipping label and instructions via email.'
  },
  {
    id: 15,
    category: 'returns',
    question: 'When will I receive my refund?',
    answer: 'Once we receive and inspect your return, we\'ll process your refund. This typically takes 3-5 business days. The refund will be issued to your original payment method. It may take an additional 5-10 business days for the refund to appear in your account, depending on your payment provider.'
  },
  {
    id: 16,
    category: 'security',
    question: 'How do you protect my personal information?',
    answer: 'We take data protection seriously and have implemented various security measures to protect your personal information. We use encryption for all data transmission, regularly update our security protocols, and strictly limit access to personal data. For more details, please review our Privacy Policy.'
  },
  {
    id: 17,
    category: 'security',
    question: 'What information do you collect about me?',
    answer: 'We collect information necessary to process your orders and improve your shopping experience, including your name, contact details, shipping address, payment information, and browsing behavior on our site. We never sell your personal information to third parties. Our Privacy Policy provides comprehensive details about our data practices.'
  },
  {
    id: 18,
    category: 'security',
    question: 'Can I opt out of marketing communications?',
    answer: 'Yes, you can opt out of marketing communications at any time. Simply click the "Unsubscribe" link at the bottom of any marketing email, or update your communication preferences in your account settings.'
  }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };
  
  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Frequently Asked Questions
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Find answers to common questions about our products, services, and policies.
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {/* Category Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filter by Category:
          </Typography>
          <Grid container spacing={1}>
            {faqCategories.map((category) => (
              <Grid item key={category.id}>
                <Chip
                  icon={category.icon}
                  label={category.label}
                  clickable
                  color={selectedCategory === category.id ? "primary" : "default"}
                  onClick={() => handleCategorySelect(category.id)}
                  sx={{ px: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* FAQ Accordions */}
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <Accordion key={faq.id} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${faq.id}-content`}
                id={`panel${faq.id}-header`}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter to find what you're looking for.
            </Typography>
          </Box>
        )}
        
        {/* Contact Section */}
        <Box sx={{ mt: 6, bgcolor: 'primary.light', p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Can't find what you're looking for?
          </Typography>
          <Typography variant="body1">
            Our customer service team is here to help. Contact us at <strong>support@swiftbuyz.com</strong> or call <strong>+91 123 456 7890</strong> during business hours (Monday to Friday, 9 AM to 6 PM IST).
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQ; 