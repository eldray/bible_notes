import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import api from '../utils/api';
import { Theme } from '../utils/types';

const BibleThemesScreen = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/themes');
      setThemes(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        (error as any).response?.data?.error || 'Failed to load themes'
      );
    } finally {
      setLoading(false);
    }
  };

  const viewTheme = async (themeId: string) => {
    try {
      const response = await api.get(`/api/themes/${themeId}`);
      const theme = response.data;
      const versesText = theme.verses
        .map((v: any) => `${v.reference}: ${v.text}`)
        .join('\n');
      Alert.alert(theme.name, `${theme.description}\n\n${versesText}`);
    } catch (error) {
      Alert.alert(
        'Error',
        (error as any).response?.data?.error || 'Failed to load theme details'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bible Themes</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={themes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.theme}>
              <Text style={styles.themeName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Button title="View Verses" onPress={() => viewTheme(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No themes available.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  theme: { padding: 10, borderBottomWidth: 1, marginBottom: 10 },
  themeName: { fontSize: 18, fontWeight: 'bold' },
});

export default BibleThemesScreen;
