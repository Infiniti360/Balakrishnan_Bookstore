import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks();
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new book
  const handleAddBook = async (bookData) => {
    try {
      const response = await bookService.createBook(bookData);
      setBooks([...books, response.data]);
      setShowAddForm(false);
      setSuccessMessage('Book added successfully');
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    }
  };

  // Handle updating a book
  const handleUpdateBook = async (bookData) => {
    try {
      const response = await bookService.updateBook(editingBook.id, bookData);
      setBooks(books.map(book => 
        book.id === editingBook.id ? response.data : book
      ));
      setEditingBook(null);
      setSuccessMessage('Book updated successfully');
    } catch (err) {
      setError('Failed to update book');
      console.error(err);
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
      setSuccessMessage('Book deleted successfully');
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    }
  };

  // Handle edit button click
  const handleEditClick = (book) => {
    setEditingBook(book);
    setShowAddForm(false);
  };

  // Handle cancel for add/edit form
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingBook(null);
  };

  // Show add book form
  const showAddBookForm = () => {
    setShowAddForm(true);
    setEditingBook(null);
  };

  return (
    <div className="book-page">
      <div className="book-page-header">
        <h1>Book Collection</h1>
        <button 
          className="btn-primary" 
          onClick={showAddBookForm}
          disabled={showAddForm || editingBook}
        >
          Add New Book
        </button>
      </div>
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}
      
      {/* Add/Edit Book Form */}
      {(showAddForm || editingBook) && (
        <div className="book-form-container">
          <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <BookForm 
            book={editingBook}
            onSubmit={editingBook ? handleUpdateBook : handleAddBook}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      
      {/* Books List */}
      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">
          <p>No books found. Add some books to your collection!</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditClick}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookPage; 