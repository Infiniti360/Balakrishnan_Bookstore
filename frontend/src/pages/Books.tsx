import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { bookApi } from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  isbn: string;
  categories: Array<{ id: number; name: string }>;
}

interface BookFormData {
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  isbn: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    price: 0,
    stock: 0,
    isbn: '',
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getBooks();
      setBooks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        stock: book.stock,
        isbn: book.isbn,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: 0,
        stock: 0,
        isbn: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook.id, formData);
      } else {
        await bookApi.createBook(formData);
      }
      handleCloseDialog();
      fetchBooks();
    } catch (err: any) {
      setError(err.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookApi.deleteBook(id);
        fetchBooks();
      } catch (err: any) {
        setError(err.message || 'Failed to delete book');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Books
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {book.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="body2" component="p">
                  {book.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ISBN: {book.isbn}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${book.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock: {book.stock}
                </Typography>
                {book.categories && (
                  <Box sx={{ mt: 1 }}>
                    {book.categories.map((category) => (
                      <Typography
                        key={category.id}
                        variant="body2"
                        component="span"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginRight: '4px',
                        }}
                      >
                        {category.name}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(book)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(book.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBook ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Books; 