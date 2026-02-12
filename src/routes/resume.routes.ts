import { Router } from "express";
import {
  uploadResume,
  analyzeResumeController,
} from "../controllers/ResumeControllers";
import { protect } from "../middleware/auth.middlewares";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/analyze",
  protect,
  analyzeResumeController
);

export default router;
