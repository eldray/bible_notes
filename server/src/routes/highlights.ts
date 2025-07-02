import express from 'express';
import { createHighlight, getHighlights, deleteHighlight } from '../controllers/highlightsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const highlightSchema = z.object({
  verseId: z.string(),
  reference: z.string(),
  text: z.string()
});

router.post('/', authMiddleware, validateRequest(highlightSchema), createHighlight);
router.get('/', authMiddleware, getHighlights);
router.delete('/:id', authMiddleware, deleteHighlight);

export default router;