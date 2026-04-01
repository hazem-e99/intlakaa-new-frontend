import axios from 'axios';

// Base Backend URL (without /api)
let BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  'http://localhost:5000';

// Remove trailing /api if accidentally included in env variable
BACKEND_URL = BACKEND_URL.replace(/\/api\/?$/, '');

// Create axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper functions
export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setUser = (user) => {
  if (typeof window === 'undefined') return;

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;

  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
