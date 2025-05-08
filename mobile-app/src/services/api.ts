import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update the API URL to match your backend
const API_URL = 'http://localhost:8080';

export interface Book {
    id: string;
    name: string;
    author: string;
    published_year: number;
    book_summary: string;
}

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout and other configurations
    timeout: 10000,
    validateStatus: (status) => status >= 200 && status < 300,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Error in request interceptor:', error);
            return config;
        }
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            await AsyncStorage.removeItem('userToken');
        }
        return Promise.reject(error);
    }
);

export const bookService = {
    // Get all books
    getAllBooks: async (): Promise<Book[]> => {
        try {
            const response = await api.get('/books/');
            return response.data;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    },

    // Get a single book
    getBook: async (id: string): Promise<Book> => {
        try {
            const response = await api.get(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    // Create a new book
    createBook: async (book: Omit<Book, 'id'>): Promise<Book> => {
        try {
            console.log('Creating book with data:', book);
            const response = await api.post('/books/', book);
            console.log('Create book response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating book:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            throw error;
        }
    },

    // Update a book
    updateBook: async (id: string, book: Partial<Book>): Promise<Book> => {
        try {
            const response = await api.put(`/books/${id}`, book);
            return response.data;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    },

    // Delete a book
    deleteBook: async (id: string): Promise<void> => {
        try {
            const response = await api.delete(`/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    },
};

export const authService = {
    login: async (email: string, password: string): Promise<string> => {
        try {
            const response = await api.post('/login', { email, password });
            const token = response.data.access_token;
            await AsyncStorage.setItem('userToken', token);
            return token;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem('userToken');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    isAuthenticated: async (): Promise<boolean> => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return !!token;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },
}; 