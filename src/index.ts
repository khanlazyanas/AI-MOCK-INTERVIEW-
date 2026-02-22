import dotenv from "dotenv";

// 🔥 MUST BE FIRST
dotenv.config({ path: ".env" });

import express, { Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import interviewRoutes from "./routes/interview.routes";
import aiRoutes from "./routes/ai.routes";
import dashboardRoutes from "./routes/dashboard.routes";

import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/error.middleware";

// DB connect
connectDB();

const app = express();

/**
 * ✅ BULLETPROOF CORS CONFIG
 * Ab ye Localhost aur Vercel dono par makhan chalega!
 */
const allowedOrigins = [
  "http://localhost:5173", // Local development ke liye
  "https://ai-mock-interview-lac-two.vercel.app", // Tumhara live Vercel URL
  process.env.FRONTEND_URL // Fallback agar .env se aa raha ho
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("AI Mock Interview Backend Running 🚀");
});

// ❗ ALWAYS LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});