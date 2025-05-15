import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class AuthService {
    async login(username, password) {
        // For login, we need to send data as form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/auth/login`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify({ username }));
        }
        return response.data;
    }

    async register(username, email, password) {
        return axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }
}

export default new AuthService(); 