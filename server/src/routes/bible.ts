import express from 'express';
import { getVerse, getChapter, searchBible, getRandomVerse } from '../controllers/bibleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const verseSchema = z.object({
  reference: z.string(),
  version: z.string().optional().default('kjv')
});

const chapterSchema = z.object({
  book: z.string(),
  chapter: z.number(),
  version: z.string().optional().default('kjv')
});

const searchSchema = z.object({
  query: z.string(),
  version: z.string().optional().default('kjv'),
  limit: z.number().optional().default(20)
});

router.get('/verse/:reference', authMiddleware, validateRequest(verseSchema), getVerse);
router.get('/chapter/:book/:chapter', authMiddleware, validateRequest(chapterSchema), getChapter);
router.get('/search', authMiddleware, validateRequest(searchSchema), searchBible);
router.get('/random', authMiddleware, getRandomVerse);

export default router;