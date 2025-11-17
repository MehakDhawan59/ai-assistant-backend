import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const productroutes = express.Router();

productroutes.get("/", getProducts);
productroutes.get("/:id", getProductById);
productroutes.post("/", createProduct);
productroutes.put("/:id", updateProduct);
productroutes.delete("/:id", deleteProduct);

export default productroutes;
