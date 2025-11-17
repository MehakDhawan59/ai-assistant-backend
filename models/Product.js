import mongoose from "mongoose";
import reviewSchema from "./Review.js";

const productSchema = new mongoose.Schema({

    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    tags: [{
      type: String
    }],
    brand: String,
    sku: {
      type: String,
      unique: true
    },
    weight: Number,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock'
    },
    reviews: [reviewSchema],
    sentiment:String,
    returnPolicy: String,
    minimumOrderQuantity: {
      type: Number,
      default: 1
    },
    // meta: metaSchema,
    images: [String],
    thumbnail: String
  }, {
    timestamps: true
  });

  const Product = mongoose.model('Product', productSchema);

export default Product;