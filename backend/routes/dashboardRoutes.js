import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = Router();

router.get('/dashboard-data', getDashboardData);

export default router;