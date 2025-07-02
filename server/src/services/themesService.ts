import { supabase } from '../config/supabase';
import { Theme } from '../utils/types';

export const themesService = {
  async getAllThemes(): Promise<Theme[]> {
    const { data, error } = await supabase
      .from('themes')
      .select('id, name, description, verses');
    if (error) throw new Error(error.message);
    return data;
  },

  async getThemeById(id: string): Promise<Theme | null> {
    const { data, error } = await supabase
      .from('themes')
      .select('id, name, description, verses')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};