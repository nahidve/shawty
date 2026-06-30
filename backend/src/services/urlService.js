import { prisma } from "../lib/prisma.js";
import { encodeBase62 } from "../utils/base62.js";
import { getCachedUrl, cacheUrl } from "./cacheService.js";

export async function createShortUrl(
  originalUrl,
  customAlias
) {
  const created =
    await prisma.url.create({
      data: {
        originalUrl,
        customAlias,
      },
    });

  if (customAlias) {
    return created;
  }

  const shortCode =
    encodeBase62(created.id);

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

  const url =
  await prisma.url.findFirst({
    where: {
      OR: [
        {
          shortCode,
        },
        {
          customAlias:
            shortCode,
        },
      ],
    },
  });
  console.log("DB RESULT:", url);

  if (url) {
  await cacheUrl(shortCode, url);

  const verify =
    await getCachedUrl(shortCode);

  console.log(
    "VERIFY CACHE:",
    verify
  );
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

export async function getAllUrls() {
  return prisma.url.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAnalytics(urlId) {
  const startOfDay = new Date();

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const [
    totalClicks,
    todayClicks,
    browserStats,
    deviceStats,
    referrerStats,
  ] = await Promise.all([
    prisma.click.count({
      where: {
        urlId,
      },
    }),

    prisma.click.count({
      where: {
        urlId,
        createdAt: {
          gte: startOfDay,
        },
      },
    }),

    prisma.click.groupBy({
      by: ["browser"],
      where: {
        urlId,
      },
      _count: {
        browser: true,
      },
      orderBy: {
        _count: {
          browser: "desc",
        },
      },
    }),

    prisma.click.groupBy({
      by: ["device"],
      where: {
        urlId,
      },
      _count: {
        device: true,
      },
      orderBy: {
        _count: {
          device: "desc",
        },
      },
    }),

    prisma.click.groupBy({
      by: ["referrer"],
      where: {
        urlId,
      },
      _count: {
        referrer: true,
      },
      orderBy: {
        _count: {
          referrer: "desc",
        },
      },
    }),
  ]);

  return {
    totalClicks,
    todayClicks,
    browserStats,
    deviceStats,
    referrerStats,
  };
}