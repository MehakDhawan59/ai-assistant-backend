// Import dependencies
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productroutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

//Initialize app using express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "", 
  credentials: true
}));
 // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI E-commerce Assistant API', 
    status: 'Server is running!' 
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend API is working!' 
  });
});

// Product Routes
app.use("/api/products", productroutes);

// ai route
app.use("/api/ai", aiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
