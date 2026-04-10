import { JobsOptions, Queue, Worker } from "bullmq";
import { getRedisConnectionOptions } from "../../utils/redis";
import { ReviewService } from "./review.service";

export type CreateReviewJobData = {
  restaurantId: string;
  content: string;
};

export type UpdateReviewJobData = {
  id: string;
  content?: string;
};

const reviewQueueName = "review-processing";
const redisConnection = getRedisConnectionOptions();

const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: 100,
  removeOnFail: 100,
};

const reviewQueue = new Queue(reviewQueueName, {
  connection: redisConnection,
  defaultJobOptions,
});

let reviewWorker: Worker | null = null;

export const ReviewQueueService = {
  async enqueueCreate(data: CreateReviewJobData) {
    return reviewQueue.add("create-review", data);
  },

  async enqueueUpdate(data: UpdateReviewJobData) {
    return reviewQueue.add("update-review", data);
  },

  async startWorker() {
    if (reviewWorker) {
      return;
    }

    reviewWorker = new Worker(
      reviewQueueName,
      async (job) => {
        if (job.name === "create-review") {
          await ReviewService.create(job.data as CreateReviewJobData);
          return;
        }

        if (job.name === "update-review") {
          await ReviewService.update(job.data as UpdateReviewJobData);
          return;
        }

        throw new Error(`Unsupported review queue job: ${job.name}`);
      },
      {
        connection: redisConnection,
        concurrency: 5,
      },
    );

    reviewWorker.on("failed", (job, error) => {
      console.error(
        `Review queue job failed (${job?.name ?? "unknown"}):`,
        error,
      );
    });
  },
};
