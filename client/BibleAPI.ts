import api from "./utils/api";
import { Verse, Chapter } from "./utils/types";

const BibleAPI = {
  async getVerse(verseId: string, version: string = "kjv"): Promise<Verse> {
    const response = await api.get(`/api/bible/verse/${verseId}`, {
      params: { version },
    });
    return response.data;
  },

  async getChapter(
    book: string,
    chapter: number,
    version: string = "kjv",
  ): Promise<Chapter> {
    const response = await api.get("/api/bible/chapter", {
      params: { book, chapter, version },
    });
    return response.data;
  },

  async search(query: string, version: string = "kjv"): Promise<Verse[]> {
    const response = await api.get("/api/bible/search", {
      params: { query, version },
    });
    return response.data;
  },

  async getRandomVerse(version: string = "kjv"): Promise<Verse> {
    const response = await api.get("/api/bible/random", {
      params: { version },
    });
    return response.data;
  },
};

export default BibleAPI;
