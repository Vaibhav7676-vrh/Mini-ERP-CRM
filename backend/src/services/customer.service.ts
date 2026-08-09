import prisma from "../prisma/client";

export const createCustomer = async (data: {
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status?: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: Date;
  notes?: string;
}) => {
  return prisma.customer.create({
    data,
  });
};

export const getCustomers = async (search?: string) => {
  return prisma.customer.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              mobile: {
                contains: search,
              },
            },
            {
              businessName: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
          ],
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCustomerById = async (id: number) => {
  return prisma.customer.findUnique({
    where: {
      id,
    },
  });
};

export const updateCustomer = async (
  id: number,
  data: {
    name?: string;
    mobile?: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType?: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
    address?: string;
    status?: "LEAD" | "ACTIVE" | "INACTIVE";
    followUpDate?: Date;
    notes?: string;
  }
) => {
  return prisma.customer.update({
    where: {
      id,
    },
    data,
  });
};
export const createFollowUp = async (
  customerId: number,
  userId: number,
  note: string
) => {
  return prisma.followUp.create({
    data: {
      customerId,
      userId,
      note,
    },
  });
};

export const getCustomerFollowUps = async (customerId: number) => {
  return prisma.followUp.findMany({
    where: {
      customerId,
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

export const deleteCustomer = async (id: number) => {
  return prisma.customer.delete({
    where: {
      id,
    },
  });
};
export const addFollowUp = async (
  customerId: number,
  userId: number,
  note: string
) => {
  if (!note || !note.trim()) {
    throw new Error("Follow-up note is required");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return prisma.followUp.create({
    data: {
      customerId,
      userId,
      note: note.trim(),
    },
    include: {
      customer: true,
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