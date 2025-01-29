import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 60000, // 60 seconds for longer OpenAI responses
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create axios instance with config
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Extract error message from the response
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }

    // Create a custom error with the backend message
    const customError = new Error(errorMessage);

    // Handle specific status codes
    switch (error.response.status) {
      case 400:
        // Keep the original error message for validation errors
        break;
      case 401:
        // Only clear auth data and redirect if not trying to authenticate
        if (!error.config.url?.includes('/auth/')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.replace('/auth/sign-in');
        }
        break;
      case 403:
        customError.message = 'You do not have permission to perform this action';
        break;
      case 404:
        customError.message = 'The requested resource was not found';
        break;
      case 422:
        // Keep the original error message for validation errors
        break;
      case 429:
        customError.message = 'Too many requests. Please try again later';
        break;
      case 500:
        customError.message = error.response.data.detail || 'Server error. Please try again later';
        break;
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance; 