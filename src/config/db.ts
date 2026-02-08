import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string;

    await mongoose.connect(mongoUri, {
      dbName: "ai_mock_interview",
    });

    console.log("MongoDB connected → ai_mock_interview");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
