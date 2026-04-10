import CustomError from "../../types/customError";
import { randomUUID } from "crypto";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { ErrorsMessages } from "../../types/errorsMessages";
import { RestaurantRedisService } from "../restaurants/restaurant.redis";
import { ReviewModel } from "./review.model";
import { ReviewNlpService, ReviewSentiment } from "./review.nlp";
import {
  ReviewServiceCreateInput,
  ReviewServiceIdInput,
  ReviewServiceUpdateInput,
} from "./review.type";
import { roundTo } from "../../utils/roundTo";

const normalizeSentiment = (
  sentiment: string | null,
): ReviewSentiment | null => {
  if (sentiment === "positive" || sentiment === "negative") {
    return sentiment;
  }

  return null;
};

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

    const prediction = await ReviewNlpService.analyze(data.content);
    const analysis = {
      jobId: randomUUID(),
      reviewId: review.id,
      restaurantId: data.restaurantId,
      content: data.content,
      predictedSentiment: prediction.sentiment,
      confidence: roundTo(prediction.confidence, 4),
    };

    const analyzedReview = await ReviewModel.update(review.id, {
      sentiment: analysis.predictedSentiment,
      confidence: analysis.confidence,
    });

    await RestaurantRedisService.applyReviewSentimentChange(
      data.restaurantId,
      null,
      analysis.predictedSentiment,
    );

    return {
      review: analyzedReview,
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

    const previousSentiment = normalizeSentiment(review.sentiment);

    const updatedReview = await ReviewModel.update(data.id, {
      content: data.content,
      sentiment: null,
      confidence: null,
    });

    const prediction = await ReviewNlpService.analyze(updatedReview.content);
    const analysis = {
      jobId: randomUUID(),
      reviewId: updatedReview.id,
      restaurantId: updatedReview.restaurantId,
      content: updatedReview.content,
      predictedSentiment: prediction.sentiment,
      confidence: roundTo(prediction.confidence, 4),
    };

    const analyzedReview = await ReviewModel.update(data.id, {
      sentiment: analysis.predictedSentiment,
      confidence: analysis.confidence,
    });

    await RestaurantRedisService.applyReviewSentimentChange(
      updatedReview.restaurantId,
      previousSentiment,
      analysis.predictedSentiment,
    );

    return {
      review: analyzedReview,
      analysis,
    };
  }

  static async remove(data: ReviewServiceIdInput) {
    const review = await ReviewModel.findById(data.id);

    if (!review) {
      throw new CustomError(ErrorsMessages.NOT_FOUND, 404, HttpStatusText.FAIL);
    }

    const previousSentiment = normalizeSentiment(review.sentiment);

    await RestaurantRedisService.applyReviewSentimentChange(
      review.restaurantId,
      previousSentiment,
      null,
    );

    return ReviewModel.delete(data.id);
  }
}
