import React, { useState, useEffect } from 'react';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    published_year: '',
    book_summary: ''
  });
  const [errors, setErrors] = useState({});

  // Initialize form if editing existing book
  useEffect(() => {
    if (book) {
      setFormData({
        name: book.name || '',
        author: book.author || '',
        published_year: book.published_year || '',
        book_summary: book.book_summary || ''
      });
    }
  }, [book]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Book title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.published_year) {
      newErrors.published_year = 'Published year is required';
    } else if (
      isNaN(formData.published_year) || 
      parseInt(formData.published_year) < 1000 || 
      parseInt(formData.published_year) > new Date().getFullYear()
    ) {
      newErrors.published_year = 'Please enter a valid year';
    }
    
    if (!formData.book_summary.trim()) {
      newErrors.book_summary = 'Book summary is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (validateForm()) {
      // Convert published_year to number
      const submittedData = {
        ...formData,
        published_year: parseInt(formData.published_year)
      };
      
      onSubmit(submittedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-group">
        <label htmlFor="name">Book Title</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={errors.author ? 'error' : ''}
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="published_year">Published Year</label>
        <input
          type="number"
          id="published_year"
          name="published_year"
          value={formData.published_year}
          onChange={handleChange}
          className={errors.published_year ? 'error' : ''}
          min="1000"
          max={new Date().getFullYear()}
        />
        {errors.published_year && <span className="error-message">{errors.published_year}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="book_summary">Book Summary</label>
        <textarea
          id="book_summary"
          name="book_summary"
          value={formData.book_summary}
          onChange={handleChange}
          className={errors.book_summary ? 'error' : ''}
          rows="4"
        />
        {errors.book_summary && <span className="error-message">{errors.book_summary}</span>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {book ? 'Update Book' : 'Add Book'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookForm; 