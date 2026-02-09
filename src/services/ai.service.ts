import { OpenAI } from "openai";


if (!process.env.OPENAI_KEY) {
  throw new Error("OPENAI_KEY missing in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

/**
 * ✅ Generate Interview Questions
 */
export const generateQuestions = async (
  role: string,
  resumeText: string
): Promise<string[]> => {
  const prompt = `
You are an interview coach.
Generate exactly 5 interview questions for a ${role} candidate
based on this resume:

${resumeText}

Return only questions separated by new lines.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content;

  if (!content) return [];

  return content
    .split("\n")
    .map((q) => q.trim())
    .filter(Boolean);
};

/**
 * ✅ Evaluate Answer (Structured AI Response)
 */
export const evaluateAnswer = async (
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> => {
  const prompt = `
Evaluate this interview answer.

Question: ${question}
Answer: ${answer}

Return JSON only in this format:
{
  "score": number,
  "feedback": string
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    return { score: 0, feedback: "No feedback generated" };
  }

  try {
    return JSON.parse(content);
  } catch {
    return {
      score: 0,
      feedback: "AI response parsing failed",
    };
  }
};

/**
 * ✅ Analyze Resume (currently dummy, scalable later)
 */
export const analyzeResume = async (
  resumeText: string
): Promise<string> => {
  // Later OpenAI integration
  return "Resume looks good. Improve technical keywords and projects section.";
};
