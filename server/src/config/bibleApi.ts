import axios from 'axios';

const API_BIBLE_URL = 'https://api.scripture.api.bible/v1';
const API_KEY = process.env.BIBLE_API_KEY!;

// Map frontend versions to API.Bible Bible IDs
export const BIBLE_VERSION_MAP: Record<string, string> = {
  kjv: 'de4e12af7f28f599-01', // King James Version
  niv: '1e4b16f04a1d0e47-01', // New International Version
  esv: 'c8b1e5e5b4e5f5b8-01', // English Standard Version
  nlt: 'b1b1a1a1b1a1a1a1-01', // New Living Translation (update with correct ID)
  nasb: 'a1a1b1b1c1c1d1d1-01', // New American Standard Bible (update with correct ID)
  msg: 'd1d1e1e1f1f1g1g1-01', // The Message (update with correct ID)
  amp: 'e1e1f1f1g1g1h1h1-01', // Amplified Bible (update with correct ID)
  nkjv: 'f1f1g1g1h1h1i1i1-01'  // New King James Version (update with correct ID)
};

const bibleApi = axios.create({
  baseURL: API_BIBLE_URL,
  headers: {
    'api-key': API_KEY
  }
});

export default bibleApi;