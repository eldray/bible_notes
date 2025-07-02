import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import api from '../utils/api';
import { Highlight } from '../utils/types';

const HighlightsScreen = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/highlights');
      setHighlights(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to load highlights');
    } finally {
      setLoading(false);
    }
  };

  const deleteHighlight = async (id: string) => {
    try {
      await api.delete(`/api/highlights/${id}`);
      setHighlights(highlights.filter((highlight) => highlight.id !== id));
      Alert.alert('Success', 'Highlight removed');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to remove highlight');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highlighted Verses</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={highlights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.highlight}>
              <Text style={styles.reference}>{item.reference}</Text>
              <Text>{item.text}</Text>
              <Button title="Remove" onPress={() => deleteHighlight(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No highlights yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  highlight: { padding: 10, borderBottomWidth: 1, marginBottom: 10 },
  reference: { fontSize: 16, fontWeight: 'bold' },
});

export default HighlightsScreen;
