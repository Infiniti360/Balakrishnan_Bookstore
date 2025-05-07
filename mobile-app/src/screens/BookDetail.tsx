import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';

// API base URL
const API_URL = 'http://192.168.1.6:8080';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price?: number;
  stock?: number;
  isbn?: string;
  createdAt: string;
  updatedAt: string;
}

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  BooksView: undefined;
  AddBook: undefined;
  EditBook: { book: Book };
  BookDetail: { book: Book };
};

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
type BookDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookDetail() {
  const navigation = useNavigation<BookDetailNavigationProp>();
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;

  const handleEditBook = () => {
    navigation.navigate('EditBook', { book });
  };

  const handleDeleteBook = async () => {
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
              // Try API delete first
              try {
                await axios.delete(`${API_URL}/api/books/${book.id}`);
                Alert.alert('Success', 'Book deleted successfully', [
                  { 
                    text: 'OK', 
                    onPress: () => navigation.navigate('BooksView')
                  }
                ]);
              } catch (error) {
                console.log('API delete failed:', error);
                Alert.alert(
                  'API Error', 
                  'Failed to delete book. Please try again later.',
                  [
                    { 
                      text: 'OK', 
                      onPress: () => navigation.navigate('BooksView')
                    }
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        {book.isbn && <Text style={styles.isbn}>ISBN: {book.isbn}</Text>}
        <Text style={styles.bookId}>Book ID: {book.id}</Text>
        {book.description && (
          <Text style={styles.description}>{book.description}</Text>
        )}
        {book.price && (
          <Text style={styles.price}>Price: ${book.price.toFixed(2)}</Text>
        )}
        {book.stock !== undefined && (
          <Text style={styles.stock}>In Stock: {book.stock}</Text>
        )}
        <Text style={styles.timestamp}>
          Last Updated: {new Date(book.updatedAt).toLocaleString()}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={handleEditBook}
        >
          <Text style={styles.buttonText}>Edit Book</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDeleteBook}
        >
          <Text style={styles.buttonText}>Delete Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  stock: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookId: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  isbn: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    fontStyle: 'italic',
  },
}); 