import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.6:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    price?: number;
    stock?: number;
    isbn?: string;
    createdAt: string;
    updatedAt: string;
}

export const bookService = {
    // Get all books
    getAllBooks: async (): Promise<Book[]> => {
        try {
            const response = await api.get('/api/books');
            return response.data;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    },

    // Get a single book
    getBook: async (id: string): Promise<Book> => {
        try {
            const response = await api.get(`/api/books/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    // Create a new book
    createBook: async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
        try {
            const uniqueId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newBook = {
                ...book,
                id: uniqueId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await api.post('/api/books', newBook);
            return response.data;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    },

    // Update a book
    updateBook: async (id: string, book: Partial<Book>): Promise<Book> => {
        try {
            const updatedBook = {
                ...book,
                updatedAt: new Date().toISOString()
            };
            const response = await api.put(`/api/books/${id}`, updatedBook);
            return response.data;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    },

    // Delete a book
    deleteBook: async (id: string): Promise<void> => {
        try {
            console.log('Attempting to delete book with ID:', id);
            const response = await api.delete(`/api/books/${id}`);
            console.log('Delete response:', response);
            return response.data;
        } catch (error) {
            console.error('Error deleting book:', error);
            if (axios.isAxiosError(error)) {
                console.error('API Error:', error.response?.data);
            }
            throw error;
        }
    },
};

export const authService = {
    login: async (email: string, password: string): Promise<string> => {
        try {
            console.log('Attempting login with:', { email });

            // For now, we'll use a simple validation since we don't have a backend
            if (email && password.length >= 3) {
                // Generate a dummy token
                const token = `dummy_token_${Date.now()}`;
                await AsyncStorage.setItem('userToken', token);
                console.log('Login successful, token stored');
                return token;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            console.log('Logging out...');
            await AsyncStorage.removeItem('userToken');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    isAuthenticated: async (): Promise<boolean> => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log('Auth check, token exists:', !!token);
            return !!token;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },
}; 