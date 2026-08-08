import { Router } from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";

const router = Router();

// Create product
router.post("/", createProductController);

// Get all products
router.get("/", getProductsController);

// Get product by ID
router.get("/:id", getProductByIdController);

// Update product
router.put("/:id", updateProductController);

// Delete product
router.delete("/:id", deleteProductController);

export default router;
