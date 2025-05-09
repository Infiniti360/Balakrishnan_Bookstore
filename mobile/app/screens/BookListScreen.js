import React from 'react';
import { View, StyleSheet } from 'react-native';
import BookViewPage from './BookViewPage';

const BookListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BookViewPage navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default BookListScreen; 