import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.get(`/auth/login?email=${email}`);
    const user = response.data[0]; // Assuming the first user is returned

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Simulate a token response
    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };

    // Store authentication data
    localStorage.setItem('accessToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (data: any) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Authentication utility functions

export const logout = () => {
  // Clear all authentication data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Redirect to landing page
  window.location.href = '/';
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
};

export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};