import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { redis } from "../lib/redis.js";

const store = new RedisStore({
  sendCommand: (...args) =>
    redis.sendCommand(args),
});

export const createUrlLimiter =
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    store,

    message: {
      message:
        "Too many URLs created.",
    },
  });

export const statsLimiter =
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,

    standardHeaders: true,
    legacyHeaders: false,

    store,

    message: {
      message:
        "Too many stats requests.",
    },
  });
