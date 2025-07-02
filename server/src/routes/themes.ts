import express from 'express';
import { getThemes, getThemeById } from '../controllers/themesController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getThemes);
router.get('/:id', authMiddleware, getThemeById);

export default router;