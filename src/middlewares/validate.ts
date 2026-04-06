import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import CustomError from "../types/customError";
import { HttpStatusText } from "../types/HTTPStatusText";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  <T>(schema: ZodSchema<T>, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = formatZodErrors(result.error);
      return next(new CustomError(message, 400, HttpStatusText.FAIL));
    }

    req[target] = result.data;
    next();
  };

const formatZodErrors = (error: ZodError): string => {
  return error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
};
