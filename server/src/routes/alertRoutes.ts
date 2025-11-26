import express from 'express';
import { getAlerts, createAlert, deleteAlert } from '../controllers/alertController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

export default router;
