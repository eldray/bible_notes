import { Request, Response, NextFunction } from 'express';
import { devotionService } from '../services/devotionService';
import { ValidationError } from '../utils/constants';

export const getTodayDevotion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const devotion = await devotionService.getDevotionByDate(today);
    if (!devotion) throw new ValidationError('No devotion available for today');
    res.json(devotion);
  } catch (error) {
    next(error);
  }
};

export const getDevotionByDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.params;
    const devotion = await devotionService.getDevotionByDate(date);
    if (!devotion) throw new ValidationError('No devotion available for this date');
    res.json(devotion);
  } catch (error) {
    next(error);
  }
};