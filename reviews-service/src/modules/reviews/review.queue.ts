import { randomUUID } from "crypto";
import { ReviewNlpService } from "./review.nlp";

export type ReviewAnalysisJob = {
  jobId: string;
  reviewId: string;
  restaurantId: string;
  content: string;
  predictedSentiment: "positive";
};

export const ReviewQueueService = {
  async enqueueAnalysis(input: {
    reviewId: string;
    restaurantId: string;
    content: string;
  }): Promise<ReviewAnalysisJob> {
    const prediction = await ReviewNlpService.analyze(input.content);

    return {
      jobId: randomUUID(),
      reviewId: input.reviewId,
      restaurantId: input.restaurantId,
      content: input.content,
      predictedSentiment: prediction.sentiment,
    };
  },
};