import { UAParser } from "ua-parser-js";
import { createShortUrl, getUrl, incrementClicks, recordClick, getUrlStats, getAllUrls } from "../services/urlService.js";
import { isValidUrl } from "../utils/urlValidator.js";

export async function shortenUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL required",
      });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({
            message: "Invalid URL",
        });
    }

    const result = await createShortUrl(url);

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${result.shortCode}`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function redirectUrl(req, res) {
  try {
    const { shortCode } = req.params;
    const url = await getUrl(shortCode);

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || "direct";
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name;
    const os = parser.getOS().name;
    const device = parser.getDevice().type || "desktop";

    await Promise.all([
      incrementClicks(url.id),

      recordClick({
        urlId: url.id,
        ipAddress,
        userAgent,
        referrer,
        browser,
        os,
        device,
      }),
    ]);

    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getUrls(req, res) {
  const urls = await getAllUrls();
  res.json(urls);
}

export async function getStats(req, res) {
  const stats = await getUrlStats(req.params.id);
  res.json(stats);
}