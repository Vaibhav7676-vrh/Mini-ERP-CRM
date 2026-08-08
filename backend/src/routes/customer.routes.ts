import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createCustomerController,
  getCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
  createFollowUpController,
  getCustomerFollowUpsController,
} from "../controllers/customer.controller";

const router = Router();

// Create customer
router.post("/", createCustomerController);

// Get all customers
router.get("/", getCustomersController);

// Get customer by ID
router.get("/:id", getCustomerByIdController);

// Update customer
router.put("/:id", updateCustomerController);

// Delete customer
router.delete("/:id", deleteCustomerController);
router.post(
  "/:id/followups",
  authenticate,
  createFollowUpController
);

router.get(
  "/:id/followups",
  authenticate,
  getCustomerFollowUpsController
);

export default router;