import type { Router as ExpressRouter } from "express";
import { Router } from "express";

import { handleHealth } from "./health.js";
import v1Router from "./v1/index.js";

const router: ExpressRouter = Router();

// Health check
router.get("/health", handleHealth);

// REST API v1
router.use("/api/v1", v1Router);

export default router;
