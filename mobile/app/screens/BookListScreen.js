import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bookService } from '../services/api';
import BookItem from '../components/BookItem';
import CustomButton from '../components/CustomButton';

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch books when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );
  
  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await bookService.getBooks();
      setBooks(response.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };
  
  // Navigate to add book screen
  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };
  
  // Navigate to edit book screen
  const handleEditBook = (book) => {
    navigation.navigate('EditBook', { book });
  };
  
  // Handle delete book
  const handleDeleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
      Alert.alert('Success', 'Book deleted successfully');
    } catch (err) {
      console.error('Failed to delete book:', err);
      Alert.alert('Error', 'Failed to delete book. Please try again.');
    }
  };
  
  // Render empty state
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No books found</Text>
      <Text style={styles.emptySubText}>Add some books to your collection</Text>
      <CustomButton 
        title="Add Book" 
        onPress={handleAddBook}
        style={styles.addButton}
      />
    </View>
  );
  
  // Render list header
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Books</Text>
      <CustomButton 
        title="Add Book" 
        onPress={handleAddBook}
        style={styles.headerButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton 
            title="Try Again" 
            onPress={fetchBooks}
            type="primary"
            style={styles.retryButton}
          />
        </View>
      ) : (
        <>
          {renderHeader()}
          
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Loading books...</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              renderItem={({ item }) => (
                <BookItem
                  book={item}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                />
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#3498db']}
                />
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButton: {
    minWidth: 100,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 150,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 150,
  },
});

export default BookListScreen; 