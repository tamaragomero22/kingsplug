import jwt from "jsonwebtoken";
import User from "../models/User.js";

const requireAuth = (req, res, next) => {
  let token = req.cookies.jwt;

  // If no cookie, check Authorization header (for mobile/API clients)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("requireAuth middleware. Token found:", !!token);

  // Check if JSON web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // If token is invalid, deny access
        return res.status(401).json({ error: "Not authorized, token failed" });
      } else {
        try {
          // The token is valid, find the user and attach to the request
          const user = await User.findById(decodedToken.id);
          if (!user) {
            console.warn(`Auth failed: User ${decodedToken.id} not found.`);
            return res
              .status(401)
              .json({ error: "Not authorized, user not found" });
          }
          req.user = user; // Make user info available on the request
          next();
        } catch (dbErr) {
          console.error("Database error in requireAuth:", dbErr);
          return res.status(500).json({ error: "Internal server error during authentication" });
        }
      }
    });
  } else {
    // If no token is present, deny access
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

export { requireAuth };
