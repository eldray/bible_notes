import express from 'express';
import { getConcordance } from '../controllers/concordanceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const concordanceSchema = z.object({
  word: z.string()
});

router.get('/:word', authMiddleware, validateRequest(concordanceSchema), getConcordance);

export default router;