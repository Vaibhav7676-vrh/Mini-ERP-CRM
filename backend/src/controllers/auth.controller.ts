import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../prisma/client";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error
        ? error.message
        : "Authentication failed",
    });
  }
}
export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}