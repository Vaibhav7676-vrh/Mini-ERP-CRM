import { Request, Response } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

// CREATE PRODUCT
export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

// GET ALL PRODUCTS
export const getProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET PRODUCT BY ID
export const getProductByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await updateProduct(id, req.body);

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};