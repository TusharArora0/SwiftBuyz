import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Seller IDs from the database
const SELLER_IDS = {
  myShop: '67cbf0e5bf267b529bfd648d', // "my shop" seller
  shashwatDesigners: '67d5329ced70a100e787be06' // "Shashwat Designers" seller
};

// Categories available in the website
const CATEGORIES = [
  'electronics',
  'fashion',
  'home',
  'books',
  'sports',
  'beauty'
];

// Sample products for each category
const products = [
  // Electronics Category
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium wireless headphones. These headphones feature active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music enthusiasts and professionals alike. The built-in microphone ensures clear calls, while the quick charge feature gives you 5 hours of playback with just 10 minutes of charging. Compatible with all Bluetooth devices and includes a carrying case.',
    briefDescription: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
    price: 249.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' },
      { name: 'Noise Cancellation', value: 'Active' },
      { name: 'Weight', value: '250g' },
      { name: 'Warranty', value: '2 years' }
    ],
    stock: 50,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Black', code: '#000000', stock: 20 },
      { name: 'Silver', code: '#C0C0C0', stock: 15 },
      { name: 'Navy Blue', code: '#000080', stock: 15 }
    ],
    discount: 10
  },
  {
    name: 'Ultra HD Smart TV 55"',
    description: 'Transform your home entertainment with our Ultra HD Smart TV. This 55-inch television delivers stunning 4K resolution with HDR support for vibrant colors and deep blacks. The smart platform gives you access to all your favorite streaming services, while the voice control feature makes navigation effortless. With a sleek, borderless design, it will be the centerpiece of your living room. Multiple HDMI and USB ports allow for easy connection to gaming consoles, sound systems, and other devices.',
    briefDescription: '55" 4K Ultra HD Smart TV with HDR and voice control',
    price: 699.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Screen Size', value: '55 inches' },
      { name: 'Resolution', value: '4K Ultra HD (3840 x 2160)' },
      { name: 'HDR', value: 'Yes' },
      { name: 'Smart TV', value: 'Yes' },
      { name: 'Refresh Rate', value: '120Hz' },
      { name: 'HDMI Ports', value: '4' }
    ],
    stock: 25,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Black', code: '#000000', stock: 25 }
    ],
    discount: 15
  },
  {
    name: 'Professional DSLR Camera',
    description: 'Capture life\'s moments with exceptional clarity using our Professional DSLR Camera. This high-performance camera features a 24.2MP sensor, 4K video recording capabilities, and an advanced autofocus system with 45 cross-type points. The weather-sealed body ensures durability in various conditions, while the intuitive controls make it suitable for both beginners and professionals. The kit includes an 18-55mm lens, battery, charger, and a camera bag. With built-in Wi-Fi and Bluetooth, sharing your photos has never been easier.',
    briefDescription: 'Professional 24.2MP DSLR camera with 4K video recording',
    price: 1299.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Sensor', value: '24.2MP APS-C CMOS' },
      { name: 'Video Recording', value: '4K at 30fps' },
      { name: 'Autofocus Points', value: '45 cross-type' },
      { name: 'Weather Sealed', value: 'Yes' },
      { name: 'Battery Life', value: 'Approx. 1200 shots' },
      { name: 'Weight', value: '765g (body only)' }
    ],
    stock: 15,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Black', code: '#000000', stock: 15 }
    ],
    discount: 5
  },
  
  // Fashion Category
  {
    name: 'Designer Leather Jacket',
    description: 'Elevate your style with our premium Designer Leather Jacket. Crafted from genuine leather, this jacket features a classic design with modern details. The soft inner lining provides comfort and warmth, while the multiple pockets offer practicality. The metal zippers and adjustable cuffs add a touch of sophistication. Perfect for casual outings or evening events, this versatile jacket will become a staple in your wardrobe. Available in multiple sizes and colors to suit your personal style.',
    briefDescription: 'Premium genuine leather jacket with classic design and modern details',
    price: 299.99,
    category: 'fashion',
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Material', value: 'Genuine Leather' },
      { name: 'Lining', value: 'Polyester' },
      { name: 'Closure', value: 'Zipper' },
      { name: 'Pockets', value: '4 external, 2 internal' },
      { name: 'Care', value: 'Professional leather cleaning' }
    ],
    stock: 30,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Black', code: '#000000', stock: 10 },
      { name: 'Brown', code: '#8B4513', stock: 10 },
      { name: 'Burgundy', code: '#800020', stock: 10 }
    ],
    discount: 0
  },
  {
    name: 'Luxury Watch Collection',
    description: 'Make a statement with our Luxury Watch Collection. Each timepiece is meticulously crafted with precision and attention to detail. The sapphire crystal face resists scratches, while the automatic movement ensures accurate timekeeping without the need for batteries. The stainless steel case and band provide durability and a classic look that transitions seamlessly from day to night. Water-resistant up to 100 meters, these watches are suitable for swimming and snorkeling. Each watch comes in a premium gift box with a certificate of authenticity.',
    briefDescription: 'Meticulously crafted luxury watches with automatic movement',
    price: 599.99,
    category: 'fashion',
    images: [
      { url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Movement', value: 'Automatic' },
      { name: 'Case Material', value: 'Stainless Steel' },
      { name: 'Crystal', value: 'Sapphire' },
      { name: 'Water Resistance', value: '100 meters' },
      { name: 'Warranty', value: '5 years' }
    ],
    stock: 20,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Silver', code: '#C0C0C0', stock: 10 },
      { name: 'Gold', code: '#FFD700', stock: 5 },
      { name: 'Rose Gold', code: '#B76E79', stock: 5 }
    ],
    discount: 10
  },
  
  // Home & Living Category
  {
    name: 'Modern Sectional Sofa',
    description: 'Transform your living space with our Modern Sectional Sofa. This stylish and comfortable sofa features high-density foam cushions for ultimate comfort and durability. The L-shaped design maximizes seating space, making it perfect for family gatherings or entertaining guests. The solid wood frame ensures stability, while the premium upholstery adds a touch of elegance. The modular design allows for flexible arrangements to suit your space. Easy to clean and maintain, this sofa combines functionality with contemporary aesthetics.',
    briefDescription: 'Stylish L-shaped sectional sofa with high-density foam cushions',
    price: 1299.99,
    category: 'home',
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Dimensions', value: '112" x 84" x 34"' },
      { name: 'Frame Material', value: 'Solid Wood' },
      { name: 'Upholstery', value: 'Premium Fabric' },
      { name: 'Cushion Fill', value: 'High-Density Foam' },
      { name: 'Assembly', value: 'Required (tools included)' },
      { name: 'Weight Capacity', value: '800 lbs' }
    ],
    stock: 10,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Gray', code: '#808080', stock: 4 },
      { name: 'Beige', code: '#F5F5DC', stock: 3 },
      { name: 'Navy Blue', code: '#000080', stock: 3 }
    ],
    discount: 15
  },
  {
    name: 'Smart Home Lighting System',
    description: 'Create the perfect ambiance with our Smart Home Lighting System. This comprehensive set includes smart bulbs, light strips, and a central hub for seamless control. Adjust brightness, color, and temperature using the mobile app or voice commands through compatible smart assistants. Set schedules, create scenes, and even sync lights with music or movies for an immersive experience. The energy-efficient LED technology reduces electricity consumption while providing vibrant illumination. Installation is simple with no additional wiring required.',
    briefDescription: 'Complete smart lighting system with app and voice control',
    price: 199.99,
    category: 'home',
    images: [
      { url: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Components', value: '4 Smart Bulbs, 2 Light Strips, 1 Hub' },
      { name: 'Connectivity', value: 'Wi-Fi, Bluetooth' },
      { name: 'Compatibility', value: 'Alexa, Google Assistant, Apple HomeKit' },
      { name: 'Bulb Lifespan', value: '25,000 hours' },
      { name: 'Power Consumption', value: '9W per bulb' }
    ],
    stock: 35,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'White', code: '#FFFFFF', stock: 35 }
    ],
    discount: 5
  },
  
  // Books Category
  {
    name: 'Bestselling Fiction Collection',
    description: 'Immerse yourself in captivating stories with our Bestselling Fiction Collection. This curated set includes five award-winning novels from renowned authors, spanning various genres from mystery and thriller to romance and historical fiction. Each hardcover book is beautifully bound with premium paper and clear typography for an enhanced reading experience. Perfect for book enthusiasts or as a thoughtful gift, this collection will transport readers to different worlds and perspectives. The set comes in an elegant box for storage and display.',
    briefDescription: 'Collection of five award-winning novels from renowned authors',
    price: 89.99,
    category: 'books',
    images: [
      { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Format', value: 'Hardcover' },
      { name: 'Number of Books', value: '5' },
      { name: 'Genres', value: 'Mystery, Thriller, Romance, Historical Fiction' },
      { name: 'Language', value: 'English' },
      { name: 'Packaging', value: 'Collector\'s Box Set' }
    ],
    stock: 50,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Mixed', code: '#FFFFFF', stock: 50 }
    ],
    discount: 20
  },
  {
    name: 'Professional Cookbook Series',
    description: 'Elevate your culinary skills with our Professional Cookbook Series. This comprehensive collection features three volumes covering essential techniques, international cuisines, and gourmet desserts. Each recipe is detailed with step-by-step instructions, professional tips, and stunning photography. The books are designed with lay-flat binding for convenient use in the kitchen, and the stain-resistant pages can be easily wiped clean. Whether you\'re a beginner or an experienced cook, these cookbooks will inspire creativity and confidence in your cooking journey.',
    briefDescription: 'Three-volume cookbook series with professional techniques and recipes',
    price: 79.99,
    category: 'books',
    images: [
      { url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1467951591042-f388365db261?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Format', value: 'Hardcover' },
      { name: 'Number of Books', value: '3' },
      { name: 'Pages per Book', value: 'Approximately 250' },
      { name: 'Features', value: 'Lay-flat binding, stain-resistant pages' },
      { name: 'Language', value: 'English' }
    ],
    stock: 40,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Mixed', code: '#FFFFFF', stock: 40 }
    ],
    discount: 10
  },
  
  // Sports Category
  {
    name: 'Professional Yoga Set',
    description: 'Enhance your yoga practice with our Professional Yoga Set. This complete package includes a premium non-slip mat, two yoga blocks, a strap, and a microfiber towel. The eco-friendly mat provides excellent cushioning and grip for stability in all poses. The high-density foam blocks offer support for proper alignment, while the durable cotton strap helps with flexibility and extended stretches. The quick-drying microfiber towel absorbs moisture during hot yoga sessions. All items come in a matching carrying bag for easy transport and storage.',
    briefDescription: 'Complete yoga set with mat, blocks, strap, and towel',
    price: 79.99,
    category: 'sports',
    images: [
      { url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Mat Dimensions', value: '72" x 24" x 6mm' },
      { name: 'Block Size', value: '9" x 6" x 4"' },
      { name: 'Strap Length', value: '8 feet' },
      { name: 'Towel Material', value: 'Microfiber' },
      { name: 'Mat Material', value: 'Eco-friendly TPE' }
    ],
    stock: 45,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Purple', code: '#800080', stock: 15 },
      { name: 'Blue', code: '#0000FF', stock: 15 },
      { name: 'Black', code: '#000000', stock: 15 }
    ],
    discount: 0
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your fitness journey with our Smart Fitness Watch. This advanced wearable device monitors heart rate, steps, calories burned, and sleep quality with precision sensors. The built-in GPS tracks your routes during outdoor activities, while the waterproof design allows for swimming and showering without removal. The vibrant touchscreen display is easily readable in all lighting conditions, and the intuitive interface makes navigation simple. With a battery life of up to 7 days, you can focus on your fitness goals without frequent charging. The companion app provides detailed insights and personalized recommendations.',
    briefDescription: 'Advanced fitness tracker with GPS and heart rate monitoring',
    price: 149.99,
    category: 'sports',
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Display', value: '1.3" AMOLED Touchscreen' },
      { name: 'Battery Life', value: 'Up to 7 days' },
      { name: 'Water Resistance', value: '50 meters' },
      { name: 'Sensors', value: 'Heart Rate, Accelerometer, GPS' },
      { name: 'Compatibility', value: 'iOS 10.0+, Android 5.0+' }
    ],
    stock: 60,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Black', code: '#000000', stock: 20 },
      { name: 'Silver', code: '#C0C0C0', stock: 20 },
      { name: 'Rose Gold', code: '#B76E79', stock: 20 }
    ],
    discount: 15
  },
  
  // Beauty Category
  {
    name: 'Luxury Skincare Collection',
    description: 'Indulge in the ultimate skincare experience with our Luxury Skincare Collection. This comprehensive set includes a gentle cleanser, exfoliating toner, hydrating serum, nourishing moisturizer, and rejuvenating eye cream. Formulated with premium ingredients like hyaluronic acid, vitamin C, and botanical extracts, these products work in harmony to improve skin texture, reduce fine lines, and enhance radiance. Free from parabens, sulfates, and artificial fragrances, this collection is suitable for all skin types. The elegant packaging makes it a perfect gift for skincare enthusiasts.',
    briefDescription: 'Premium skincare set with cleanser, toner, serum, moisturizer, and eye cream',
    price: 199.99,
    category: 'beauty',
    images: [
      { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Products', value: '5 (Cleanser, Toner, Serum, Moisturizer, Eye Cream)' },
      { name: 'Key Ingredients', value: 'Hyaluronic Acid, Vitamin C, Botanical Extracts' },
      { name: 'Skin Type', value: 'All Skin Types' },
      { name: 'Free From', value: 'Parabens, Sulfates, Artificial Fragrances' },
      { name: 'Product Origin', value: 'Made in USA' }
    ],
    stock: 30,
    seller: SELLER_IDS.shashwatDesigners,
    colors: [
      { name: 'Standard', code: '#FFFFFF', stock: 30 }
    ],
    discount: 10
  },
  {
    name: 'Professional Hair Styling Kit',
    description: 'Achieve salon-quality results at home with our Professional Hair Styling Kit. This comprehensive set includes a ceramic hair dryer with multiple heat and speed settings, a titanium flat iron with adjustable temperature control, and a ceramic curling wand for versatile styling options. The ionic technology reduces frizz and adds shine, while the ergonomic design ensures comfortable handling. The heat-resistant mat and styling clips provide convenience during use. All tools feature rapid heating and automatic shut-off for safety. The durable travel case keeps everything organized and protected.',
    briefDescription: 'Complete hair styling kit with dryer, straightener, and curling wand',
    price: 149.99,
    category: 'beauty',
    images: [
      { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', isMain: true },
      { url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ],
    specifications: [
      { name: 'Components', value: 'Hair Dryer, Flat Iron, Curling Wand, Accessories' },
      { name: 'Hair Dryer Power', value: '1875W' },
      { name: 'Flat Iron Temperature', value: '265°F - 450°F' },
      { name: 'Curling Wand Barrel Size', value: '1 inch' },
      { name: 'Cord Length', value: '8 feet (swivel)' },
      { name: 'Warranty', value: '2 years' }
    ],
    stock: 25,
    seller: SELLER_IDS.myShop,
    colors: [
      { name: 'Black', code: '#000000', stock: 15 },
      { name: 'Rose Gold', code: '#B76E79', stock: 10 }
    ],
    discount: 5
  }
];

// Function to populate the database with products
const populateProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // REMOVED: Delete existing products
    // Instead, we'll check for existing products with the same name and skip them
    
    // Get existing product names to avoid duplicates
    const existingProducts = await Product.find({}, 'name');
    const existingProductNames = new Set(existingProducts.map(p => p.name));
    
    console.log(`Found ${existingProductNames.size} existing products`);
    
    // Filter out products that already exist
    const newProducts = products.filter(product => !existingProductNames.has(product.name));
    
    console.log(`Adding ${newProducts.length} new products (skipping ${products.length - newProducts.length} existing products)`);

    if (newProducts.length === 0) {
      console.log('No new products to add');
      return;
    }

    // Insert only new products
    const result = await Product.insertMany(newProducts);
    console.log(`Successfully added ${result.length} new products to the database`);

    // Log the products added by category
    const categoryCounts = {};
    result.forEach(product => {
      if (!categoryCounts[product.category]) {
        categoryCounts[product.category] = 0;
      }
      categoryCounts[product.category]++;
    });

    console.log('New products added by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('Error populating products:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
populateProducts(); 