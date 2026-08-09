import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  createFollowUp,
  getCustomerFollowUps,
  
} from "../services/customer.service";
import {
  addFollowUp,
} from "../services/customer.service";

// CREATE CUSTOMER
export const createCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = await createCustomer(req.body);

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

// GET ALL CUSTOMERS
export const getCustomersController = async (
  req: Request,
  res: Response
) => {
  try {
    const search = req.query.search as string | undefined;

    const customers = await getCustomers(search);

    return res.status(200).json({
      customers,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMER BY ID
export const getCustomerByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const customer = await getCustomerById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
};

// UPDATE CUSTOMER
export const updateCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const customer = await updateCustomer(id, req.body);

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update customer",
    });
  }
};

// DELETE CUSTOMER
export const deleteCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteCustomer(id);

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete customer",
    });
  }
};
export const createFollowUpController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customerId = Number(req.params.id);
    const userId = req.user!.userId;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        message: "Follow-up note is required",
      });
    }

    const followUp = await createFollowUp(
      customerId,
      userId,
      note
    );

    return res.status(201).json({
      message: "Follow-up created successfully",
      followUp,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create follow-up",
    });
  }
};

export const getCustomerFollowUpsController = async (
  req: Request,
  res: Response
) => {
  try {
    const customerId = Number(req.params.id);

    const followUps = await getCustomerFollowUps(customerId);

    return res.status(200).json({
      followUps,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch follow-ups",
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