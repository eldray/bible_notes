import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ValidationError } from '../utils/constants';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const post = { ...req.body, userId, timestamp: new Date().toISOString() };
    const { data, error } = await supabase.from('community_posts').insert(post).select().single();
    if (error) throw new ValidationError(error.message);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter = 'all' } = req.query;
    let query = supabase.from('community_posts').select('*, comments(*)').order('timestamp', { ascending: false });
    if (filter === 'scripture') query = query.not('scripture', 'is', null);
    if (filter === 'saved') query = query.eq('saved', true);
    const { data, error } = await query;
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id: postId } = req.params;
    const comment = { postId, userId, content: req.body.content, timestamp: new Date().toISOString() };
    const { data, error } = await supabase.from('comments').insert(comment).select().single();
    if (error) throw new ValidationError(error.message);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id: postId } = req.params;
    const { data: post } = await supabase.from('community_posts').select('likes').eq('id', postId).single();
    const likes = post?.likes || 0;
    const updatedLikes = likes.includes(userId) ? likes - 1 : likes + 1;
    const { data, error } = await supabase
      .from('community_posts')
      .update({ likes: updatedLikes })
      .eq('id', postId)
      .select()
      .single();
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const toggleSave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { id: postId } = req.params;
    const { data: post } = await supabase.from('community_posts').select('saved').eq('id', postId).single();
    const { data, error } = await supabase
      .from('community_posts')
      .update({ saved: !post?.saved })
      .eq('id', postId)
      .select()
      .single();
    if (error) throw new ValidationError(error.message);
    res.json(data);
  } catch (error) {
    next(error);
  }
};