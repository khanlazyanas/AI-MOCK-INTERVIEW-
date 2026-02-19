import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Ye variable store karega ki kaunsa model actually available hai
let activeModelName = "";

/* ===============================
   Auto-Detect Working Model
================================ */
const getWorkingModel = async (): Promise<string> => {
  // Agar model ek baar mil gaya, toh baar baar check nahi karega
  if (activeModelName) return activeModelName;

  try {
    console.log("🔍 Checking available Gemini models for your API key...");
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    const models = response.data.models;
    // Aisa model dhoondo jo text generate kar sake
    const textModel = models.find((m: any) => 
      m.supportedGenerationMethods?.includes("generateContent")
    );

    if (!textModel) {
      throw new Error("No text generation models found for this API key.");
    }

    // Model ka naam "models/gemini-..." format mein aata hai, hume aage ka "models/" hatana hai
    let modelName = textModel.name;
    if (modelName.startsWith("models/")) {
      modelName = modelName.replace("models/", "");
    }
    
    activeModelName = modelName;
    console.log(`✅ SUCCESS! Auto-selected working model: ${activeModelName}`);
    return activeModelName;

  } catch (error: any) {
    console.error("❌ Model auto-detect failed, using fallback.", error.message);
    // Agar fetch fail ho jaye toh default try karega
    return "gemini-1.5-flash"; 
  }
};

/* ===============================
   Core Gemini Caller
================================ */
export const callGemini = async (prompt: string) => {
  try {
    // 1. Pehle confirm karo ki kaunsa model available hai
    const modelName = await getWorkingModel();
    
    // 2. Us model ko initialize karo
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // 3. Prompt bhejo
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty response from Gemini");
    
    return text;
  } catch (error: any) {
    console.error("Gemini SDK error:", error.message || error);
    throw error;
  }
};

/* ===============================
   Clean JSON Helper
================================ */
const cleanJSON = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

/* ===============================
   Generate Questions
================================ */
export const generateQuestions = async (
  role: string,
  resumeText: string
): Promise<string[]> => {
  const prompt = `
    Generate exactly 5 interview questions for a candidate.
    Role: ${role}
    Resume Details: ${resumeText}
    
    Return ONLY a plain JSON array of strings. No extra text, no markdown.
    Example: ["Question 1", "Question 2"]
  `;

  const text = await callGemini(prompt);

  try {
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    console.error("JSON Parsing Error in generateQuestions:", error);
    // Fallback if AI doesn't return proper JSON
    return text.split("\n").filter(line => line.trim().length > 0);
  }
};

/* ===============================
   Evaluate Answer
================================ */
export const evaluateAnswer = async (
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> => {
  const prompt = `
    Evaluate this interview answer.
    Question: ${question}
    Answer: ${answer}
    
    Return ONLY a JSON object with this format, no markdown:
    {
     "score": 8,
     "feedback": "string explaining the rating"
    }
  `;

  const text = await callGemini(prompt);

  try {
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    return {
      score: 5,
      feedback: "Could not parse feedback. Raw output: " + text,
    };
  }
};

/* ===============================
   Analyze Resume
================================ */
export const analyzeResume = async (resumeText: string): Promise<string> => {
  const prompt = `
    Analyze this resume and provide a summary of key skills and strengths.
    Resume: ${resumeText}
  `;
  return await callGemini(prompt);
};