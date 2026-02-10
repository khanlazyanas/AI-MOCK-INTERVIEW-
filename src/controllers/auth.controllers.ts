import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

// ================= LOGOUT =================
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= GET PROFILE =================
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, role },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error });
  }
};
