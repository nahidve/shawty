import { UAParser } from "ua-parser-js";
import { clickQueue } from "../queues/clickQueue.js";
import {
  createShortUrl,
  getUrl,
  incrementClicks,
  recordClick,
  getAllUrls,
  getAnalytics,
} from "../services/urlService.js";

import { isValidUrl } from "../utils/urlValidator.js";

export async function shortenUrl(req, res) {
  try {
    const { url, alias } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL required",
      });
    }

    if (
      alias &&
      RESERVED_ALIASES.includes(
        alias.toLowerCase()
      )
    ) {
      return res.status(400).json({
        message:
          "Alias reserved",
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    const result = await createShortUrl(url, alias);
    const code = result.customAlias || result.shortCode;

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${code}`,
      data: result,
    });
  } catch (error) {
  if (
    error.code === "P2002" &&
    error.meta?.target?.includes("customAlias")
  ) {
    return res.status(409).json({
      message: "Alias already exists",
    });
  }

  res.status(500).json({
    message: error.message,
  });
}
}

export async function redirectUrl(req, res) {
  console.log("REDIRECT CONTROLLER HIT");

  try {
    const start = performance.now();
    const { shortCode } = req.params;
    const url = await getUrl(shortCode);
    const end = performance.now();

    console.log(
      "GET URL TIME:",
      (end - start).toFixed(2),
      "ms"
    );

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    const userAgent =
      req.headers["user-agent"];

    const referrer =
      req.headers["referer"] || "direct";

    const parser =
      new UAParser(userAgent);

    const browser =
      parser.getBrowser().name;

    const os =
      parser.getOS().name;

    const device =
      parser.getDevice().type ||
      "desktop";

    res.redirect(url.originalUrl);

clickQueue
  .add(
    "record-click",
    {
      urlId: url.id,
      ipAddress,
      userAgent,
      referrer,
      browser,
      os,
      device,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  )
  .catch(console.error);
  } 
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getUrls(req, res) {
  try {
    const urls = await getAllUrls();

    res.json(urls);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getStats(req, res) {
  try {
    const analytics =
      await getAnalytics(
        Number(req.params.id)
      );

    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}