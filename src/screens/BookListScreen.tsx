import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';
import { useBanner } from '../context/BannerContext';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;

interface Book {
  id: string;
  title: string;
  author: string;
}

export default function BookListScreen({ navigation }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const { showBanner } = useBanner();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (error) {
      showBanner('Failed to load books', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      showBanner('Logged out successfully', 'success');
    } catch (error) {
      showBanner('Failed to logout', 'error');
    }
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddBook', {})}>
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  bookItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
}); 