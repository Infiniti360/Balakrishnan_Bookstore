import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import CustomButton from './CustomButton';

const BookForm = ({ book, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: '',
    author: '',
    published_year: '',
    book_summary: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Set initial values if editing an existing book
  useEffect(() => {
    if (book) {
      setForm({
        name: book.name || '',
        author: book.author || '',
        published_year: book.published_year ? String(book.published_year) : '',
        book_summary: book.book_summary || ''
      });
    }
  }, [book]);
  
  // Update form field
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!form.name.trim()) {
      newErrors.name = 'Book title is required';
    }
    
    if (!form.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!form.published_year.trim()) {
      newErrors.published_year = 'Published year is required';
    } else {
      const year = parseInt(form.published_year);
      if (isNaN(year) || year < 1000 || year > currentYear) {
        newErrors.published_year = `Enter a valid year (1000-${currentYear})`;
      }
    }
    
    if (!form.book_summary.trim()) {
      newErrors.book_summary = 'Book summary is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Convert published_year to number before submitting
      const submittedData = {
        ...form,
        published_year: parseInt(form.published_year)
      };
      
      onSubmit(submittedData);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Book Title</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Enter book title"
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            value={form.author}
            onChangeText={(value) => handleChange('author', value)}
            placeholder="Enter author name"
            autoCapitalize="words"
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Published Year</Text>
          <TextInput
            style={[styles.input, errors.published_year && styles.inputError]}
            value={form.published_year}
            onChangeText={(value) => handleChange('published_year', value)}
            placeholder="Enter published year"
            keyboardType="number-pad"
            maxLength={4}
          />
          {errors.published_year && <Text style={styles.errorText}>{errors.published_year}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Book Summary</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.book_summary && styles.inputError]}
            value={form.book_summary}
            onChangeText={(value) => handleChange('book_summary', value)}
            placeholder="Enter book summary"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {errors.book_summary && <Text style={styles.errorText}>{errors.book_summary}</Text>}
        </View>
        
        <View style={styles.actions}>
          <CustomButton
            title="Cancel"
            type="secondary"
            onPress={onCancel}
            style={styles.button}
          />
          <CustomButton
            title={book ? 'Update Book' : 'Add Book'}
            type="primary"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 4,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default BookForm; 