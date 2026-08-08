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

export const getCustomers = async () => {
  return prisma.customer.findMany({
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