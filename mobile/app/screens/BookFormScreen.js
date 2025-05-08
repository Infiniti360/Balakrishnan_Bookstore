import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert
} from 'react-native';
import { bookService } from '../services/api';
import BookForm from '../components/BookForm';

const BookFormScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  
  // Check if we're editing an existing book or adding a new one
  const isEditing = route.params?.book;
  const book = route.params?.book;
  
  // Handle form submission
  const handleSubmit = async (bookData) => {
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing book
        await bookService.updateBook(book.id, bookData);
        Alert.alert('Success', 'Book updated successfully');
      } else {
        // Create new book
        await bookService.createBook(bookData);
        Alert.alert('Success', 'Book added successfully');
      }
      
      // Navigate back to the books list
      navigation.goBack();
    } catch (error) {
      console.error('Book form error:', error);
      Alert.alert(
        'Error',
        isEditing ? 'Failed to update book' : 'Failed to add book'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </Text>
      </View>
      
      <BookForm
        book={book}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default BookFormScreen; 