import type { Response, Request, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorizatioHeader = req.headers.authorization;

  if (!authorizatioHeader) {
    throw new Error("Authorization header is not found");
  }

  const [schema, token] = authorizatioHeader.split(" ");

  if (schema !== "Bearer" || !token) {
    throw new Error("Invalid Authorization Header");
  }

  try {
    const payload = verifyAccessToken(token) as JwtPayload;

    req.userId = payload.subject;
    next();
  } catch (e) {
    const error = new Error("invalid or expired token");
    next(error);
  }
}
