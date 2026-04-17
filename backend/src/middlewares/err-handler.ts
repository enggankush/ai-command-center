import { Request, Response, NextFunction } from "express";
import resHandler from "./res-hadler";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction, // donot remove next
) => {
  console.error(err);

  const code = err.status || 400;
  const msg = err.message || "Something went wrong...";

  resHandler.error(res, { msg, code });
};

export default errorHandler;
