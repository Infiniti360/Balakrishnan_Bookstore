import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    description: string;
    price: number;
    categories: Array<{ id: number; name: string }>;
  };
  onViewDetails: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
    }));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          by {book.author}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {book.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {book.categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
        <Typography variant="h6" color="primary">
          ${book.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onViewDetails}>
          View Details
        </Button>
        <Button
          size="small"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          color="primary"
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard; 