import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken, setUser, setError, clearError } from '../store/authSlice';
import { authApi } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      dispatch(clearError());
      try {
        console.log('Submitting login form with:', { email: values.email });
        const response = await authApi.login(values.email, values.password);
        console.log('Login successful:', response);
        dispatch(setToken(response.access_token));
        dispatch(setUser(response.user));
        navigate('/');
      } catch (err: any) {
        console.error('Login error in component:', err);
        const errorMessage = err.response?.data?.detail || err.message || 'Login failed';
        dispatch(setError(errorMessage));
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate('/register')}
            >
              Don't have an account? Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 