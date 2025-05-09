import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },
  
  register: async (userData) => {
    return api.post('/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/logout');
  }
};

// Book services
export const bookService = {
  getBooks: async () => {
    return axios.get('http://localhost:5002/books');
  },
  
  getBook: async (id) => {
    return axios.get(`http://localhost:5002/books/${id}`);
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