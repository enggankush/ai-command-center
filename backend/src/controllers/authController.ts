import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import resHandler from "../middlewares/res-hadler";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await authService.register(fullName, email, password);
    resHandler.success(res, {
      code: 201,
      msg: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { user, token } = await authService.login(email, password);

    resHandler.success(res, {
      msg: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { user } = await authService.forgotPassword(email);

    resHandler.success(res, {
      msg: "Password reset link sent",
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    await authService.resetPassword(token, newPassword);
    resHandler.success(res, {
      msg: "Password reset successfully",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};
