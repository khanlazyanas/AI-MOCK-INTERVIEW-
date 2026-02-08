import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Mongoose schema
const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,   // Mongoose type
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Model
export const User = mongoose.model<IUser>("User", userSchema);
