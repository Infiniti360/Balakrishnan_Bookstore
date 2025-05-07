import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';
import { useBanner } from '../context/BannerContext';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
}

export default function BookDetailScreen({ route, navigation }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const { showBanner } = useBanner();
  const { bookId } = route.params;

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const data = await apiService.getBook(bookId);
      setBook(data);
    } catch (error) {
      showBanner('Failed to load book details', 'error');
      navigation.goBack();
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteBook(bookId);
              showBanner('Book deleted successfully', 'success');
              navigation.goBack();
            } catch (error) {
              showBanner('Failed to delete book', 'error');
            }
          },
        },
      ]
    );
  };

  if (!book) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.description}>{book.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AddBook', { bookId })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 