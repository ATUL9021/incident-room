import type { Response, Request, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);
  if (!(error instanceof AppError)) {
    return res.status(500).send({
      ERROR_CODE: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }

  return res.status(error.statusCode).send({
    ERROR_CODE: error.errorCode,
    message: error.message,
  });
}
