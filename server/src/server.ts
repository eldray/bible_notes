// server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import bibleRoutes from './routes/bible';
import concordanceRoutes from './routes/concordance';
import themesRoutes from './routes/themes';
import sermonNotesRoutes from './routes/sermonNotes';
import communityRoutes from './routes/community';
import devotionsRoutes from './routes/devotions';
import bookmarksRoutes from './routes/bookmarks';
import highlightsRoutes from './routes/highlights';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY ? 'Set' : 'Missing',
  PORT: process.env.PORT,
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    headers: req.headers,
  });
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:8081',
      'http://localhost:3000',
      /exp:\/\/.*/, // Allow all Expo origins
      /http:\/\/192\.168\.\d{1,3}\.\d{1,3}:19000/, // Allow Expo dev server
      undefined, // Allow non-browser clients
    ];
    if (!origin || allowedOrigins.some((allowed) => allowed instanceof RegExp ? allowed.test(origin) : allowed === origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked:', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bible', bibleRoutes);
app.use('/api/concordance', concordanceRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/sermon-notes', sermonNotesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/devotions', devotionsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/highlights', highlightsRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});