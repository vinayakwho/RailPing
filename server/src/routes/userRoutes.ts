import express from 'express';
import { updatePhoneNumber } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/phone', authenticateToken, updatePhoneNumber);

export default router;
