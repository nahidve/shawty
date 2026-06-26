import { Router } from "express";
import { shortenUrl, redirectUrl } from "../controllers/urlController.js";

const router = Router();

router.post("/api/urls", shortenUrl);
router.get("/:shortCode", redirectUrl);

export default router;