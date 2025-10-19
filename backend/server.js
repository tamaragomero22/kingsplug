import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes); // API Routes

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');

        app.listen(port, () => {
            console.log(`Server running at PORT ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

startServer();