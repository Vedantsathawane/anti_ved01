// services/authService.js — API Service Layer
import axios from 'axios';

// Uses VITE_API_URL env var in production, falls back to localhost for dev
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  async register({ name, email, password }) {
    const response = await axios.post(`${API_BASE}/register`, { name, email, password });
    return response.data;
  },

  async login({ email, password }) {
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    return response.data;
  },

  async getProfile() {
    const response = await axios.get(`${API_BASE}/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
