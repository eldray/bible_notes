import express from 'express';
import { createBookmark, getBookmarks, deleteBookmark } from '../controllers/bookmarksController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const bookmarkSchema = z.object({
  verseId: z.string(),
  reference: z.string(),
  text: z.string()
});

router.post('/', authMiddleware, validateRequest(bookmarkSchema), createBookmark);
router.get('/', authMiddleware, getBookmarks);
router.delete('/:id', authMiddleware, deleteBookmark);

export default router;