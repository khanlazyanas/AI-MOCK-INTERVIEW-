import { Router } from "express";
import {
  getNextQuestion,
  submitAnswerAndMoveNext,
} from "../controllers/InterviewFlow.controller";
import { protect } from "../middleware/auth.middlewares";
import { aiLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.get("/:interviewId/question", protect, getNextQuestion);
router.post("/answer", protect,aiLimiter, submitAnswerAndMoveNext);

export default router;
