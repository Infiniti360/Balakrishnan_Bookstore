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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      dispatch(clearError());
      try {
        const response = await authApi.register(values.email, values.username, values.password);
        dispatch(setToken(response.access_token));
        dispatch(setUser(response.user));
        navigate('/');
      } catch (err: any) {
        dispatch(setError(err.response?.data?.detail || 'Registration failed'));
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
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
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
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
            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 