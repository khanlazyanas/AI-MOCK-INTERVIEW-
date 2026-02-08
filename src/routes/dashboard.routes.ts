import { Router } from "express";
import {
  getDashboardStats,
  getPerformanceChart,
  getSkillProgress,
} from "../controllers/dashboard.controllers";
import { protect } from "../middleware/auth.middlewares";

const router = Router();

router.get("/stats", protect, getDashboardStats);
router.get("/performance", protect, getPerformanceChart);
router.get("/skills", protect, getSkillProgress);

export default router;
