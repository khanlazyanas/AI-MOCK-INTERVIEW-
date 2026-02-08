import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getPerformanceChartService,
  getSkillProgressService,
} from "../services/dashboard.service";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const stats = await getDashboardStatsService(userId);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

export const getPerformanceChart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const chart = await getPerformanceChartService(userId);

    res.json(chart);
  } catch (error) {
    res.status(500).json({ message: "Performance chart error" });
  }
};

export const getSkillProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const progress = await getSkillProgressService(userId);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Skill progress error" });
  }
};
