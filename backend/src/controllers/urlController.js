import { createShortUrl, getUrl } from "../services/urlService.js";
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
    await incrementClicks(shortCode);
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}