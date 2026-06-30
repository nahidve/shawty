import "dotenv/config";
import IORedis from "ioredis";

export const bullRedis =
  new IORedis(
    process.env.REDIS_URL,
    {
      maxRetriesPerRequest: null,
    }
    
  );
  console.log(
  "Bull Redis URL:",
  process.env.REDIS_URL
);