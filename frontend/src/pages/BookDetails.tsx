import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBookById, clearSelectedBook } from '../store/bookSlice';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedBook, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearSelectedBook());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!selectedBook) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography>Book not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {selectedBook.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {selectedBook.author}
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedBook.description}
          </Typography>
          <Typography variant="h6" color="primary">
            ${selectedBook.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {selectedBook.stock} units
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookDetails; 