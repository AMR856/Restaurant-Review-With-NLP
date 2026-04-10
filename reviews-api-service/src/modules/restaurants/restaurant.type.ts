import { Request } from "express";
import {
  RestaurantCreateInput,
  RestaurantParamsInput,
  RestaurantUpdateInput,
} from "./restaurant.validation";

export interface CreateRestaurantRequest<
  P = {},
  ResBody = any,
  ReqBody = RestaurantCreateInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface UpdateRestaurantRequest<
  P = RestaurantParamsInput,
  ResBody = any,
  ReqBody = RestaurantUpdateInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface RestaurantIdRequest<
  P = RestaurantParamsInput,
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export type RestaurantServiceCreateInput = RestaurantCreateInput;
export type RestaurantServiceUpdateInput = RestaurantUpdateInput;
export type RestaurantServiceIdInput = {
  id: string;
};
