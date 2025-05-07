import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { bookService, Book } from '../services/api';

// API base URL - using IP address instead of localhost for mobile devices
const API_URL = 'http://192.168.1.6:8080';

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  BooksView: undefined;
  AddBook: undefined;
  EditBook: { book: Book };
  BookDetail: { book: Book };
};

type BooksViewNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BooksView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<BooksViewNavigationProp>();
  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const fetchedBooks = await bookService.getAllBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          // No valid session, redirect to login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }
        // Valid session, fetch books
        fetchBooks();
      } catch (error) {
        console.error('Session check error:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkSession();
  }, []);

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleEditBook = (book: Book) => {
    navigation.navigate('EditBook', { book });
  };

  const handleDeleteBook = async (id: string) => {
    console.log('Delete book called with ID:', id);
    
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
              setLoading(true);
              console.log('Deleting book...');
              
              // Call the delete service
              await bookService.deleteBook(id);
              
              // Update local state after successful deletion
              setBooks(prevBooks => {
                const updatedBooks = prevBooks.filter(book => book.id !== id);
                console.log('Updated books after deletion:', updatedBooks);
                return updatedBooks;
              });
              
              console.log('Book deleted successfully');
              Alert.alert('Success', 'Book deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert(
                'Error',
                'Failed to delete book. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem('userToken');
      console.log('Session cleared, navigating to Login');
      
      // Reset navigation to Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={styles.bookContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
        {item.price && <Text style={styles.price}>${item.price.toFixed(2)}</Text>}
        {item.stock !== undefined && <Text style={styles.stock}>In stock: {item.stock}</Text>}
        {item.isbn && <Text style={styles.isbn}>ISBN: {item.isbn}</Text>}
        <Text style={styles.bookId}>ID: {item.id}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={(e) => {
            e.stopPropagation();
            handleEditBook(item);
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, loading && styles.disabledButton]} 
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteBook(item.id);
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookstore</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchBooks}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Text style={styles.addButtonText}>+ Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra space for add button
  },
  bookItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookId: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  isbn: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 