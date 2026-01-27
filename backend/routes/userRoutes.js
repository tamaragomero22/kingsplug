import { Router } from "express";
import { submitKYC } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/kyc", requireAuth, submitKYC);

export default router;
