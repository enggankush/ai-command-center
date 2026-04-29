import { Response } from "express";

const resHandler = {
  success: (
    res: Response,
    pl: { msg?: string; code?: number; [key: string]: any },
  ) => {
    const { code = 200, msg = "Success", ...rest } = pl;

    res.status(code).json({
      success: true,
      message: msg,
      ...rest, // 👈 token, user, etc. come here directly
    });
  },

  error: (res: Response, pl: { msg: string; code: number }, errors?: any) => {
    res.status(pl.code).json({
      success: false,
      message: pl.msg,
      errors,
    });
  },
};

export default resHandler;
