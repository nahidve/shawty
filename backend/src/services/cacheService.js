import { redis } from "../lib/redis.js";

export async function getCachedUrl(
  shortCode
) {
  console.log(
    "REDIS GET:",
    `url:${shortCode}`
  );

  const cached =
    await redis.get(
      `url:${shortCode}`
    );

  return cached
    ? JSON.parse(cached)
    : null;
}

export async function cacheUrl(
  shortCode,
  data
) {
  console.log(
    "REDIS SET:",
    `url:${shortCode}`
  );

  await redis.set(
    `url:${shortCode}`,
    JSON.stringify(data),
    {
      EX: 3600,
    }
  );
}