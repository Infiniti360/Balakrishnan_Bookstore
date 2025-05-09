import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API configuration based on platform
const getApiUrl = () => {
  // Since we're using adb reverse, we can use localhost for Android too
  return 'http://localhost:5001';
};

const BASE_URL = getApiUrl();
const API_URL = `${BASE_URL}/api`;

// Test the connection on startup
const testConnection = async () => {
  try {
    console.log('Testing connection to base URL:', BASE_URL);
    console.log('Platform:', Platform.OS);
    console.log('Testing network connectivity...');
    
    // Add timeout to fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // First try the root endpoint with explicit no-cache
      console.log('Attempting to fetch from root endpoint...');
      let response = await fetch(`${BASE_URL}/`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Root endpoint response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        console.log('Root endpoint accessible');
        const rootData = await response.json();
        console.log('Root endpoint data:', rootData);
      } else {
        console.warn('Root endpoint returned status:', response.status);
      }

      // Then try the health endpoint
      console.log('Attempting to fetch from health endpoint...');
      response = await fetch(`${API_URL}/health`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Health check response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      const data = await response.json();
      console.log('Health check data:', data);
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Connection timeout - full error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw new Error('Connection timeout - server not responding');
      }
      console.error('Fetch error - full details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  } catch (error) {
    console.error('Connection test failed:', {
      message: error.message,
      baseUrl: BASE_URL,
      apiUrl: API_URL,
      platform: Platform.OS,
      networkError: error instanceof TypeError,
      errorType: error.constructor.name,
      errorStack: error.stack
    });
    return false;
  }
};

// Create API instance with more specific timeout and error handling
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 5000, // Reduced timeout to 5 seconds
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Only treat 2xx as success
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Making request to:', config.url, 'with method:', config.method);
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a new retry mechanism for critical requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Request failed, retrying... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 1.5);
  }
};

// Authentication services
export const authService = {
  login: async (email, password) => {
    return retryRequest(async () => {
      try {
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
          throw new Error('Cannot connect to server. Please check your connection.');
        }

        console.log('Attempting login to:', `${API_URL}/login`);
        
        // Create form data with all required OAuth2 fields
        const formBody = new URLSearchParams({
          'grant_type': 'password',
          'username': email,
          'password': password,
          'scope': ''
        }).toString();

        console.log('Login request:', {
          url: `${API_URL}/login`,
          method: 'POST'
        });
        
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formBody
        });

        console.log('Login response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Login error response:', errorData);
          throw new Error(errorData.detail || `Login failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Login successful:', data);
        
        if (data.access_token) {
          await AsyncStorage.setItem('token', data.access_token);
        }
        
        return data;
      } catch (error) {
        console.error('Login error:', {
          message: error.message,
          url: `${API_URL}/login`,
          type: error.name,
          code: error.code,
          stack: error.stack
        });
        throw error;
      }
    });
  },
  
  register: async (userData) => {
    try {
      console.log('Attempting registration:', userData);
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration response:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Logout error:', error.message);
      return true; // Still consider logout successful even if API call fails
    }
  },
  
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Book validation
const validateBookData = (bookData) => {
  const requiredFields = ['name', 'author', 'published_year', 'book_summary'];
  const missingFields = requiredFields.filter(field => !bookData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (typeof bookData.published_year !== 'number') {
    throw new Error('published_year must be a number');
  }

  return true;
};

// Book services
export const bookService = {
  getBooks: async () => {
    try {
      const headers = await getAuthHeaders();
      console.log('Fetching books with headers:', headers);
      
      const response = await fetch(`${API_URL}/books`, {
        method: 'GET',
        headers
      });

      console.log('Books response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Books fetch error response:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch books');
      }

      const data = await response.json();
      console.log('Books fetched successfully, count:', data.length);
      return data;
    } catch (error) {
      console.error('Get books error:', {
        message: error.message,
        url: `${API_URL}/books`,
        type: error.name,
        code: error.code,
        stack: error.stack
      });
      throw new Error('Failed to fetch books');
    }
  },
  
  getBook: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch book');
      }

      return response.json();
    } catch (error) {
      console.error('Get book error:', {
        message: error.message,
        url: `${API_URL}/books/${id}`,
        type: error.name,
        code: error.code
      });
      throw new Error('Failed to fetch book');
    }
  },
  
  createBook: async (bookData) => {
    try {
      // Validate book data
      validateBookData(bookData);
      
      console.log('Creating book with data:', bookData);
      
      const headers = await getAuthHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookData)
      });

      console.log('Create book response status:', response.status);

      // Try to parse the response as JSON, fall back to text if that fails
      let errorData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        errorData = { detail: 'Server returned non-JSON response' };
      }

      if (!response.ok) {
        console.error('Create book error response:', errorData);
        throw new Error(errorData.detail || `Failed to create book (${response.status})`);
      }

      console.log('Book created successfully:', errorData);
      return errorData;
    } catch (error) {
      console.error('Create book error:', {
        message: error.message,
        url: `${API_URL}/books`,
        type: error.name,
        code: error.code,
        data: bookData,
        stack: error.stack
      });
      
      // Throw a more user-friendly error
      if (error.message.includes('Missing required fields')) {
        throw new Error('Please fill in all required fields');
      } else if (error.message.includes('published_year')) {
        throw new Error('Please enter a valid year');
      } else {
        throw new Error('Failed to create book. Please try again.');
      }
    }
  },
  
  updateBook: async (id, bookData) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update book');
      }

      return response.json();
    } catch (error) {
      console.error('Update book error:', {
        message: error.message,
        url: `${API_URL}/books/${id}`,
        type: error.name,
        code: error.code
      });
      throw new Error('Failed to update book');
    }
  },
  
  deleteBook: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete book');
      }

      return response.ok;
    } catch (error) {
      console.error('Delete book error:', {
        message: error.message,
        url: `${API_URL}/books/${id}`,
        type: error.name,
        code: error.code
      });
      throw new Error('Failed to delete book');
    }
  }
};

// Test connection on module load
testConnection();

export default api; 