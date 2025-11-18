// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productroutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();

// Parse allowed origins from env (comma-separated)
const raw = process.env.ALLOWED_ORIGIN || "";
const allowedOrigins = raw.split(",").map(s => s.trim()).filter(Boolean);

// ensure localhost dev origin is present (optional)
if (!allowedOrigins.includes("http://localhost:5173")) {
  allowedOrigins.push("http://localhost:5173");
}

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // origin not allowed
    return callback(new Error("CORS: Origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
// Enable preflight for all routes
app.options("*", cors(corsOptions));

app.use(express.json()); // Parse JSON bodies

// Optional: set a safe Referrer-Policy header
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Optional: central error handler for CORS rejection
app.use((err, req, res, next) => {
  if (err && /CORS: Origin not allowed/.test(err.message)) {
    return res.status(403).json({ success: false, message: err.message });
  }
  next(err);
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "AI E-commerce Assistant API", status: "Server is running!" });
});
app.get("/api/test", (req, res) => res.json({ success: true, message: "Backend API is working!" }));

app.use("/api/products", productroutes);
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
