import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import CustomButton from './CustomButton';

const BookItem = ({ book, onEdit, onDelete }) => {
  // Handle delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${book.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDelete(book.id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {book.name}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Author:</Text>
          <Text style={styles.value}>{book.author}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Published:</Text>
          <Text style={styles.value}>{book.published_year}</Text>
        </View>
        
        <Text style={styles.summary} numberOfLines={3}>
          {book.book_summary}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <CustomButton
          title="Edit"
          type="outline"
          onPress={() => onEdit(book)}
          style={styles.editButton}
        />
        <CustomButton
          title="Delete"
          type="danger"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
    color: '#7f8c8d',
    width: 80,
  },
  value: {
    flex: 1,
    color: '#2c3e50',
  },
  summary: {
    color: '#34495e',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    paddingTop: 0,
    gap: 10,
  },
  editButton: {
    minWidth: 80,
  },
  deleteButton: {
    minWidth: 80,
  },
});

export default BookItem; 