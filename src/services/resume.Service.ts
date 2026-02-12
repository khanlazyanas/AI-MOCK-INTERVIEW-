import { Resume } from "../models/Resume";
import { analyzeResume } from "./ai.service";

export const uploadResumeService = async (
  userId: string,
  fileUrl: string,
  text: string
) => {
  const feedback = await analyzeResume(text);

  const resume = await Resume.create({
    user: userId,
    fileUrl,
    extractedText: text,
    aiFeedback: feedback,
  });

  return resume;
};
