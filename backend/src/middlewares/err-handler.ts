import { Request, Response, NextFunction } from "express";
import resHandler from "./res-hadler";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  const code = err.status || 400;
  const msg = err.message || "Something went wrong...";

  resHandler.error(res, { msg, code });
};

export default errorHandler;
