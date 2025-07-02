import { supabase } from '../src/config/supabase';
import concordanceData from './concordance.json';
import themesData from './themes.json';
import devotionsData from './devotions.json';

async function seed() {
  try {
    // Create tables if they don't exist
    await supabase.rpc('create_tables', {
      tables: [
        {
          name: 'concordance',
          schema: `
            word text primary key,
            originalWord text,
            definition text,
            usages jsonb,
            relatedWords jsonb
          `
        },
        {
          name: 'users',
          schema: `
            id uuid primary key,
            firstName text,
            lastName text,
            email text unique,
            phoneNumber text,
            churchName text,
            denomination text,
            role text,
            bio text,
            profileImageUrl text
          `
        },
        {
          name: 'sermon_notes',
          schema: `
            id uuid primary key,
            userId uuid references users(id),
            title text,
            speaker text,
            church text,
            date text,
            text text,
            verses jsonb,
            takeaways jsonb
          `
        },
        {
          name: 'community_posts',
          schema: `
            id uuid primary key,
            userId uuid references users(id),
            content text,
            scripture text,
            likes integer default 0,
            saved boolean default false,
            timestamp timestamptz
          `
        },
        {
          name: 'comments',
          schema: `
            id uuid primary key,
            postId uuid references community_posts(id),
            userId uuid references users(id),
            content text,
            timestamp text
          `
        },
        {
          name: 'verses',
          schema: `
            verseId text primary key,
            reference text,
            text text,
            version text
          `
        },
        {
          name: 'themes',
          schema: `
            id text primary key,
            name text,
            description text,
            verses jsonb
          `
        },
        {
          name: 'devotions',
          schema: `
            id text primary key,
            date text unique,
            title text,
            content text,
            verse jsonb
          `
        },
        {
          name: 'bookmarks',
          schema: `
            id uuid primary key,
            userId uuid references users(id),
            verseId text,
            reference text,
            text text
          `
        },
        {
          name: 'highlights',
          schema: `
            id uuid primary key,
            userId uuid references users(id),
            verseId text,
            reference text,
            text text
          `
        }
      ]
    });

    // Seed data
    await supabase.from('concordance').insert(concordanceData);
    await supabase.from('themes').insert(themesData);
    await supabase.from('devotions').insert(devotionsData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

seed();