import { Router } from "express";
import {
  startInterview,
  getNextQuestion,
  submitAnswerAndMoveNext,
  getInterviewHistory,
} from "../controllers/InterviewFlow.controller";
import { protect } from "../middleware/auth.middlewares";
import { aiLimiter } from "../middleware/rateLimit.middleware";


const router = Router();

/**
 * 🚀 Start Interview (Generate Questions + Create DB record)
 */
router.post("/start", protect, aiLimiter, startInterview);

/**
 * 👉 Get Next Question
 */
router.get("/:interviewId/question", protect, getNextQuestion);

/**
 * 👉 Submit Answer
 */
router.post("/answer", protect, aiLimiter, submitAnswerAndMoveNext);

router.get("/history", protect, getInterviewHistory);

export default router;



