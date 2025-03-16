import ChatMessage from '../models/ChatMessage.js';

const PREDEFINED_RESPONSES = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'hola'],
    responses: [
      'Hello! How can I help you today?',
      'Hi there! What can I assist you with?',
      'Welcome! How may I help you?',
      'Greetings! How can I make your shopping experience better today?'
    ]
  },
  orders: {
    patterns: ['order', 'track', 'shipping', 'delivery', 'package', 'shipment', 'tracking', 'shipped'],
    responses: [
      'You can track your order in your profile under the Orders section.',
      'To check your order status, please visit your Orders dashboard.',
      'For detailed order information, please check your Orders page.',
      'All your order details including tracking information can be found in your profile\'s Order History.'
    ]
  },
  products: {
    patterns: ['product', 'price', 'availability', 'stock', 'item', 'inventory', 'in stock', 'available'],
    responses: [
      'You can find all our products in the Products section. Use filters to narrow down your search.',
      'Browse our Categories section to find specific products.',
      'Our product listings show real-time availability and pricing.',
      'Check out our Deals section for special offers and discounts on products.'
    ]
  },
  returns: {
    patterns: ['return', 'refund', 'cancel', 'money back', 'exchange', 'warranty', 'damaged'],
    responses: [
      'Our return policy allows returns within 7 days of delivery.',
      'To initiate a return, go to your Orders section and select the item you wish to return.',
      'For refunds, please visit your order details page.',
      'If you received a damaged item, please contact us with photos for an immediate replacement.'
    ]
  },
  payment: {
    patterns: ['payment', 'pay', 'card', 'credit', 'debit', 'transaction', 'billing', 'invoice', 'receipt'],
    responses: [
      'We accept all major credit/debit cards and UPI payments.',
      'Payment can be made using cards, UPI, or cash on delivery.',
      'Your payment information is securely processed.',
      'For payment-related issues, please check your bank statement and contact us with the transaction ID.'
    ]
  },
  account: {
    patterns: ['account', 'profile', 'login', 'sign in', 'register', 'password', 'forgot', 'reset'],
    responses: [
      'You can manage your account details in the Profile section.',
      'To reset your password, click on "Forgot Password" on the login page.',
      'Your personal information can be updated in your Profile Settings.',
      'For security reasons, we recommend changing your password regularly.'
    ]
  },
  deals: {
    patterns: ['deal', 'discount', 'offer', 'sale', 'coupon', 'promo', 'promotion', 'bargain'],
    responses: [
      'Check our Deals section for the latest discounts and offers.',
      'Special promotions are regularly updated on our home page.',
      'Sign up for our newsletter to receive exclusive discount codes.',
      'Seasonal sales are announced on our social media channels and website.'
    ]
  },
  contact: {
    patterns: ['contact', 'support', 'help', 'service', 'customer service', 'phone', 'email', 'call'],
    responses: [
      'Our customer service team is available 24/7. You can reach us at support@swiftbuyz.com.',
      'For immediate assistance, call our helpline at 1-800-SWIFT-BUY.',
      'You can also reach us through the Contact form on our website.',
      'Our support team typically responds to emails within 24 hours.'
    ]
  },
  shipping: {
    patterns: ['shipping cost', 'delivery fee', 'shipping fee', 'free shipping', 'international shipping'],
    responses: [
      'We offer free shipping on orders over $50.',
      'Shipping costs are calculated based on your location and displayed at checkout.',
      'International shipping is available to select countries.',
      'Express shipping options are available for an additional fee.'
    ]
  },
  thanks: {
    patterns: ['thanks', 'thank you', 'appreciate', 'grateful', 'awesome', 'great'],
    responses: [
      'You\'re welcome! Is there anything else I can help you with?',
      'Happy to help! Let me know if you need anything else.',
      'My pleasure! Feel free to ask if you have more questions.',
      'Glad I could assist. Have a great day!'
    ]
  },
  // Specific responses for quick option buttons
  trackOrder: {
    patterns: ['track my order', 'where is my order', 'order status'],
    responses: [
      'To track your order, please go to your Profile > Orders section. There you can see the status of all your orders. If you\'re logged in, I can help you check your most recent order status.'
    ]
  },
  shippingInfo: {
    patterns: ['shipping information', 'shipping info', 'delivery information'],
    responses: [
      'We offer the following shipping options:\n\n• Standard Shipping (3-5 business days): Free for orders over $50, otherwise $4.99\n• Express Shipping (1-2 business days): $9.99\n• Same-day Delivery (select cities only): $14.99\n\nInternational shipping is available to over 60 countries.'
    ]
  },
  paymentMethods: {
    patterns: ['payment methods', 'how to pay', 'payment options'],
    responses: [
      'We accept the following payment methods:\n\n• Credit/Debit Cards (Visa, Mastercard, American Express)\n• PayPal\n• Apple Pay\n• Google Pay\n• Cash on Delivery (select areas only)\n\nAll transactions are secured with industry-standard encryption.'
    ]
  },
  returnPolicy: {
    patterns: ['return policy', 'how to return', 'can i return'],
    responses: [
      'Our Return Policy:\n\n• You can return items within 7 days of delivery\n• Items must be unused and in original packaging\n• Free returns for defective items\n• Return shipping fee of $5.99 for non-defective returns\n\nTo initiate a return, go to your Orders section and select "Return Item".'
    ]
  }
};

export const getResponse = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for exact matches first
  for (const [category, data] of Object.entries(PREDEFINED_RESPONSES)) {
    for (const pattern of data.patterns) {
      if (lowercaseMessage === pattern) {
        const randomIndex = Math.floor(Math.random() * data.responses.length);
        return data.responses[randomIndex];
      }
    }
  }
  
  // Check for quick option exact matches
  if (lowercaseMessage === "track my order") {
    return PREDEFINED_RESPONSES.trackOrder.responses[0];
  } else if (lowercaseMessage === "shipping information") {
    return PREDEFINED_RESPONSES.shippingInfo.responses[0];
  } else if (lowercaseMessage === "payment methods") {
    return PREDEFINED_RESPONSES.paymentMethods.responses[0];
  } else if (lowercaseMessage === "return policy") {
    return PREDEFINED_RESPONSES.returnPolicy.responses[0];
  }
  
  // Then check for partial matches
  for (const [category, data] of Object.entries(PREDEFINED_RESPONSES)) {
    if (data.patterns.some(pattern => lowercaseMessage.includes(pattern))) {
      const randomIndex = Math.floor(Math.random() * data.responses.length);
      return data.responses[randomIndex];
    }
  }
  
  // Default responses for no matches
  const defaultResponses = [
    "I'm not sure how to help with that. Would you like to speak with our customer service team?",
    "I don't have information about that yet. Can I help you with something else?",
    "That's beyond my current capabilities. Would you like me to connect you with customer support?",
    "I'm still learning about that. Is there something else I can assist you with?"
  ];
  
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
};

export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid message format' });
    }
    
    const response = getResponse(message);
    
    // Save the chat message to database
    const chatMessage = new ChatMessage({
      user: req.userId,
      message,
      response
    });
    
    await chatMessage.save();
    
    // Add a small delay to simulate thinking
    setTimeout(() => {
      res.json({ response });
    }, 500);
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
}; 