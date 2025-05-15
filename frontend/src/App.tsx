import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import Books from './components/Books';
import { isAuthenticated } from './services/auth';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/books" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route path="/books/:id" element={<PrivateRoute><BookDetails /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
