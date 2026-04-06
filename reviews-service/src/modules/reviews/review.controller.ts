import { NextFunction, Response } from "express";
import { HttpStatusText } from "../../types/HTTPStatusText";
import {
  CreateReviewRequest,
  ReviewIdRequest,
  UpdateReviewRequest,
} from "./review.type";
import { ReviewService } from "./review.service";

export class ReviewController {
  static async list(req: ReviewIdRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.list();

      res.json({
        status: HttpStatusText.SUCCESS,
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(
    req: CreateReviewRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await ReviewService.create(req.body);

      res.status(202).json({
        status: HttpStatusText.SUCCESS,
        data: {
          reviewId: result.review.id,
          analysisJobId: result.analysis.jobId,
          sentiment: result.analysis.predictedSentiment,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: ReviewIdRequest, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.getById(req.params);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: UpdateReviewRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await ReviewService.update({
        ...req.params,
        ...req.body,
      });

      res.status(202).json({
        status: HttpStatusText.SUCCESS,
        data: {
          reviewId: result.review.id,
          analysisJobId: result.analysis.jobId,
          sentiment: result.analysis.predictedSentiment,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: ReviewIdRequest, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.remove(req.params);

      res.json({
        status: HttpStatusText.SUCCESS,
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }
}