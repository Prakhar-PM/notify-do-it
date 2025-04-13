
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't logout on 404 or other non-auth errors
    if (error.response && error.response.status === 401) {
      // Only handle 401 Unauthorized errors
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (userData: { email: string; password: string }) => {
  const response = await api.post('/users/login', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Task API calls
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData: any) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const getTaskById = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId: string, taskData: any) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
  const response = await api.put(`/tasks/${taskId}`, { completed });
  return response.data;
};
