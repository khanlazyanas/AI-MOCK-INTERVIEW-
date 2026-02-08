import mongoose, { Document, Schema } from "mongoose";

/* =============================
   Answer Sub Document Type
============================= */

export interface AnswerType {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

/* =============================
   Interview Document Type
============================= */

export interface IInterview extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  questions: string[];
  answers: AnswerType[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  overallScore: number;
  createdAt: Date;
  updatedAt: Date;
}

/* =============================
   Answer Schema
============================= */

const answerSchema = new Schema<AnswerType>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      default: "",
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

/* =============================
   Interview Schema
============================= */

const interviewSchema = new Schema<IInterview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    questions: {
      type: [String],
      default: [],
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    overallScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* =============================
   Model Export
============================= */

export const Interview = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);
