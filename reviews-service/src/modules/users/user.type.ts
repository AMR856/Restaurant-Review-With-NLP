import { LoginInput, RegisterInput } from "./user.validation";
import { Request } from "express";

export interface RegisterRequest<
  P = {},
  ResBody = any,
  ReqBody = RegisterInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface LoginRequest<
  P = {},
  ResBody = any,
  ReqBody = LoginInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface ProfileRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {
  user: { id: string };
}

export type RegisterServiceInput = RegisterInput;
export type LoginServiceInput = LoginInput;
export type ProfileServiceInput = {
  userId: string;
};
