import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ValidationError } from '../utils/constants';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const note = { ...req.body, userId };
    const { data, error } = await supabase.from('sermon_notes').insert(note).select().single();
    if (error) throw new ValidationError(error.message);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { data, error } = await supabase.from('sermon_notes').select('*').eq('userId', userId);
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { data, error } = await supabase
      .from('sermon_notes')
      .update(req.body)
      .eq('id', id)
      .eq('userId', userId)
      .select()
      .single();
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { error } = await supabase
      .from('sermon_notes')
      .delete()
      .eq('id', id)
      .eq('userId', userId);
    if (error) throw new ValidationError(error.message);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};