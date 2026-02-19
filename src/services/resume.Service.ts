import { Resume } from "../models/Resume";
import { analyzeResume } from "./ai.service";

export const uploadResumeService = async (
  userId: string,
  fileUrl: string,
  text: string
) => {
  let feedback: string;
  try {
    // AI call
    feedback = await analyzeResume(text);
  } catch (err) {
    console.error("AI Service Error:", err);
    feedback = "AI analysis failed"; // fallback so backend doesn't crash
  }

  const resume = await Resume.create({
    user: userId,
    fileUrl,
    extractedText: text,
    aiFeedback: feedback,
  });

  return resume;
};
