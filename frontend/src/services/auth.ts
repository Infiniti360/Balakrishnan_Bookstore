import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export const login = async (data: LoginData) => {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await axios.post(`${API_URL}/api/v1/auth/login`, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

export const register = async (data: RegisterData) => {
    const response = await axios.post(`${API_URL}/api/v1/auth/register`, data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
}; 