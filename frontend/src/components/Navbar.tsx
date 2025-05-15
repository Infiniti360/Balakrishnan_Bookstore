import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearToken, clearUser } from '../store/authSlice';
import { authApi } from '../services/api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    authApi.logout();
    dispatch(clearToken());
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bookstore
        </Typography>
        <Box>
          {token ? (
            <>
              <Button color="inherit" onClick={() => navigate('/')}>
                Books
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 