import React, { useState } from 'react';

const BookCard = ({ book, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Show delete confirmation modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    onDelete(book.id);
    setShowDeleteModal(false);
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{book.name}</h3>
        <div className="book-actions">
          <button
            className="btn-edit"
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.name}`}
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={handleDeleteClick}
            aria-label={`Delete ${book.name}`}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="book-details">
        <p className="book-author">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="book-year">
          <strong>Published:</strong> {book.published_year}
        </p>
        <p className="book-summary">{book.book_summary}</p>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{book.name}"?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleConfirmDelete}>
                Yes, Delete
              </button>
              <button className="btn-secondary" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard; 