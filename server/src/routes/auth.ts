import express from 'express';
import { login, register, logout, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = express.Router();

const denominations = ['Baptist', 'Catholic', 'Pentecostal', 'Methodist', 'Presbyterian', 'Lutheran', 'Anglican', 'Non-Denominational', 'Other'] as const;
const roles = ['Pastor', 'Elder', 'Deacon', 'Member', 'Youth Leader', 'Worship Leader', 'Teacher', 'Other'] as const;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6),
  churchName: z.string().min(1),
  churchBranch: z.string().optional(),
  denomination: z.enum(denominations),
  role: z.enum(roles),
  bio: z.string().optional()
});

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  churchName: z.string().optional(),
  churchBranch: z.string().optional(),
  denomination: z.enum(denominations).optional(),
  role: z.enum(roles).optional(),
  bio: z.string().optional()
});

router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);
router.post('/logout', authMiddleware, logout);
router.patch('/profile', authMiddleware, validateRequest(updateProfileSchema), updateProfile);

export default router;
