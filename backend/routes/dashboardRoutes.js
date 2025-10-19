import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// --- Caching Implementation ---
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 60000; // Cache for 1 minute (60 * 1000 ms)

// This route is now protected by the requireAuth middleware.
// Any request to this endpoint must have a valid JWT cookie.
router.get('/dashboard-data', requireAuth, async (req, res) => {
    const now = Date.now();
    try {
        // If cache is fresh, use it
        if (cachedData && (now - cacheTimestamp < CACHE_DURATION_MS)) {
            console.log('Serving price from cache.');
        } else {
            console.log('Fetching new price from CoinGecko API.');
            const coingeckoApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ngn';
            const response = await fetch(coingeckoApiUrl);
    
            if (!response.ok) {
                if (!cachedData) {
                    throw new Error(`CoinGecko API error: ${response.statusText}`);
                }
                console.warn(`CoinGecko API error (${response.status}), serving stale data.`);
            } else {
                cachedData = await response.json();
                cacheTimestamp = now;
            }
        }
        // If the middleware passes, the user is authenticated.
        // We can access the user's info via req.user, which was attached by the middleware.
        res.json({
            message: `Welcome ${req.user.email}`,
            priceData: cachedData
        });
    } catch (error) {
        console.error('API proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch price' });
    }
});

export default router;