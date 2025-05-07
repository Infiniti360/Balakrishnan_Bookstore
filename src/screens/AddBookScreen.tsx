import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';
import { useBanner } from '../context/BannerContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddBook'>;

interface BookForm {
  title: string;
  author: string;
  description: string;
}

export default function AddBookScreen({ route, navigation }: Props) {
  const [form, setForm] = useState<BookForm>({
    title: '',
    author: '',
    description: '',
  });

  const { bookId } = route.params || {};
  const { showBanner } = useBanner();
  const isEditing = !!bookId;

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const loadBook = async () => {
    try {
      const book = await apiService.getBook(bookId);
      setForm(book);
    } catch (error) {
      showBanner('Failed to load book details', 'error');
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.author) {
        showBanner('Title and author are required', 'error');
        return;
      }

      if (isEditing) {
        await apiService.updateBook(bookId, form);
        showBanner('Book updated successfully', 'success');
      } else {
        await apiService.createBook(form);
        showBanner('Book added successfully', 'success');
      }
      navigation.goBack();
    } catch (error) {
      showBanner(
        `Failed to ${isEditing ? 'update' : 'add'} book`,
        'error'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={form.author}
        onChangeText={(text) => setForm({ ...form, author: text })}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Update Book' : 'Add Book'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 