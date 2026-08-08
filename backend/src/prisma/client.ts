import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD!,
  database: "mini_erp_crm",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;