import CustomError from "../../types/customError";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { ErrorsMessages } from "../../types/errorsMessages";
import { ReviewModel } from "./review.model";
import { ReviewQueueService } from "./review.queue";
import {
  ReviewServiceCreateInput,
  ReviewServiceIdInput,
  ReviewServiceUpdateInput,
} from "./review.type";

export class ReviewService {
  static async list() {
    return ReviewModel.findAll();
  }

  static async create(data: ReviewServiceCreateInput) {
    const review = await ReviewModel.create({
      content: data.content,
      restaurantId: data.restaurantId,
      sentiment: null,
      confidence: null,
    });

    const analysis = await ReviewQueueService.enqueueAnalysis({
      reviewId: review.id,
      restaurantId: data.restaurantId,
      content: data.content,
    });

    return {
      review,
      analysis,
    };
  }

  static async getById(data: ReviewServiceIdInput) {
    const review = await ReviewModel.findById(data.id);

    if (!review) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    return review;
  }

  static async update(data: ReviewServiceIdInput & ReviewServiceUpdateInput) {
    const review = await ReviewModel.findById(data.id);

    if (!review) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    const updatedReview = await ReviewModel.update(data.id, {
      content: data.content,
      sentiment: null,
      confidence: null,
    });

    const analysis = await ReviewQueueService.enqueueAnalysis({
      reviewId: updatedReview.id,
      restaurantId: updatedReview.restaurantId,
      content: updatedReview.content,
    });

    return {
      review: updatedReview,
      analysis,
    };
  }

  static async remove(data: ReviewServiceIdInput) {
    const review = await ReviewModel.findById(data.id);

    if (!review) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    return ReviewModel.delete(data.id);
  }
}