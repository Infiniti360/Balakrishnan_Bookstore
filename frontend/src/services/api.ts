import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Book API
export const bookApi = {
    getBooks: async (params?: { category?: string; search?: string }) => {
        const response = await api.get('/books', { params });
        return response.data;
    },
    getBook: async (id: number) => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },
    createBook: async (bookData: any) => {
        const response = await api.post('/books', bookData);
        return response.data;
    },
    updateBook: async (id: number, bookData: any) => {
        const response = await api.put(`/books/${id}`, bookData);
        return response.data;
    },
    deleteBook: async (id: number) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    },
};

// Auth API
export const authApi = {
    login: async (email: string, password: string) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);  // OAuth2 expects 'username'
            formData.append('password', password);

            const response = await axios.post(
                `${API_URL}/api/v1/auth/login`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },
    register: async (email: string, username: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
                email,
                username,
                password,
            });
            return response.data;
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error.message);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
    },
};

// Category API
export const categoryApi = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
};

// Order API
export const orderApi = {
    createOrder: async (orderData: any) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },
    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrder: async (id: number) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
}; 