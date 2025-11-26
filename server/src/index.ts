import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/authRoutes';
import alertRoutes from './routes/alertRoutes';
import userRoutes from './routes/userRoutes';

app.use(cors({
    origin: '*', // Allow all origins for now to fix the issue
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/alerts', alertRoutes);
app.use('/user', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

import { startCronJobs } from './services/cronService';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startCronJobs();
});
