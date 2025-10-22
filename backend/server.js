import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { requireAuth } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
const corsOptions = {
  // Replace with your frontend's actual origin.
  // This is crucial for security and for cookies to work.
  origin: "http://localhost:5173", // Example for Vite, use 3000 for Create React App
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Apply requireAuth middleware to protect the dashboard route
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`Server running at PORT ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();
