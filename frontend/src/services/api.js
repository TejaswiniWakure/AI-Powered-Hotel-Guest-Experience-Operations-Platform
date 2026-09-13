import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stayflow_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data and handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ... }, extract data
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error?.message || 
                    error.response?.data?.message || 
                    error.message || 
                    'An error occurred connecting to server';
    
    // Auto-logout on 401 if token invalid (except login endpoint)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Optional: Clear token or notify
    }

    return Promise.reject(new Error(message));
  }
);

export const api = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  patch: (url, data) => apiClient.patch(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url)
};

export default apiClient;
