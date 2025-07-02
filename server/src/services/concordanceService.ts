import { supabase } from '../config/supabase';

export const concordanceService = {
  async getConcordance(word: string) {
    const { data, error } = await supabase
      .from('concordance')
      .select('word, originalWord, definition, usages, relatedWords')
      .eq('word', word)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};