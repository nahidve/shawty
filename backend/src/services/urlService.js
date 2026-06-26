import { nanoid } from "nanoid";
import { prisma } from "../lib/prisma.js";

export async function createShortUrl(originalUrl) {
  const shortCode = nanoid(7);

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
    },
  });

  return url;
}

export async function getUrl(shortCode) {
  return prisma.url.findUnique({
    where: {
      shortCode,
    },
  });
}