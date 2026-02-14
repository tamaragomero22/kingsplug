import { Router } from "express";
import { submitKYC, saveBankAccount, getBankAccount, resolveBankAccount } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/kyc", requireAuth, submitKYC);
router.get("/bank-account", requireAuth, getBankAccount);
router.post("/bank-account", requireAuth, saveBankAccount);
router.post("/resolve-bank", requireAuth, resolveBankAccount);

export default router;
