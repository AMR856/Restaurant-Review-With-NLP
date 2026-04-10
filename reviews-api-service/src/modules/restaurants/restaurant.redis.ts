import { ReviewSentiment } from "../reviews/review.nlp";
import { getRedisClient } from "../../utils/redis";

type RestaurantSentimentStats = {
  positiveReviews: number;
  negativeReviews: number;
};

const restaurantStatsKey = (restaurantId: string) =>
  `restaurant:sentiment:${restaurantId}`;

const restaurantRankingKey = "restaurants:ranking:positive-reviews";

const sentimentToField = (sentiment: ReviewSentiment) =>
  sentiment === "positive" ? "positiveReviews" : "negativeReviews";

export const RestaurantRedisService = {
  async applyReviewSentimentChange(
    restaurantId: string,
    previousSentiment: ReviewSentiment | null,
    nextSentiment: ReviewSentiment | null,
  ): Promise<RestaurantSentimentStats> {
    const redis = await getRedisClient();
    const key = restaurantStatsKey(restaurantId);

    if (previousSentiment) {
      await redis.hIncrBy(key, sentimentToField(previousSentiment), -1);
    }

    if (nextSentiment) {
      await redis.hIncrBy(key, sentimentToField(nextSentiment), 1);
    }

    const positiveReviews = Number(
      (await redis.hGet(key, "positiveReviews")) ?? 0,
    );
    const negativeReviews = Number(
      (await redis.hGet(key, "negativeReviews")) ?? 0,
    );

    await redis.zAdd(restaurantRankingKey, [
      {
        score: positiveReviews,
        value: restaurantId,
      },
    ]);

    return {
      positiveReviews,
      negativeReviews,
    };
  },
};
