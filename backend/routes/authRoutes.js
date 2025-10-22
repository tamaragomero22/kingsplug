import { Router } from "express";
import {
  registerGet,
  loginGet,
  registerPost,
  loginPost,
  logoutGet,
  verifyEmail,
} from "../controllers/authController.js";

const router = Router();

router.get("/register", registerGet);
router.post("/register", registerPost);

router.get("/login", loginGet);
router.post("/login", loginPost);

router.post("/verify-email", verifyEmail);

router.get("/logout", logoutGet);

export default router;
