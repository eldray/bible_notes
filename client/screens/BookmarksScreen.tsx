import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import api from '../utils/api';
import { Bookmark } from '../utils/types';

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/bookmarks');
      setBookmarks(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await api.delete(`/api/bookmarks/${id}`);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
      Alert.alert('Success', 'Bookmark removed');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Verses</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookmark}>
              <Text style={styles.reference}>{item.reference}</Text>
              <Text>{item.text}</Text>
              <Button title="Remove" onPress={() => deleteBookmark(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No bookmarks yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  bookmark: { padding: 10, borderBottomWidth: 1, marginBottom: 10 },
  reference: { fontSize: 16, fontWeight: 'bold' },
});

export default BookmarksScreen;