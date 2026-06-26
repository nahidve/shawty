import { prisma } from "../lib/prisma.js";
import { encodeBase62 } from "../utils/base62.js";
import { getCachedUrl, cacheUrl } from "./cacheService.js";

export async function createShortUrl(originalUrl) {
  const created = await prisma.url.create({
    data: {
      originalUrl,
    },
  });

  const shortCode = encodeBase62(created.id);

  return prisma.url.update({
    where: {
      id: created.id,
    },
    data: {
      shortCode,
    },
  });
}

export async function getUrl(shortCode) {
  const cached = await getCachedUrl(shortCode);
   console.log("GET URL CALLED");
  console.log("cached value:", cached);
  
  if (cached) {
    console.log("CACHE HIT");
    return cached;
  }
  console.log("CACHE MISS");

  const url = await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });

  if (url) {
    await cacheUrl(shortCode, url);
  }

  return url;
}

export async function incrementClicks(urlId) {
  return prisma.url.update({
    where: {
      id: urlId,
    },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
}

export async function recordClick({
  urlId,
  ipAddress,
  userAgent,
  referrer,
  browser,
  os,
  device,
}) {
  return prisma.click.create({
    data: {
      urlId,
      ipAddress,
      userAgent,
      referrer,
      browser,
      os,
      device,
    },
  });
}

export async function getUrlStats(id) {
  return prisma.url.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      clicks: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getAllUrls() {
  return prisma.url.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}