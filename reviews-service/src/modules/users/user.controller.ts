import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { LoginRequest, ProfileRequest, RegisterRequest } from "./user.type";
import { HttpStatusText } from "../../types/HTTPStatusText";

export class UserController {
  static async register(
    req: RegisterRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({
        status: HttpStatusText.SUCCESS,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const result = await UserService.login(req.body);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as ProfileRequest).user.id;
      const user = await UserService.profile({ userId });

      res.json({
        status: HttpStatusText.SUCCESS,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
