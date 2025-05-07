import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // Update with your actual API URL

class ApiService {
    private authToken: string | null = null;
    private authStateCallback: ((isAuthenticated: boolean) => void) | null = null;

    constructor() {
        this.setupAxiosInterceptors();
    }

    private setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                if (this.authToken) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    registerAuthStateCallback(callback: (isAuthenticated: boolean) => void) {
        this.authStateCallback = callback;
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
        if (this.authStateCallback) {
            this.authStateCallback(!!token);
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            const { token } = response.data;
            await AsyncStorage.setItem('auth_token', token);
            this.setAuthToken(token);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        await AsyncStorage.removeItem('auth_token');
        this.setAuthToken(null);
    }

    async getBooks() {
        try {
            const response = await axios.get(`${BASE_URL}/books`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBook(bookId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/books/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createBook(bookData: any) {
        try {
            const response = await axios.post(`${BASE_URL}/books`, bookData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBook(bookId: string, bookData: any) {
        try {
            const response = await axios.put(`${BASE_URL}/books/${bookId}`, bookData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteBook(bookId: string) {
        try {
            const response = await axios.delete(`${BASE_URL}/books/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService(); 