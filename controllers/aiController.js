import Product from "../models/Product.js";
import { buildAIContext, queryAIModel } from "../services/aiService.js";

export const getAIProductResponse = async (req, res) => {
const {productId} = req.params;
    const { question } = req.body; // read from body
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      const {productInfo, allReviewsText} = buildAIContext(product, product.reviews);
      const aiResponse = await queryAIModel(productInfo, allReviewsText, question);
      // const aiResponse = "This is a sample response";
      return res.json({
        success: true,
        data: {
          productId: productId,
          aiResponse,
        },
      });
    } catch (error) {
      console.error("❌ AI Query Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
