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
      return resHandler.error(res, {
        msg: "All fields are required",
        code: 400,
      });
    }

    const user = await authService.register(fullName, email, password);

    return resHandler.success(res, {
      code: 201,
      msg: "User registered successfully",
      user: {
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
      return resHandler.error(res, {
        msg: "Email and password are required",
        code: 400,
      });
    }

    const { user, token } = await authService.login(email, password);

    return resHandler.success(res, {
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
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
      return resHandler.error(res, {
        msg: "Email is required",
        code: 400,
      });
    }

    const { user } = await authService.forgotPassword(email);

    return resHandler.success(res, {
      msg: "Password reset link sent",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
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
      return resHandler.error(res, {
        msg: "Token and new password are required",
        code: 400,
      });
    }

    await authService.resetPassword(token, newPassword);

    return resHandler.success(res, {
      msg: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
