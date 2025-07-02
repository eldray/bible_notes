import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';
import { ValidationError, AuthError } from '../utils/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new AuthError('Invalid credentials');
    if (!data.user || !data.session) throw new AuthError('Login failed');

    const token = jwt.sign({ userId: data.user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: data.user, token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, churchName, churchBranch, denomination, role, bio } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          church_name: churchName,
          church_branch: churchBranch,
          denomination,
          role,
          bio,
        },
      },
    });
    if (error) throw new ValidationError(error.message);
    if (!data.user || !data.session) throw new ValidationError('Registration failed');

    const token = jwt.sign({ userId: data.user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: data.user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AuthError('Logout failed');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { firstName, lastName, phoneNumber, churchName, churchBranch, denomination, role, bio } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        church_name: churchName,
        church_branch: churchBranch,
        denomination,
        role,
        bio,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new ValidationError('Profile update failed');

    res.json(data);
  } catch (error) {
    next(error);
  }
};
