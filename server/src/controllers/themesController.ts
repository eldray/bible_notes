import { Request, Response, NextFunction } from 'express';
import { themesService } from '../services/themesService';
import { ValidationError } from '../utils/constants';

export const getThemes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const themes = await themesService.getAllThemes();
    res.json(themes);
  } catch (error) {
    next(error);
  }
};

export const getThemeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const theme = await themesService.getThemeById(id);
    if (!theme) throw new ValidationError('Theme not found');
    res.json(theme);
  } catch (error) {
    next(error);
  }
};