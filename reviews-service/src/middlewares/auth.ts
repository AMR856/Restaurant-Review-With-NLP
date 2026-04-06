import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusText } from "../types/HTTPStatusText";
import CustomError from "../types/customError";
import { ErrorsMessages } from "../types/errorsMessages";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new CustomError(ErrorsMessages.UNAUTHORIZED, 401, HttpStatusText.FAIL),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch {
    return next(
      new CustomError(ErrorsMessages.UNAUTHORIZED, 401, HttpStatusText.FAIL),
    );
  }
}
