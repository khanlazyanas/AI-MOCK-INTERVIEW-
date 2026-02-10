import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/auth.controllers";
import { protect } from "../middleware/auth.middlewares";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);

export default router;
