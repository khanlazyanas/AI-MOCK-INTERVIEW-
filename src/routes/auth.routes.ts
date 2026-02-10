import { Router } from "express";
import {
  login,
  logout,
  register,
  getProfile,
  updateProfile,
} from "../controllers/auth.controllers";
import  { protect } from "../middleware/auth.middlewares";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// 🔐 PROFILE ROUTES
router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);

export default router;
