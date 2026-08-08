import bcrypt from "bcryptjs";
import prisma from "../src/prisma/client";
import process from "process";

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@mini-erp.com",
    },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@mini-erp.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });