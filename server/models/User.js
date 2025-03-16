import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profileType: {
    type: String,
    enum: ['consumer', 'seller', 'admin'],
    default: 'consumer'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  // Password reset fields
  resetCode: {
    type: String,
    default: null
  },
  resetExpires: {
    type: Date,
    default: null
  },
  // Additional fields for seller profile
  shopName: {
    type: String,
    trim: true,
    // Only required if profileType is seller
    required: function() {
      return this.profileType === 'seller';
    }
  },
  // Additional fields for consumer profile
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
}, { timestamps: true });

export default mongoose.model('User', userSchema); 