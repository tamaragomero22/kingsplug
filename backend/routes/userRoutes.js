import { Router } from "express";
import { submitKYC } from "../controllers/userController.js";

const router = Router();

router.post("/kyc", submitKYC);

export default router;
