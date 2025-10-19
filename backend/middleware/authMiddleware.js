import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if JSON web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                // If token is invalid, deny access
                return res.status(401).json({ error: 'Not authorized, token failed' });
            } else {
                // The token is valid, find the user and attach to the request
                const user = await User.findById(decodedToken.id);
                req.user = user; // Make user info available on the request

                console.log(decodedToken);
                
                next();
            }
        });
    } else {
        // If no token is present, deny access
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

export { requireAuth };