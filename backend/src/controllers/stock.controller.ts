import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import {
  stockIn,
  stockOut,
  getStockLogs,
} from "../services/stock.service";

// STOCK IN
export const stockInController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);
    const userId = req.user!.userId;

    const { quantity, reason } = req.body;

    if (!quantity || !reason) {
      return res.status(400).json({
        message: "Quantity and reason are required",
      });
    }

    const result = await stockIn(
      productId,
      Number(quantity),
      reason,
      userId
    );

    return res.status(200).json({
      message: "Stock added successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to add stock";

    if (message === "Product not found") {
      return res.status(404).json({ message });
    }

    if (message === "Quantity must be greater than zero") {
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message: "Failed to add stock",
    });
  }
};

// STOCK OUT
export const stockOutController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);
    const userId = req.user!.userId;

    const { quantity, reason } = req.body;

    if (!quantity || !reason) {
      return res.status(400).json({
        message: "Quantity and reason are required",
      });
    }

    const result = await stockOut(
      productId,
      Number(quantity),
      reason,
      userId
    );

    return res.status(200).json({
      message: "Stock removed successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to remove stock";

    if (message === "Product not found") {
      return res.status(404).json({ message });
    }

    if (
      message === "Quantity must be greater than zero" ||
      message === "Insufficient stock"
    ) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message: "Failed to remove stock",
    });
  }
};

// GET STOCK LOGS
export const getStockLogsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);

    const logs = await getStockLogs(productId);

    return res.status(200).json({
      logs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch stock logs",
    });
  }
};