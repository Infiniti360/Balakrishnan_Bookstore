import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { bookService } from '../services/api';

// API base URL - using IP address instead of localhost for mobile devices
const API_URL = 'http://192.168.1.6:8080';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price?: number;
  stock?: number;
}

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  BooksView: undefined;
  AddBook: undefined;
  EditBook: { book: Book };
};

type EditBookRouteProp = RouteProp<RootStackParamList, 'EditBook'>;
type EditBookNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<EditBookNavigationProp>();
  const route = useRoute<EditBookRouteProp>();
  const { book } = route.params;

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setDescription(book.description || '');
      setPrice(book.price ? book.price.toString() : '');
      setStock(book.stock ? book.stock.toString() : '');
    }
  }, [book]);

  const handleSubmit = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Title and author are required');
      return;
    }

    if (price && (isNaN(Number(price)) || Number(price) < 0)) {
      Alert.alert('Error', 'Price must be a valid number');
      return;
    }

    if (stock && (isNaN(Number(stock)) || Number(stock) < 0)) {
      Alert.alert('Error', 'Stock must be a valid number');
      return;
    }

    try {
      setLoading(true);
      const updatedBook = {
        title,
        author,
        description,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined
      };

      await bookService.updateBook(book.id, updatedBook);
      
      // Navigate back to BooksView and reset the stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'BooksView' }],
      });
    } catch (error) {
      console.error('Error updating book:', error);
      Alert.alert('Error', 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Book</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author *</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="Enter stock quantity"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate('BooksView')}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#3498db',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 