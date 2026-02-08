import { Response } from "express";
import { uploadResumeService } from "../services/resume.Service";
import { analyzeResume } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middlewares";

/**
 * ✅ Upload Resume
 * (JWT protected)
 */
export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { fileUrl, text } = req.body;

    if (!fileUrl || !text) {
      return res.status(400).json({
        message: "fileUrl and text are required",
      });
    }

    const resume = await uploadResumeService(userId, fileUrl, text);

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Resume upload failed",
    });
  }
};

/**
 * ✅ Analyze Resume
 * (AI only, optional auth)
 */
export const analyzeResumeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        message: "resumeText is required",
      });
    }

    const analysis = await analyzeResume(resumeText);

    res.json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      message: "Resume analysis failed",
    });
  }
};
