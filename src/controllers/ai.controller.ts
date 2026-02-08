import { Request, Response } from "express";
import {evaluateAnswer, generateQuestions,  } from "../services/ai.service";
import { Interview } from "../models/Interview";

export const startAIInterview = async (req: Request, res: Response) => {
  const { role, resumeText, userId } = req.body;

  const questions = await generateQuestions(role, resumeText);

  const interview = await Interview.create({
    user: userId,
    role,
    questions,
  });

  res.json(interview);
};

export const submitAIAnswer = async (req: Request, res: Response) => {
  const { interviewId, question, answer } = req.body;

  const feedback = await evaluateAnswer(question, answer);

  const updated = await Interview.findByIdAndUpdate(
    interviewId,
    { $push: { answers: answer }, feedback },
    { new: true }
  );

  res.json(updated);
};
