import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  timeout: 60000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const googleLogin = async (token) => {
  const response = await API.post('/api/auth/google', { token });
  return response.data;
};

export const login = async (email, password) => {
  const response = await API.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await API.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await API.get('/api/auth/me');
  return response.data;
};

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const createStrategy = async ({ name, rule, config }) => {
  const response = await API.post('/strategy', { name, rule, config });
  return response.data;
};

export const runBacktest = async (payload) => {
  const response = await API.post('/run-backtest', payload);
  return response.data;
};

export const fetchResultsCsv = async () => {
  const response = await API.get('/results');
  const body = response.data;
  if (typeof body === 'object' && body.data) {
    return body.data;
  }
  if (typeof body === 'string') {
    return body;
  }
  return '';
};

export default API;

