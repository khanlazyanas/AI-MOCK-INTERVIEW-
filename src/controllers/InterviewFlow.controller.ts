import { Request, Response } from "express";
import { Interview } from "../models/Interview";
import { evaluateAnswer } from "../services/ai.service";

/**
 * 👉 Get Next Question
 */
export const getNextQuestion = async (req: Request, res: Response) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.isCompleted) {
      return res.status(400).json({ message: "Interview already completed" });
    }

    const index = interview.currentQuestionIndex;
    const question = interview.questions[index];

    res.json({
      question,
      index,
      total: interview.questions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching question" });
  }
};

/**
 * 👉 Submit Answer + Move Next
 */
export const submitAnswerAndMoveNext = async (
  req: Request,
  res: Response
) => {
  try {
    const { interviewId, answer } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const index = interview.currentQuestionIndex;
    const question = interview.questions[index];

    // ✅ AI evaluation (NEW)
    const aiResult = await evaluateAnswer(question, answer);

    interview.answers.push({
      question,
      answer,
      feedback: aiResult.feedback,
      score: aiResult.score,
    });

    interview.currentQuestionIndex += 1;

    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.isCompleted = true;

      const totalScore = interview.answers.reduce(
        (sum, a) => sum + a.score,
        0
      );

      interview.overallScore = Math.round(
        totalScore / interview.answers.length
      );
    }

    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: "Error submitting answer" });
  }
};
