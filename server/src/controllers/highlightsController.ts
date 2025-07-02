import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ValidationError } from '../utils/constants';

export const createHighlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const highlight = { ...req.body, userId };
    const { data, error } = await supabase.from('highlights').insert(highlight).select().single();
    if (error) throw new ValidationError(error.message);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getHighlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { data, error } = await supabase.from('highlights').select('*').eq('userId', userId);
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteHighlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', id)
      .eq('userId', userId);
    if (error) throw new ValidationError(error.message);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};