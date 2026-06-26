import { Router } from "express";
import { shortenUrl, redirectUrl, getUrls, getStats } from "../controllers/urlController.js";

const router = Router();

router.post("/api/urls", shortenUrl);
router.get("/:shortCode", redirectUrl);
router.get("/api/urls", getUrls);
router.get("/api/urls/:id/stats", getStats);

export default router;