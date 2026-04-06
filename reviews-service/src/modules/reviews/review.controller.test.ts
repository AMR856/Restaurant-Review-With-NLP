import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

jest.mock("./review.service");

const mockedReviewService = ReviewService as jest.Mocked<typeof ReviewService>;

const app = express();
app.use(express.json());

app.get("/reviews", ReviewController.list);
app.post("/reviews", ReviewController.create);
app.get("/reviews/:id", ReviewController.getById);
app.patch("/reviews/:id", ReviewController.update);
app.delete("/reviews/:id", ReviewController.remove);

describe("ReviewController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /reviews", () => {
    it("should list reviews", async () => {
      mockedReviewService.list.mockResolvedValue([{ id: "1", content: "Great" }] as any);

      const res = await request(app).get("/reviews");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([{ id: "1", content: "Great" }]);
    });
  });

  describe("POST /reviews", () => {
    it("should accept review creation and return 202", async () => {
      mockedReviewService.create.mockResolvedValue({
        review: { id: "review-1" },
        analysis: { jobId: "job-1", predictedSentiment: "positive" },
      } as any);

      const res = await request(app).post("/reviews").send({
        restaurantId: "restaurant-1",
        content: "Great food",
      });

      expect(res.status).toBe(202);
      expect(res.body.data.reviewId).toBe("review-1");
      expect(res.body.data.sentiment).toBe("positive");
    });
  });

  describe("GET /reviews/:id", () => {
    it("should return a review", async () => {
      mockedReviewService.getById.mockResolvedValue({ id: "1", content: "Great" } as any);

      const res = await request(app).get("/reviews/1");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("1");
    });
  });

  describe("PATCH /reviews/:id", () => {
    it("should accept review update and return 202", async () => {
      mockedReviewService.update.mockResolvedValue({
        review: { id: "1" },
        analysis: { jobId: "job-1", predictedSentiment: "positive" },
      } as any);

      const res = await request(app).patch("/reviews/1").send({
        content: "Updated content",
      });

      expect(res.status).toBe(202);
      expect(res.body.data.reviewId).toBe("1");
      expect(res.body.data.sentiment).toBe("positive");
    });
  });

  describe("DELETE /reviews/:id", () => {
    it("should remove a review", async () => {
      mockedReviewService.remove.mockResolvedValue({ id: "1", content: "Great" } as any);

      const res = await request(app).delete("/reviews/1");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("1");
    });
  });
});
