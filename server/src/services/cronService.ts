import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { getTrainStatus } from './railService';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const prisma = new PrismaClient();

// Email Transporter (Mock or Real)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Twilio Client (Mock or Real)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const startCronJobs = () => {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running train alert check...');
        try {
            const activeAlerts = await prisma.trainAlert.findMany({
                where: { isActive: true },
                include: { user: true },
            });

            for (const alert of activeAlerts) {
                try {
                    const status = await getTrainStatus(alert.trainNumber, alert.journeyDate);

                    // Logic to check if alert station is reached/crossed
                    // This is simplified. You'd need to compare station indices in the route.
                    const isCrossed = status.currentStationCode === alert.alertStationCode; // Simplified check

                    if (isCrossed) {
                        console.log(`Alert triggered for ${alert.user.email} on train ${alert.trainNumber}`);

                        // Send Email
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: alert.user.email,
                            subject: `Train Alert: ${alert.trainNumber} reached ${alert.alertStationName}`,
                            text: `Your train ${alert.trainNumber} has reached/crossed ${alert.alertStationName}.`,
                        });

                        console.log(`Email sent to ${alert.user.email}`);

                        // Send SMS
                        if (alert.user.phoneNumber) {
                            await twilioClient.messages.create({
                                body: `RailPing Alert: Train ${alert.trainNumber} has reached ${alert.alertStationName}`,
                                from: process.env.TWILIO_PHONE_NUMBER,
                                to: alert.user.phoneNumber,
                            });
                            console.log(`SMS sent to ${alert.user.phoneNumber}`);
                        }

                        // Update Alert
                        await prisma.trainAlert.update({
                            where: { id: alert.id },
                            data: { isActive: false, lastTriggeredAt: new Date() },
                        });
                    }
                } catch (err) {
                    console.error(`Error checking alert ${alert.id}:`, err);
                }
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
};
