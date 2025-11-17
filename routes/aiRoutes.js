import express from "express";
import { getAIProductResponse } from "../controllers/aiController.js";

const router = express.Router();

// GET /api/ai/product/:id?query=...
router.post("/product/:productId", getAIProductResponse);

export default router;
