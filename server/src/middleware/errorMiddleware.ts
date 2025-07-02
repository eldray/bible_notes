import { Request, Response, NextFunction } from 'express';
import { AuthError, ValidationError } from '../utils/constants';

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AuthError) {
    return res.status(401).json({ error: error.message });
  }
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};