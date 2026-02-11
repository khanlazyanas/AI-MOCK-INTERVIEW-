import { Response } from "express";
import {
  getDashboardStatsService,
  getPerformanceChartService,
  getSkillProgressService,
} from "../services/dashboard.service";
import { AuthRequest } from "../middleware/auth.middlewares";

// ================= STATS =================
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const stats = await getDashboardStatsService(userId);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

// ================= PERFORMANCE =================
export const getPerformanceChart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chart = await getPerformanceChartService(userId);

    res.json(chart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Performance chart error" });
  }
};

// ================= SKILLS =================
export const getSkillProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const progress = await getSkillProgressService(userId);

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Skill progress error" });
  }
};
