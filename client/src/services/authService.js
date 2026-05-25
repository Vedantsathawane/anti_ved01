// services/authService.js — API Service Layer
// Handles all HTTP calls to the backend auth API

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth';

// Attach token to requests if available
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  /**
   * Register a new user account.
   */
  async register({ name, email, password }) {
    const response = await axios.post(`${API_BASE}/register`, { name, email, password });
    return response.data;
  },

  /**
   * Login with email and password.
   */
  async login({ email, password }) {
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    return response.data;
  },

  /**
   * Fetch the current user's profile (protected route).
   */
  async getProfile() {
    const response = await axios.get(`${API_BASE}/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
