import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization as string;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const payload = jwt.verify(token, JWT_PASSWORD);
    if (payload) {
      // @ts-ignore
      req.id = payload.id;
      next();
    }
  } catch (e) {
    return res.status(403).json({ message: "You are not logged in !" });
  }
}
