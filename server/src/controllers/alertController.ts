import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const getAlerts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const alerts = await prisma.trainAlert.findMany({
            where: { userId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

export const createAlert = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const {
            trainNumber,
            journeyDate,
            alertStationCode,
        } = req.body;

        // Default values for fields not provided by frontend
        const trainName = req.body.trainName || `Train ${trainNumber}`;
        const alertStationName = req.body.alertStationName || alertStationCode;
        const alertType = req.body.alertType || 'station_cross';

        // Optional: Fetch real details from railService if needed
        // const status = await getTrainStatus(trainNumber, journeyDate);

        const alert = await prisma.trainAlert.create({
            data: {
                userId,
                trainNumber,
                trainName,
                journeyDate,
                boardingStationCode: req.body.boardingStationCode || null,
                boardingStationName: req.body.boardingStationName || null,
                destinationStationCode: req.body.destinationStationCode || null,
                destinationStationName: req.body.destinationStationName || null,
                alertStationCode,
                alertStationName,
                alertType,
            },
        });

        res.status(201).json(alert);
    } catch (error) {
        console.error('Create alert error:', error);
        res.status(500).json({ error: 'Failed to create alert' });
    }
};

export const deleteAlert = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const alertId = parseInt(req.params.id);

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const alert = await prisma.trainAlert.findUnique({
            where: { id: alertId },
        });

        if (!alert) return res.status(404).json({ error: 'Alert not found' });
        if (alert.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

        await prisma.trainAlert.delete({
            where: { id: alertId },
        });

        res.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete alert' });
    }
};
