import dotenv from "dotenv";
import { Request,Response } from "express";

dotenv.config();


import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import {connectDB} from "./config/db";
import resumeRoutes from "./routes/resume.routes"
import interviewRoutes from "./routes/interview.routes"
import aiRoutes from "./routes/ai.routes"
import dashboardRoutes from "./routes/dashboard.routes"
import { errorHandler } from "./middleware/error.middleware";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume",resumeRoutes)
app.use("/api/interview",interviewRoutes)
app.use('/api/ai',aiRoutes)
app.use('/api/dashboard',dashboardRoutes)



const PORT = process.env.PORT || 5000;

app.get('/',(req:Request,res:Response)=>{
  res.send("Hellow how are you i hope you all are doing good")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler)