import { Router } from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = Router();

router.get("/data", getDashboardData);

export default router;
