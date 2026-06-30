import { Worker } from "bullmq";
import { bullRedis } from "../lib/bullRedis.js";
import { incrementClicks, recordClick } from "../services/urlService.js";

new Worker(
  "click-analytics",

  async (job) => {
    const {
      urlId,
      ipAddress,
      userAgent,
      referrer,
      browser,
      os,
      device,
    } = job.data;

    await Promise.all([
      incrementClicks(urlId),

      recordClick({
        urlId,
        ipAddress,
        userAgent,
        referrer,
        browser,
        os,
        device,
      }),
    ]);

    console.log(
      `Processed click for URL ${urlId}`
    );
  },

  {
    connection:
      bullRedis,
  }
);