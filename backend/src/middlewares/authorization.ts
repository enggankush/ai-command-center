import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import resHandler from "./res-hadler";

const APP_NAME = process.env.APP_NAME;
const SECRET_KEY = process.env.JWT_SECRET as string;

const authorization = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== "production") {
    next();
    return;
  }

  const headers = req.headers;
  const authorization = headers["authorization"];

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return resHandler.error(res, {
      msg: "Token is not supplied",
      code: 401,
    });
  }

  const token = authorization.slice(7, authorization.length);

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      console.error(err);
      return resHandler.error(res, {
        msg: err.message,
        code: 401,
      });
    }

    if (decoded.clientName !== APP_NAME) {
      console.info(decoded);
      return resHandler.error(res, {
        msg: "Invalid token supplied",
        code: 401,
      });
    }

    next();
  });
};

export default authorization;
