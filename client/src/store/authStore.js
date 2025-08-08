// client/src/store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Login user
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      set({ 
        user: res.data.user, 
        token: res.data.token, 
        isAuthenticated: true,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed', 
        loading: false 
      });
    }
  },

  // Register user
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      localStorage.setItem('token', res.data.token);
      set({ 
        user: res.data.user, 
        token: res.data.token, 
        isAuthenticated: true,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed', 
        loading: false 
      });
    }
  },

  // Load user from token
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ loading: true });
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            'x-auth-token': token
          }
        });
        set({ 
          user: res.data, 
          token, 
          isAuthenticated: true,
          loading: false 
        });
      } catch (err) {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          loading: false 
        });
      }
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  // Set user data
  setUser: (userData) => set({ 
    user: { ...userData },
    isAuthenticated: true 
  })
}));

export default authStore;