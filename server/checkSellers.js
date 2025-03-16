import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkSellers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all sellers
    const sellers = await mongoose.connection.db.collection('users').find({ profileType: 'seller' }).toArray();
    
    console.log('Found sellers:', sellers.length);
    console.log(JSON.stringify(sellers, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkSellers(); 