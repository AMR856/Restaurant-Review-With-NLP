import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const getRedisConnectionOptions = () => {
  const parsed = new URL(redisUrl);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db:
      parsed.pathname && parsed.pathname.length > 1
        ? Number(parsed.pathname.slice(1))
        : undefined,
  };
};

let redisClient: ReturnType<typeof createClient> | null = null;
let connectPromise: Promise<ReturnType<typeof createClient>> | null = null;

export const getRedisClient = async () => {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisClient) {
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (error) => {
      console.error("Redis client error:", error);
    });
  }

  if (!redisClient.isOpen) {
    connectPromise ??= redisClient.connect();
    await connectPromise;
    connectPromise = null;
  }

  return redisClient;
};
