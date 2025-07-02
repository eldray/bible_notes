import bibleApi, { BIBLE_VERSION_MAP } from '../config/bibleApi';
import { supabase } from '../config/supabase';
import { Verse, Chapter } from '../utils/types';

export const bibleService = {
  async getVerseByReference(reference: string, version: string): Promise<any> {
    const bibleId = BIBLE_VERSION_MAP[version.toLowerCase()];
    if (!bibleId) throw new Error('Invalid Bible version');

    // Check cache in Supabase
    const { data: cachedVerse } = await supabase
      .from('verses')
      .select('*')
      .eq('reference', reference)
      .eq('version', version)
      .single();

    if (cachedVerse) return cachedVerse;

    // Fetch from API.Bible
    const { data } = await bibleApi.get(`/bibles/${bibleId}/verses/${reference}`);
    const verse: Verse = {
      verseId: data.data.id,
      reference: data.data.reference,
      text: data.data.content,
      version: version.toUpperCase()
    };

    // Cache in Supabase
    await supabase.from('verses').insert(verse);
    return verse;
  },

  async getChapter(book: string, chapter: number, version: string): Promise<Chapter> {
    const bibleId = BIBLE_VERSION_MAP[version.toLowerCase()];
    if (!bibleId) throw new Error('Invalid Bible version');

    const chapterId = `${book}.${chapter}`; // e.g., "JOHN.3"
    const { data } = await bibleApi.get(`/bibles/${bibleId}/chapters/${chapterId}`);
    const verses: Verse[] = data.data.verses.map((v: any) => ({
      verseId: v.id,
      reference: v.reference,
      text: v.content,
      version: version.toUpperCase()
    }));

    return {
      chapterId: data.data.id,
      reference: data.data.reference,
      verses,
      version: version.toUpperCase()
    };
  },

  async searchBible(query: string, version: string, limit: number) {
    const bibleId = BIBLE_VERSION_MAP[version.toLowerCase()];
    if (!bibleId) throw new Error('Invalid Bible version');

    const { data } = await bibleApi.get(`/bibles/${bibleId}/search`, {
      params: { query, limit }
    });

    return {
      query,
      version: version.toUpperCase(),
      resultCount: data.data.total,
      results: data.data.verses.map((v: any) => ({
        reference: v.reference,
        text: v.content
      }))
    };
  },

  async getRandomVerse(version: string) {
    // API.Bible doesn't have a random verse endpoint, so select from popular verses
    const popularVerses = [
      { reference: 'JOHN.3.16', text: 'For God so loved the world...' },
      { reference: 'JER.29.11', text: 'For I know the plans...' }
    ];
    const randomIndex = Math.floor(Math.random() * popularVerses.length);
    const { reference } = popularVerses[randomIndex];
    return this.getVerseByReference(reference, version);
  }
};