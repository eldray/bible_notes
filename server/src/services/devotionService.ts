import { supabase } from '../config/supabase';
import { Devotion } from '../utils/types';

export const devotionService = {
  async getDevotionByDate(date: string): Promise<Devotion | null> {
    const { data, error } = await supabase
      .from('devotions')
      .select('id, date, title, content, verse')
      .eq('date', date)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};