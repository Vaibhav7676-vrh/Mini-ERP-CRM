import { Router } from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";
import {
  stockInController,
  stockOutController,
  getStockLogsController,
} from "../controllers/stock.controller";

import { authenticate } from "../middleware/auth.middleware";

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

router.post(
  "/:id/stock/in",
  authenticate,
  stockInController
);

router.post(
  "/:id/stock/out",
  authenticate,
  stockOutController
);

router.get(
  "/:id/stock-logs",
  authenticate,
  getStockLogsController
);

export default router;
