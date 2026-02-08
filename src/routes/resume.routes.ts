import { Router } from "express";
import { analyzeResumeController, uploadResume } from "../controllers/ResumeControllers";
import { protect } from "../middleware/auth.middlewares";

const router = Router();

router.post("/upload", protect, uploadResume);
router.post("/analyze", protect, analyzeResumeController);

export default router;
