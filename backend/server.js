import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { requireAuth } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bitcoinRoutes from "./routes/bitcoinRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow any localhost origin
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      return callback(null, true);
    }

    // Allow your production domains
    if (origin === 'https://kingsplug.com' ||
      origin === 'https://www.kingsplug.com' ||
      origin === 'http://kingsplug.com' ||
      origin === 'http://www.kingsplug.com') {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  next();
});

// Apply requireAuth middleware to protect the dashboard route
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/bitcoin", bitcoinRoutes);

// Start the server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();
