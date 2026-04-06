import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import CustomError from "../../types/customError";
import { ReviewModel } from "./review.model";
import { ReviewQueueService } from "./review.queue";
import { ReviewService } from "./review.service";

jest.mock("./review.model", () => ({
  ReviewModel: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByRestaurantId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("./review.queue", () => ({
  ReviewQueueService: {
    enqueueAnalysis: jest.fn(),
  },
}));

const mockedReviewModel = ReviewModel as jest.Mocked<typeof ReviewModel>;
const mockedQueueService = ReviewQueueService as jest.Mocked<typeof ReviewQueueService>;

describe("ReviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return all reviews", async () => {
      mockedReviewModel.findAll.mockResolvedValue([{ id: "1", content: "Good" }] as any);

      const result = await ReviewService.list();

      expect(result).toEqual([{ id: "1", content: "Good" }]);
    });
  });

  describe("create", () => {
    it("should create a review with null sentiment and queue analysis", async () => {
      mockedReviewModel.create.mockResolvedValue({
        id: "review-1",
        content: "Great food",
        restaurantId: "restaurant-1",
      } as any);

      mockedQueueService.enqueueAnalysis.mockResolvedValue({
        jobId: "job-1",
        reviewId: "review-1",
        restaurantId: "restaurant-1",
        content: "Great food",
        predictedSentiment: "positive",
      } as any);

      const result = await ReviewService.create({
        restaurantId: "restaurant-1",
        content: "Great food",
      });

      expect(mockedReviewModel.create).toHaveBeenCalledWith({
        content: "Great food",
        restaurantId: "restaurant-1",
        sentiment: null,
        confidence: null,
      });
      expect(mockedQueueService.enqueueAnalysis).toHaveBeenCalledWith({
        reviewId: "review-1",
        restaurantId: "restaurant-1",
        content: "Great food",
      });
      expect(result.analysis.predictedSentiment).toBe("positive");
    });
  });

  describe("getById", () => {
    it("should return a review by id", async () => {
      mockedReviewModel.findById.mockResolvedValue({ id: "1", content: "Good" } as any);

      const result = await ReviewService.getById({ id: "1" });

      expect(result).toEqual({ id: "1", content: "Good" });
    });

    it("should throw if review not found", async () => {
      mockedReviewModel.findById.mockResolvedValue(null);

      await expect(ReviewService.getById({ id: "1" })).rejects.toThrow(CustomError);
    });
  });

  describe("update", () => {
    it("should update a review and reset sentiment to null before queueing analysis", async () => {
      mockedReviewModel.findById.mockResolvedValue({
        id: "1",
        content: "Old",
        restaurantId: "restaurant-1",
      } as any);

      mockedReviewModel.update.mockResolvedValue({
        id: "1",
        content: "New",
        restaurantId: "restaurant-1",
      } as any);

      mockedQueueService.enqueueAnalysis.mockResolvedValue({
        jobId: "job-1",
        reviewId: "1",
        restaurantId: "restaurant-1",
        content: "New",
        predictedSentiment: "positive",
      } as any);

      const result = await ReviewService.update({
        id: "1",
        content: "New",
      });

      expect(mockedReviewModel.update).toHaveBeenCalledWith("1", {
        content: "New",
        sentiment: null,
        confidence: null,
      });
      expect(result.analysis.predictedSentiment).toBe("positive");
    });

    it("should throw if review not found", async () => {
      mockedReviewModel.findById.mockResolvedValue(null);

      await expect(
        ReviewService.update({ id: "1", content: "New" }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("remove", () => {
    it("should delete a review", async () => {
      mockedReviewModel.findById.mockResolvedValue({ id: "1" } as any);
      mockedReviewModel.delete.mockResolvedValue({ id: "1" } as any);

      const result = await ReviewService.remove({ id: "1" });

      expect(result).toEqual({ id: "1" });
      expect(mockedReviewModel.delete).toHaveBeenCalledWith("1");
    });

    it("should throw if review not found", async () => {
      mockedReviewModel.findById.mockResolvedValue(null);

      await expect(ReviewService.remove({ id: "1" })).rejects.toThrow(CustomError);
    });
  });
});
