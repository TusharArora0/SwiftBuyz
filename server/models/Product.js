import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  userName: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  briefDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  specifications: [{
    name: String,
    value: String
  }],
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [reviewSchema],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String, // Hex color code
      required: true
    },
    stock: {
      type: Number,
      default: 0
    }
  }],
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
}, { timestamps: true });

// Calculate average rating when a review is added
productSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = sum / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
};

// Ensure at least one image is marked as main
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const hasMainImage = this.images.some(img => img.isMain);
    if (!hasMainImage) {
      this.images[0].isMain = true;
    }
  }
  next();
});

export default mongoose.model('Product', productSchema); 