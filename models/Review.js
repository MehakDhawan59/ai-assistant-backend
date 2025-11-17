import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  
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
    reviewerName: {
      type: String,
      required: true
    },
    reviewerEmail: {
      type: String,
      required: true
    },
    // AI Enhancement Fields
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    categories: [{
      type: String,
      // e.g., 'fabric', 'price', 'delivery', 'quality', 'size'
    }],
    // Flag for helpful reviews
    isHelpful: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0
    }
  }, {
    timestamps: true
  });

  export default reviewSchema;  