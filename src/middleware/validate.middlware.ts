import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export function validate(schema: z.ZodType) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        400,
        ERROR_CODES.VALIDATION_ERROR,
        result.error.message,
      );
    }

    req.body = result.data;

    next();
  };
}
