import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import api from '../utils/api';
import { ConcordanceEntry } from '../utils/types';

const ConcordanceScreen = () => {
  const [searchWord, setSearchWord] = useState('');
  const [entry, setEntry] = useState<ConcordanceEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/concordance/${searchWord}`);
      setEntry(response.data);
    } catch (error) {
      Alert.alert('Error', 'Word not found');
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Concordance</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter word (e.g., faith)"
        value={searchWord}
        onChangeText={setSearchWord}
      />
      <Button title={loading ? 'Searching...' : 'Search'} onPress={handleSearch} disabled={loading} />
      {entry && (
        <View style={styles.result}>
          <Text style={styles.word}>{entry.word} ({entry.originalWord})</Text>
          <Text style={styles.definition}>{entry.definition}</Text>
          <Text style={styles.subTitle}>Usages:</Text>
          <FlatList
            data={entry.usages}
            keyExtractor={(item) => item.reference}
            renderItem={({ item }) => (
              <Text>{item.reference}: {item.text}</Text>
            )}
          />
          <Text style={styles.subTitle}>Related Words:</Text>
          <FlatList
            data={entry.relatedWords}
            keyExtractor={(item) => item.word}
            renderItem={({ item }) => (
              <Text>{item.word} ({item.originalWord})</Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  result: { marginTop: 20 },
  word: { fontSize: 18, fontWeight: 'bold' },
  definition: { marginVertical: 10 },
  subTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
});

export default ConcordanceScreen;