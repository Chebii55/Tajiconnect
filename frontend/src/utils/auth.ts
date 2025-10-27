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