import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

// {body : "" , params:""}
export function validate(schemas: {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        throw new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          result.error.message,
        );
      }

      req.body = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        throw new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          result.error.message,
        );
      }

      req.query = result.data as typeof req.query;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        throw new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          result.error.message,
        );
      }

      req.params = result.data as typeof req.params;
    }

    next();
  };
}
