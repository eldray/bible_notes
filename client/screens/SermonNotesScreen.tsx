import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import api from '../utils/api';
import { SermonNote } from '../utils/types';

const SermonNotesScreen = () => {
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [newNote, setNewNote] = useState({ title: '', speaker: '', church: '', date: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/sermon-notes');
      setNotes(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/sermon-notes', newNote);
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', speaker: '', church: '', date: '', text: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/api/sermon-notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sermon Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={newNote.title}
        onChangeText={(value) => setNewNote({ ...newNote, title: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Speaker"
        value={newNote.speaker}
        onChangeText={(value) => setNewNote({ ...newNote, speaker: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Church"
        value={newNote.church}
        onChangeText={(value) => setNewNote({ ...newNote, church: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={newNote.date}
        onChangeText={(value) => setNewNote({ ...newNote, date: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={newNote.text}
        onChangeText={(value) => setNewNote({ ...newNote, text: value })}
        multiline
      />
      <Button title={loading ? 'Saving...' : 'Add Note'} onPress={addNote} disabled={loading} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.speaker} - {item.church} ({item.date})</Text>
            <Text>{item.text}</Text>
            <Button title="Delete" onPress={() => deleteNote(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  note: { padding: 10, borderBottomWidth: 1 },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default SermonNotesScreen;