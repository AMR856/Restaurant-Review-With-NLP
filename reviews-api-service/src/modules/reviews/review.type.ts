import { Request } from "express";
import {
  ReviewCreateInput,
  ReviewParamsInput,
  ReviewUpdateInput,
} from "./review.validation";

export interface CreateReviewRequest<
  P = {},
  ResBody = any,
  ReqBody = ReviewCreateInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface UpdateReviewRequest<
  P = ReviewParamsInput,
  ResBody = any,
  ReqBody = ReviewUpdateInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface ReviewIdRequest<
  P = ReviewParamsInput,
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export type ReviewServiceCreateInput = ReviewCreateInput;
export type ReviewServiceUpdateInput = ReviewUpdateInput;
export type ReviewServiceIdInput = {
  id: string;
};