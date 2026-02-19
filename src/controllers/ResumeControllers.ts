import { Response } from "express";
import { uploadResumeService } from "../services/resume.Service";
import { analyzeResume } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middlewares";

/**
 * ✅ Upload Resume
 */
export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    console.log("User ID:", userId);
    console.log("Uploaded file:", req.file);

    const fileUrl = `/uploads/${req.file.filename}`;

    const resume = await uploadResumeService(userId, fileUrl, "Text extraction pending");

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error: any) {
    console.error("Upload Resume Error:", error.message || error);
    return res.status(500).json({ message: "Resume upload failed" });
  }
};

/**
 * ✅ Analyze Resume
 */
export const analyzeResumeController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "resumeText is required" });
    }

    const analysis = await analyzeResume(resumeText);

    return res.json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error: any) {
    console.error("Analyze Resume Error:", error.message || error);
    return res.status(500).json({ message: "Resume analysis failed" });
  }
};
