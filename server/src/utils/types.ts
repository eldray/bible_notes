export interface Verse {
  verseId: string;
  reference: string;
  text: string;
  version: string;
}

export interface Chapter {
  chapterId: string;
  reference: string;
  verses: Verse[];
  version: string;
}

export type Denomination = 'Baptist' | 'Catholic' | 'Pentecostal' | 'Methodist' | 'Presbyterian' | 'Lutheran' | 'Anglican' | 'Non-Denominational' | 'Other';
export type Role = 'Pastor' | 'Elder' | 'Deacon' | 'Member' | 'Youth Leader' | 'Worship Leader' | 'Teacher' | 'Other';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  churchName: string;
  churchBranch?: string;
  denomination: Denomination;
  role: Role;
  bio?: string;
  profileImageUrl?: string | null;
}

export interface SermonNote {
  id: string;
  userId: string;
  title: string;
  speaker?: string;
  church?: string;
  date?: string;
  text?: string;
  verses?: { reference: string; text: string }[];
  takeaways?: string[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  scripture?: string;
  likes: number;
  saved: boolean;
  timestamp: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  verses: Verse[];
}

export interface Devotion {
  id: string;
  date: string;
  title: string;
  content: string;
  verse: Verse;
}

export interface Bookmark {
  id: string;
  userId: string;
  verseId: string;
  reference: string;
  text: string;
}

export interface Highlight {
  id: string;
  userId: string;
  verseId: string;
  reference: string;
  text: string;
}
