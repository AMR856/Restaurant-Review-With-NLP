import { NextFunction, Response } from "express";
import { HttpStatusText } from "../../types/HTTPStatusText";
import {
  CreateRestaurantRequest,
  RestaurantIdRequest,
  UpdateRestaurantRequest,
} from "./restaurant.type";
import { RestaurantService } from "./restaurant.service";

export class RestaurantController {
  static async list(req: RestaurantIdRequest, res: Response, next: NextFunction) {
    try {
      const restaurants = await RestaurantService.list();

      res.json({
        status: HttpStatusText.SUCCESS,
        data: restaurants,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(
    req: CreateRestaurantRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const restaurant = await RestaurantService.create(req.body);

      res.status(201).json({
        status: HttpStatusText.SUCCESS,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: RestaurantIdRequest, res: Response, next: NextFunction) {
    try {
      const restaurant = await RestaurantService.getById(req.params);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: UpdateRestaurantRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const restaurant = await RestaurantService.update({
        ...req.params,
        ...req.body,
      });

      res.json({
        status: HttpStatusText.SUCCESS,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: RestaurantIdRequest, res: Response, next: NextFunction) {
    try {
      const restaurant = await RestaurantService.remove(req.params);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  }
}
