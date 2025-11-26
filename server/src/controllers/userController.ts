import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const updatePhoneNumber = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { phoneNumber } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        if (!phoneNumber) return res.status(400).json({ error: 'Phone number is required' });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { phoneNumber },
        });

        res.json({ message: 'Phone number updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update phone error:', error);
        res.status(500).json({ error: 'Failed to update phone number' });
    }
};
