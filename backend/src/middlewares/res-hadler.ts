import { Response } from "express";

const resHandler = {
  success: (res: Response, pl: { data: any; msg?: string; code?: number }) => {
    res.status(pl.code || 200).json({
      status: "success",
      statusCode: pl.code || 200,
      message: pl.msg || "Success",
      data: pl.data,
    });
  },

  error: (res: Response, pl: { msg: string; code: number }, errors?: any) => {
    res.status(pl.code).json({
      status: "error",
      statusCode: pl.code,
      message: pl.msg,
      errors,
      data: null,
    });
  },
};

export default resHandler;
