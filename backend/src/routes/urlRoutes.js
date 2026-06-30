import { Router } from "express";
import { shortenUrl, redirectUrl, getUrls, getStats } from "../controllers/urlController.js";
import { createUrlLimiter, statsLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/api/urls", createUrlLimiter, shortenUrl);
router.get("/:shortCode", redirectUrl);
router.get("/api/urls", getUrls);
router.get("/api/urls/:id/stats", statsLimiter, getStats);

export default router;