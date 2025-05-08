import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API configuration
const API_URL = 'http://localhost:5000/api';

// Create API instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/login`, formData);
    
    if (response.data.access_token) {
      await AsyncStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },
  
  register: async (userData) => {
    return api.post('/register', userData);
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
    return api.post('/logout');
  },
  
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

// Book services
export const bookService = {
  getBooks: async () => {
    return api.get('/books');
  },
  
  getBook: async (id) => {
    return api.get(`/books/${id}`);
  },
  
  createBook: async (bookData) => {
    return api.post('/books', bookData);
  },
  
  updateBook: async (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
  },
  
  deleteBook: async (id) => {
    return api.delete(`/books/${id}`);
  }
};

export default api; 