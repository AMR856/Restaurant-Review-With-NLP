import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import CustomError from "../../types/customError";
import { RestaurantRedisService } from "../restaurants/restaurant.redis";
import { ReviewModel } from "./review.model";
import { ReviewNlpService } from "./review.nlp";
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

jest.mock("./review.nlp", () => ({
  ReviewNlpService: {
    analyze: jest.fn(),
  },
}));

jest.mock("../restaurants/restaurant.redis", () => ({
  RestaurantRedisService: {
    applyReviewSentimentChange: jest.fn(),
  },
}));

const mockedReviewModel = ReviewModel as jest.Mocked<typeof ReviewModel>;
const mockedReviewNlpService = ReviewNlpService as jest.Mocked<
  typeof ReviewNlpService
>;
const mockedRestaurantRedisService = RestaurantRedisService as jest.Mocked<
  typeof RestaurantRedisService
>;

describe("ReviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return all reviews", async () => {
      mockedReviewModel.findAll.mockResolvedValue([
        { id: "1", content: "Good" },
      ] as any);

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

      mockedReviewModel.update.mockResolvedValue({
        id: "review-1",
        content: "Great food",
        restaurantId: "restaurant-1",
        sentiment: "positive",
        confidence: 0.99,
      } as any);

      mockedReviewNlpService.analyze.mockResolvedValue({
        sentiment: "positive",
        confidence: 0.99,
      });

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
      expect(mockedReviewNlpService.analyze).toHaveBeenCalledWith("Great food");
      expect(mockedRestaurantRedisService.applyReviewSentimentChange).toHaveBeenCalledWith(
        "restaurant-1",
        null,
        "positive",
      );
      expect(result.analysis.predictedSentiment).toBe("positive");
    });
  });

  describe("getById", () => {
    it("should return a review by id", async () => {
      mockedReviewModel.findById.mockResolvedValue({
        id: "1",
        content: "Good",
      } as any);

      const result = await ReviewService.getById({ id: "1" });

      expect(result).toEqual({ id: "1", content: "Good" });
    });

    it("should throw if review not found", async () => {
      mockedReviewModel.findById.mockResolvedValue(null);

      await expect(ReviewService.getById({ id: "1" })).rejects.toThrow(
        CustomError,
      );
    });
  });

  describe("update", () => {
    it("should update a review and reset sentiment to null before queueing analysis", async () => {
      mockedReviewModel.findById.mockResolvedValue({
        id: "1",
        content: "Old",
        restaurantId: "restaurant-1",
        sentiment: "negative",
      } as any);

      mockedReviewModel.update
        .mockResolvedValueOnce({
          id: "1",
          content: "New",
          restaurantId: "restaurant-1",
        } as any)
        .mockResolvedValueOnce({
          id: "1",
          content: "New",
          restaurantId: "restaurant-1",
          sentiment: "positive",
          confidence: 0.88,
        } as any);

      mockedReviewNlpService.analyze.mockResolvedValue({
        sentiment: "positive",
        confidence: 0.88,
      });

      const result = await ReviewService.update({
        id: "1",
        content: "New",
      });

      expect(mockedReviewModel.update).toHaveBeenCalledWith("1", {
        content: "New",
        sentiment: null,
        confidence: null,
      });
      expect(mockedRestaurantRedisService.applyReviewSentimentChange).toHaveBeenCalledWith(
        "restaurant-1",
        "negative",
        "positive",
      );
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
      mockedReviewModel.findById.mockResolvedValue({
        id: "1",
        restaurantId: "restaurant-1",
        sentiment: "positive",
      } as any);
      mockedReviewModel.delete.mockResolvedValue({ id: "1" } as any);

      const result = await ReviewService.remove({ id: "1" });

      expect(result).toEqual({ id: "1" });
      expect(mockedReviewModel.delete).toHaveBeenCalledWith("1");
      expect(mockedRestaurantRedisService.applyReviewSentimentChange).toHaveBeenCalledWith(
        "restaurant-1",
        "positive",
        null,
      );
    });

    it("should throw if review not found", async () => {
      mockedReviewModel.findById.mockResolvedValue(null);

      await expect(ReviewService.remove({ id: "1" })).rejects.toThrow(
        CustomError,
      );
    });
  });
});
