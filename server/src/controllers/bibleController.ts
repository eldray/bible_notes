import { Request, Response, NextFunction } from 'express';
import { bibleService } from '../services/bibleService';
import { ValidationError } from '../utils/constants';

export const getVerse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.params;
    const { version = 'kjv' } = req.query;
    const verse = await bibleService.getVerseByReference(reference, version as string);
    if (!verse) throw new ValidationError('Verse not found');
    res.json(verse);
  } catch (error) {
    next(error);
  }
};

export const getChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book, chapter } = req.params;
    const { version = 'kjv' } = req.query;
    const chapterData = await bibleService.getChapter(book, parseInt(chapter), version as string);
    if (!chapterData) throw new ValidationError('Chapter not found');
    res.json(chapterData);
  } catch (error) {
    next(error);
  }
};

export const searchBible = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, version = 'kjv', limit = 20 } = req.query;
    const results = await bibleService.searchBible(query as string, version as string, parseInt(limit as string));
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const getRandomVerse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { version = 'kjv' } = req.query;
    const verse = await bibleService.getRandomVerse(version as string);
    res.json(verse);
  } catch (error) {
    next(error);
  }
};