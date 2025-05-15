import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string;
}

const BooksScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch books');
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <Image
        source={{ uri: item.cover_image || 'https://via.placeholder.com/300x400' }}
        style={styles.coverImage}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bookInfo: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BooksScreen; 