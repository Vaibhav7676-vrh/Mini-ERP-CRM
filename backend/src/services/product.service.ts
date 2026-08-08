import prisma from "../prisma/client";

export const createProduct = async (data: {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock?: number;
  minimumStock?: number;
  warehouse: string;
}) => {
  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      category: data.category,
      unitPrice: data.unitPrice,
      currentStock: data.currentStock ?? 0,
      minimumStock: data.minimumStock ?? 0,
      warehouse: data.warehouse,
    },
  });
};

export const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    sku?: string;
    category?: string;
    unitPrice?: number;
    currentStock?: number;
    minimumStock?: number;
    warehouse?: string;
  }
) => {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: {
      id,
    },
  });
};