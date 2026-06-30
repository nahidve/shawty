import { Queue } from "bullmq";
import { bullRedis } from "../lib/bullRedis.js";

export const clickQueue =
  new Queue(
    "click-analytics",
    {
      connection:
        bullRedis,
    }
  );