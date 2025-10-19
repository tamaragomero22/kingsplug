import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// This route is now protected by the requireAuth middleware.
// Any request to this endpoint must have a valid JWT cookie.
router.get('/dashboard-data', requireAuth, (req, res) => {
    // If the middleware passes, the user is authenticated.
    // We can access the user's info via req.user, which was attached by the middleware.
    res.json({
        message: `Welcome to your dashboard, ${req.user.email}!`,
    });
});

export default router;