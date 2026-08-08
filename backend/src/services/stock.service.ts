import prisma from "../prisma/client";

export const stockIn = async (
  productId: number,
  quantity: number,
  reason: string,
  userId: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        currentStock: {
          increment: quantity,
        },
      },
    });

    const stockLog = await tx.stockLog.create({
      data: {
        productId,
        quantity,
        movementType: "IN",
        reason,
        createdBy: userId,
      },
    });

    return {
      product: updatedProduct,
      stockLog,
    };
  });
};

export const stockOut = async (
  productId: number,
  quantity: number,
  reason: string,
  userId: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.currentStock < quantity) {
      throw new Error("Insufficient stock");
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        currentStock: {
          decrement: quantity,
        },
      },
    });

    const stockLog = await tx.stockLog.create({
      data: {
        productId,
        quantity,
        movementType: "OUT",
        reason,
        createdBy: userId,
      },
    });

    return {
      product: updatedProduct,
      stockLog,
    };
  });
};

export const getStockLogs = async (productId: number) => {
  return prisma.stockLog.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};