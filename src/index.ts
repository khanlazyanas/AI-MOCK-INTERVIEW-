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
 * ✅ CORS CONFIG
 */
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
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
