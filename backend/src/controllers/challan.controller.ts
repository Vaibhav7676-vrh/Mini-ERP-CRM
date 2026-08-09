import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  createChallan,
  getChallans,
  getChallanById,
  updateChallan,
  confirmChallan,
  cancelChallan,
} from "../services/challan.service";
import {
  addFollowUp,
} from "../services/customer.service";


export const createChallanController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { customerId, items } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const challan = await createChallan({
      customerId,
      items,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      message: "Challan created successfully",
      challan,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getChallansController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const challans = await getChallans();

    return res.status(200).json({
      challans,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getChallanByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const challan = await getChallanById(id);

    return res.status(200).json({
      challan,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
export const updateChallanController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const { customerId, items } = req.body;

    const challan = await updateChallan(id, {
      customerId,
      items,
    });

    return res.status(200).json({
      message: "Challan updated successfully",
      challan,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const confirmChallanController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const challan = await confirmChallan(
      id,
      req.user.userId
    );

    return res.status(200).json({
      message: "Challan confirmed successfully",
      challan,
    });
  } catch (error: any) {
    const message = error.message;

    if (message === "Challan not found") {
      return res.status(404).json({
        message,
      });
    }

    if (
      message === "Only draft challans can be confirmed" ||
      message.startsWith("Insufficient stock") ||
      message.startsWith("Product")
    ) {
      return res.status(400).json({
        message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Failed to confirm challan",
    });
  }
};
export const cancelChallanController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const challan = await cancelChallan(id);

    return res.status(200).json({
      message: "Challan cancelled successfully",
      challan,
    });
  } catch (error: any) {
    const message = error.message;

    if (message === "Challan not found") {
      return res.status(404).json({
        message,
      });
    }

    if (
      message === "Confirmed challans cannot be cancelled" ||
      message === "Challan is already cancelled"
    ) {
      return res.status(400).json({
        message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Failed to cancel challan",
    });
  }
};
export const addFollowUpController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customerId = Number(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { note } = req.body;

    const followUp = await addFollowUp(
      customerId,
      req.user.userId,
      note
    );

    return res.status(201).json({
      message: "Follow-up added successfully",
      followUp,
    });
  } catch (error: any) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};