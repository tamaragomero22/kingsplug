import { Router } from "express";
import {
  registerGet,
  loginGet,
  registerPost,
  loginPost,
  verifyEmail,
  sendVerifyOtp,
  changePassword,
  logoutGet,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/register", registerGet);
router.post("/register", registerPost);

router.get("/login", loginGet);
router.post("/login", loginPost);

router.post("/verify-email", verifyEmail);
router.post("/send-verify-otp", sendVerifyOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", requireAuth, changePassword);

router.get("/logout", logoutGet);

export default router;
