import prisma from "../prisma/client";

interface ChallanItemInput {
  productId: number;
  quantity: number;
}

interface CreateChallanData {
  customerId: number;
  items: ChallanItemInput[];
  createdBy: number;
}

export const createChallan = async (data: CreateChallanData) => {
  const { customerId, items, createdBy } = data;

  if (!items || items.length === 0) {
    throw new Error("Challan must contain at least one product");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const challanNumber = `CH-${Date.now()}`;

  const challan = await prisma.challan.create({
    data: {
      challanNumber,
      customerId,
      totalQuantity,
      createdBy,
      status: "DRAFT",

      items: {
        create: items.map((item) => {
          const product = products.find(
            (p) => p.id === item.productId
          );

          if (!product) {
            throw new Error("Product not found");
          }

          return {
            productId: product.id,
            productNameSnapshot: product.name,
            skuSnapshot: product.sku,
            unitPriceSnapshot: product.unitPrice,
            quantity: item.quantity,
          };
        }),
      },
    },

    include: {
      customer: true,
      items: true,
    },
  });

  return challan;
};
export const getChallans = async () => {
  return prisma.challan.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};
export const getChallanById = async (id: number) => {
  const challan = await prisma.challan.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!challan) {
    throw new Error("Challan not found");
  }

  return challan;
};export const updateChallan = async (
  id: number,
  data: {
    customerId: number;
    items: {
      productId: number;
      quantity: number;
    }[];
  }
) => {
  const existingChallan = await prisma.challan.findUnique({
    where: { id },
  });

  if (!existingChallan) {
    throw new Error("Challan not found");
  }

  if (existingChallan.status !== "DRAFT") {
    throw new Error("Only draft challans can be updated");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Challan must contain at least one product");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: data.customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  const totalQuantity = data.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const updatedChallan = await prisma.$transaction(async (tx) => {
    await tx.challanItem.deleteMany({
      where: {
        challanId: id,
      },
    });

    return tx.challan.update({
      where: {
        id,
      },
      data: {
        customerId: data.customerId,
        totalQuantity,

        items: {
          create: data.items.map((item) => {
            const product = products.find(
              (p) => p.id === item.productId
            );

            if (!product) {
              throw new Error("Product not found");
            }

            return {
              productId: product.id,
              productNameSnapshot: product.name,
              skuSnapshot: product.sku,
              unitPriceSnapshot: product.unitPrice,
              quantity: item.quantity,
            };
          }),
        },
      },

      include: {
        customer: true,
        items: true,
      },
    });
  });

  return updatedChallan;
};
export const confirmChallan = async (
  challanId: number,
  userId: number
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Get the challan with its items
    const challan = await tx.challan.findUnique({
      where: {
        id: challanId,
      },
      include: {
        items: true,
      },
    });

    if (!challan) {
      throw new Error("Challan not found");
    }

    // 2. Only DRAFT challans can be confirmed
    if (challan.status !== "DRAFT") {
      throw new Error("Only draft challans can be confirmed");
    }

    // 3. Check every product's stock first
    for (const item of challan.items) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new Error(
          `Product ${item.productId} not found`
        );
      }

      if (product.currentStock < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.name}`
        );
      }
    }

    // 4. Reduce stock and create stock logs
    for (const item of challan.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          currentStock: {
            decrement: item.quantity,
          },
        },
      });

      await tx.stockLog.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: "OUT",
          reason: `Challan ${challan.challanNumber}`,
          createdBy: userId,
        },
      });
    }

    // 5. Mark challan as CONFIRMED
    const confirmedChallan = await tx.challan.update({
      where: {
        id: challanId,
      },
      data: {
        status: "CONFIRMED",
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return confirmedChallan;
  });
};
export const cancelChallan = async (challanId: number) => {
  const challan = await prisma.challan.findUnique({
    where: {
      id: challanId,
    },
  });

  if (!challan) {
    throw new Error("Challan not found");
  }

  if (challan.status === "CONFIRMED") {
    throw new Error(
      "Confirmed challans cannot be cancelled"
    );
  }

  if (challan.status === "CANCELLED") {
    throw new Error("Challan is already cancelled");
  }

  return prisma.challan.update({
    where: {
      id: challanId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      customer: true,
      items: true,
    },
  });
};