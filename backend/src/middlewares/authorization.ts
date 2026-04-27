import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import resHandler from "./res-hadler";

const JWT_SECRET = process.env.JWT_SECRET as string;

const authorization = (req: Request, res: Response, next: NextFunction) => {
  // console.log("In auth midd");

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return resHandler.error(res, {
        code: 401,
        msg: "Invalid or missing token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return resHandler.error(res, { code: 401, msg: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      iat: number;
      exp: number;
    };
    res.locals.userId = decoded.userId;

    next();
  } catch (err: any) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      return resHandler.error(res, { code: 401, msg: "Token expired" });
    }
    return resHandler.error(res, { code: 401, msg: "Invalid token" });
  }
};

export default authorization;
