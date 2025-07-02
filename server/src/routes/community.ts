import express from 'express';
import { createPost, getPosts, createComment, toggleLike, toggleSave } from '../controllers/communityController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const postSchema = z.object({
  content: z.string().min(1),
  scripture: z.string().optional()
});

const commentSchema = z.object({
  content: z.string().min(1)
});

router.post('/posts', authMiddleware, validateRequest(postSchema), createPost);
router.get('/posts', authMiddleware, getPosts);
router.post('/posts/:id/comments', authMiddleware, validateRequest(commentSchema), createComment);
router.put('/posts/:id/like', authMiddleware, toggleLike);
router.put('/posts/:id/save', authMiddleware, toggleSave);

export default router;