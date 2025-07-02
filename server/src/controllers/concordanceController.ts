import { Request, Response, NextFunction } from 'express';
import { concordanceService } from '../services/concordanceService';
import { ValidationError } from '../utils/constants';

export const getConcordance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { word } = req.params;
    const entry = await concordanceService.getConcordance(word.toLowerCase());
    if (!entry) throw new ValidationError('Word not found in concordance');
    res.json(entry);
  } catch (error) {
    next(error);
  }
};