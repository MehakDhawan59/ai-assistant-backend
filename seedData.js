import Product from "./models/Product.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});

    // Fetch from DummyJSON
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    // Process and enhance data
    const products = data.products.map((product) => {
      const { id, ...rest } = product;
      return {
        ...rest,
        reviews: (product.reviews || []).map((review) => ({
          ...review,
        })),
      };
    });

    // Save to database
    await Product.insertMany(products);

    // Success message
    console.log("✅ Data seeded successfully");
  } catch (error) {
    // Error handling
    console.error("❌ Error seeding data:", error);
  } finally {
    // Close connection
    mongoose.connection.close();
  }
};

seedDatabase();
