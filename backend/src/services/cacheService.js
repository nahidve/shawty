import { redis } from "../lib/redis.js";

export async function getCachedUrl(shortCode) {
  const cached = await redis.get(
    `url:${shortCode}`
  );

  return cached
    ? JSON.parse(cached)
    : null;
}

export async function cacheUrl(shortCode, data) {
  await redis.set(
    `url:${shortCode}`,
    JSON.stringify(data),
    {
      EX: 3600,
    }
  );
}