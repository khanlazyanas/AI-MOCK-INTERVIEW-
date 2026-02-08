import { Interview } from "../models/Interview";
import mongoose from "mongoose";

export const getDashboardStatsService = async (userId: string) => {
  const interviews = await Interview.find({
    user: new mongoose.Types.ObjectId(userId),
  });

  const totalInterviews = interviews.length;

  // ✅ Average Score
  const avgScore =
    interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) /
    (totalInterviews || 1);

  // ✅ Pending Reviews
  const pendingReviews = interviews.filter(
    (i) => !i.isCompleted
  ).length;

  // ✅ Weak Areas (simple logic)
  const weakAreas: string[] = [];

  interviews.forEach((interview) => {
    interview.answers.forEach((ans) => {
      if (ans.score < 60) {
        weakAreas.push(interview.role);
      }
    });
  });

  return {
    totalInterviews,
    avgScore: Math.round(avgScore),
    pendingReviews,
    weakAreas: [...new Set(weakAreas)],
  };
};

// 📊 Performance Chart
export const getPerformanceChartService = async (userId: string) => {
  const interviews = await Interview.find({
    user: new mongoose.Types.ObjectId(userId),
    isCompleted: true,
  }).sort({ createdAt: 1 });

  return interviews.map((i, index) => ({
    attempt: index + 1,
    score: i.overallScore || 0,
  }));
};

// 📈 Skill Progress (Dummy Logic — AI se later improve kar sakte)
export const getSkillProgressService = async (userId: string) => {
  const interviews = await Interview.find({
    user: new mongoose.Types.ObjectId(userId),
    isCompleted: true,
  });

  const progress = {
    Frontend: 0,
    Backend: 0,
    DSA: 0,
    "System Design": 0,
  };

  interviews.forEach((i) => {
    if (progress[i.role as keyof typeof progress] !== undefined) {
      progress[i.role as keyof typeof progress] = i.overallScore;
    }
  });

  return progress;
};
