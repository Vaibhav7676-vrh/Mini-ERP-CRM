import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}