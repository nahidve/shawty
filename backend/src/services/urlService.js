import { prisma } from "../lib/prisma.js";
import { encodeBase62 } from "../utils/base62.js";

export async function createShortUrl(originalUrl) {
  const created = await prisma.url.create({ data: { originalUrl } });
  const shortCode = encodeBase62(created.id);

  const updated = await prisma.url.update({
    where: { id: created.id },
    data: { shortCode },
  });
  return updated;
}

export async function incrementClicks(shortCode) {
  return prisma.url.update({
    where: { shortCode },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
}

export async function getUrl(shortCode) {
  return prisma.url.findUnique({
    where: {
      shortCode,
    },
  });
}