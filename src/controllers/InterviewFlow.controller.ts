import { Request, Response } from "express";
import { Interview } from "../models/Interview";
import { generateQuestions, evaluateAnswer } from "../services/ai.service";

/* =================================
   Start Interview
================================= */
export const startInterview = async (req: any, res: Response) => {
  try {
    const { role, resumeText } = req.body;

    // ✅ THE FIX: Safely extract user ID from multiple possible locations
    // JWT middleware alag-alag naam se data save karta hai, humne sab handle kar liya.
    const userId = req.user?.id || req.user?._id || req.userId || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User ID missing! Please ensure your Auth Middleware is passing the user info to req.user.",
      });
    }

    if (!role || !resumeText) {
      return res.status(400).json({
        message: "Role and resumeText are required",
      });
    }

    const questions = await generateQuestions(role, resumeText);

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "Failed to generate questions",
      });
    }

    // Ab naya interview successfully save hoga kyunki userId 100% defined hai
    const interview = await Interview.create({
      user: userId, 
      role,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      overallScore: 0,
    });

    return res.status(201).json({
      interviewId: interview._id,
    });
  } catch (error) {
    console.error("Start Interview Error:", error);
    return res.status(500).json({
      message: "Failed to start interview",
    });
  }
};

/* =================================
   Get Next Question
================================= */
export const getNextQuestion = async (req: Request, res: Response) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (!interview.questions.length) {
      return res.status(400).json({
        message: "No questions available",
      });
    }

    if (interview.isCompleted) {
      return res.status(400).json({
        message: "Interview completed",
      });
    }

    const index = interview.currentQuestionIndex;
    const question = interview.questions[index];

    return res.json({
      question,
      index,
      total: interview.questions.length,
    });
  } catch (error) {
    console.error("Get Question Error:", error);
    return res.status(500).json({
      message: "Error fetching question",
    });
  }
};

/* =================================
   Submit Answer
================================= */
export const submitAnswerAndMoveNext = async (
  req: Request,
  res: Response
) => {
  try {
    const { interviewId, answer } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const index = interview.currentQuestionIndex;
    const question = interview.questions[index];

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

    return res.json({
      message: "Answer submitted",
      isCompleted: interview.isCompleted,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({
      message: "Error submitting answer",
    });
  }
};

/* =================================
   Get Interview History
================================= */
export const getInterviewHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id || req.userId || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // User ke saare interviews find karo, naye wale sabse upar (createdAt: -1)
    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });

    return res.json({ interviews });
  } catch (error) {
    console.error("Get History Error:", error);
    return res.status(500).json({ message: "Failed to fetch interview history" });
  }
};

export const getInterviewDetails = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    
    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};