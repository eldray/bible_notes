import React, { useState, useEffect } from 'react';
import { View, Text, Picker, FlatList, Button, Alert, StyleSheet } from 'react-native';
import BibleAPI from '../BibleAPI';
import { Verse, Chapter } from '../utils/types';
import api from '../utils/api';

const BibleReadingScreen = () => {
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  const [version, setVersion] = useState('kjv');
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);

  const books = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'];
  const versions = ['kjv', 'niv', 'esv', 'nlt', 'nasb', 'msg', 'amp', 'nkjv'];

  useEffect(() => {
    fetchChapter();
  }, [book, chapter, version]);

  const fetchChapter = async () => {
    setLoading(true);
    try {
      const data = await BibleAPI.getChapter(book, chapter, version);
      setChapterData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const bookmarkVerse = async (verse: Verse) => {
    try {
      await api.post('/api/bookmarks', { verseId: verse.verseId, reference: verse.reference, text: verse.text });
      Alert.alert('Success', 'Verse bookmarked');
    } catch (error) {
      Alert.alert('Error', 'Failed to bookmark verse');
    }
  };

  const highlightVerse = async (verse: Verse) => {
    try {
      await api.post('/api/highlights', { verseId: verse.verseId, reference: verse.reference, text: verse.text });
      Alert.alert('Success', 'Verse highlighted');
    } catch (error) {
      Alert.alert('Error', 'Failed to highlight verse');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Picker
          selectedValue={book}
          onValueChange={(value) => setBook(value)}
          style={styles.picker}
        >
          {books.map((b) => (
            <Picker.Item key={b} label={b} value={b} />
          ))}
        </Picker>
        <Picker
          selectedValue={chapter}
          onValueChange={(value) => setChapter(Number(value))}
          style={styles.picker}
        >
          {[...Array(50)].map((_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
        <Picker
          selectedValue={version}
          onValueChange={(value) => setVersion(value)}
          style={styles.picker}
        >
          {versions.map((v) => (
            <Picker.Item key={v} label={v.toUpperCase()} value={v} />
          ))}
        </Picker>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={chapterData?.verses}
          keyExtractor={(item) => item.verseId}
          renderItem={({ item }) => (
            <View style={styles.verse}>
              <Text>
                {item.reference}: {item.text}
              </Text>
              <Button title="Bookmark" onPress={() => bookmarkVerse(item)} />
              <Button title="Highlight" onPress={() => highlightVerse(item)} />
            </View>
          )}
          ListEmptyComponent={<Text>No verses available.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  controls: { flexDirection: 'row', marginBottom: 10 },
  picker: { flex: 1 },
  verse: { padding: 10, borderBottomWidth: 1 },
});

export default BibleReadingScreen;
