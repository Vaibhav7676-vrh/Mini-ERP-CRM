import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import customerRoutes from "./routes/customer.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Mini ERP CRM API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});