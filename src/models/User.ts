import mongoose, { Document, Schema } from "mongoose";

// ✅ FIX: yahan profilePicture add karna zaroori tha TypeScript ke liye
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  profilePicture?: string; 
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
    },
    // ✅ Schema mein toh tumne bilkul sahi likha tha
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);