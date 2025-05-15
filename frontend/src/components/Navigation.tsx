import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearToken, clearUser } from '../store/authSlice';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearUser());
    navigate('/login');
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Bookstore
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/books">
            Books
          </Button>
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/cart"
            size="large"
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 