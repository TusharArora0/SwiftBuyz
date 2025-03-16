import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is a seller, delete all their related data
    if (user.profileType === 'seller') {
      // Delete all products by this seller
      const deletedProducts = await Product.deleteMany({ seller: userId });
      console.log(`Deleted ${deletedProducts.deletedCount} products`);

      // Update orders that contain products from this seller
      // Mark seller's products as "Seller Removed" or similar
      await Order.updateMany(
        { 'items.seller': userId },
        { 
          $set: { 
            'items.$[elem].status': 'Seller Removed',
            'items.$[elem].available': false
          }
        },
        { 
          arrayFilters: [{ 'elem.seller': userId }],
          multi: true 
        }
      );
    }

    // Delete user's orders if they're a consumer
    if (user.profileType === 'consumer') {
      await Order.deleteMany({ user: userId });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Send success response with details
    res.status(200).json({ 
      message: 'User and associated data deleted successfully',
      deletedData: {
        userId: userId,
        profileType: user.profileType,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
}; 