import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/sermonNotesController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const noteSchema = z.object({
  title: z.string().min(1),
  speaker: z.string().optional(),
  church: z.string().optional(),
  date: z.string().optional(),
  text: z.string().optional(),
  verses: z.array(z.object({ reference: z.string(), text: z.string() })).optional(),
  takeaways: z.array(z.string()).optional()
});

router.post('/', authMiddleware, validateRequest(noteSchema), createNote);
router.get('/', authMiddleware, getNotes);
router.put('/:id', authMiddleware, validateRequest(noteSchema), updateNote);
router.delete('/:id', authMiddleware, deleteNote);

export default router;