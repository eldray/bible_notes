import express from 'express';
import { getTodayDevotion, getDevotionByDate } from '../controllers/devotionsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const dateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
});

router.get('/today', authMiddleware, getTodayDevotion);
router.get('/:date', authMiddleware, validateRequest(dateSchema), getDevotionByDate);

export default router;