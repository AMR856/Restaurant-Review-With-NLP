import { RestaurantModel } from "./restaurant.model";
import CustomError from "../../types/customError";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { ErrorsMessages } from "../../types/errorsMessages";
import {
  RestaurantServiceCreateInput,
  RestaurantServiceIdInput,
  RestaurantServiceUpdateInput,
} from "./restaurant.type";

export class RestaurantService {
  static async list() {
    return RestaurantModel.findAll();
  }

  static async create(data: RestaurantServiceCreateInput) {
    const existingRestaurant = await RestaurantModel.findByName(data.name);

    if (existingRestaurant) {
      throw new CustomError(
        ErrorsMessages.CONFLICT,
        409,
        HttpStatusText.FAIL,
      );
    }

    return RestaurantModel.create({
      name: data.name,
    });
  }

  static async getById(data: RestaurantServiceIdInput) {
    const restaurant = await RestaurantModel.findById(data.id);

    if (!restaurant) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    return restaurant;
  }

  static async update(data: RestaurantServiceIdInput & RestaurantServiceUpdateInput) {
    const restaurant = await RestaurantModel.findById(data.id);

    if (!restaurant) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    if (data.name) {
      const sameNameRestaurant = await RestaurantModel.findByName(data.name);

      if (sameNameRestaurant && sameNameRestaurant.id !== data.id) {
        throw new CustomError(
          ErrorsMessages.CONFLICT,
          409,
          HttpStatusText.FAIL,
        );
      }
    }

    return RestaurantModel.update(data.id, {
      name: data.name,
    });
  }

  static async remove(data: RestaurantServiceIdInput) {
    const restaurant = await RestaurantModel.findById(data.id);

    if (!restaurant) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    return RestaurantModel.delete(data.id);
  }
}
