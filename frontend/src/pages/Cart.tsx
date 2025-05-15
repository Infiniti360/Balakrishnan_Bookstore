import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const handleQuantityChange = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/books')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography component="span" sx={{ mx: 2 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/books')}>
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(user ? '/checkout' : '/login')}
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart; 