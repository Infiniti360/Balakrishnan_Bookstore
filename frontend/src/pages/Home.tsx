import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks } from '../store/bookSlice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  const featuredBooks = books.slice(0, 4);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Our Bookstore
        </Typography>
        <Typography variant="h5" gutterBottom align="center" color="text.secondary">
          Discover your next favorite book
        </Typography>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Featured Books
          </Typography>
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://picsum.photos/seed/${book.id}/200/300`}
                    alt={book.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${book.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/books/${book.id}`)}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/books')}
            >
              Browse All Books
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 