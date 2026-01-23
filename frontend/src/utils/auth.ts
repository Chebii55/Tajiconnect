/**
 * Authentication Utilities
 * Wrapper functions for the auth service for easy use in components
 */

import authService from '../services/api/auth';
import type {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from '../services/api/auth';

// ============================================
// LOGIN & REGISTRATION
// ============================================

/**
 * Login user with email and password
 * @returns Login response with user and tokens
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: true; user: User; response: LoginResponse }> => {
  const response = await authService.login({ email, password });
  return {
    success: true,
    user: response.user,
    response,
  };
};

/**
 * Register a new user
 * @returns Registration response
 */
export const registerUser = async (
  data: RegisterRequest
): Promise<{
  success: true;
  user: User;
  verificationRequired: boolean;
  nextSteps: string[];
}> => {
  const response = await authService.register(data);
  return {
    success: true,
    user: response.user,
    verificationRequired: response.verification_required,
    nextSteps: response.next_steps,
  };
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string) => {
  return authService.verifyEmail(token);
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

/**
 * Request password reset email
 */
export const forgotPassword = async (email: string) => {
  return authService.forgotPassword(email);
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string) => {
  return authService.resetPassword(token, newPassword);
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  return authService.changePassword(currentPassword, newPassword);
};

// ============================================
// LOGOUT
// ============================================

/**
 * Logout user and clear all auth data
 */
export const logout = async (): Promise<void> => {
  await authService.logout();
  // Redirect to home page
  window.location.href = '/';
};

/**
 * Logout without redirect (for programmatic use)
 */
export const logoutSilent = async (): Promise<void> => {
  await authService.logout();
};

// ============================================
// AUTH STATE CHECKS
// ============================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

/**
 * Get current user from local storage
 */
export const getCurrentUser = (): User | null => {
  return authService.getCurrentUser();
};

/**
 * Get current user's ID
 */
export const getUserId = (): string | null => {
  const user = authService.getCurrentUser();
  return user?.id || null;
};

/**
 * Get current user's role
 */
export const getUserRole = (): UserRole | null => {
  return authService.getUserRole();
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: UserRole): boolean => {
  return authService.hasRole(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return authService.isAdmin();
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  return authService.getAccessToken();
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  return authService.getRefreshToken();
};

/**
 * Refresh the access token
 */
export const refreshToken = async () => {
  return authService.refreshToken();
};

// ============================================
// USER DATA MANAGEMENT
// ============================================

/**
 * Fetch current user data from API (validates token)
 */
export const fetchCurrentUser = async (): Promise<User> => {
  return authService.getCurrentUserFromAPI();
};

/**
 * Update stored user data locally
 */
export const updateStoredUser = (updates: Partial<User>): void => {
  authService.updateStoredUser(updates);
};

/**
 * Clear all auth data without API call
 */
export const clearAuth = (): void => {
  authService.clearAuth();
};

// ============================================
// ROUTE PROTECTION HELPERS
// ============================================

/**
 * Check if current route requires authentication
 */
export const requiresAuth = (pathname: string): boolean => {
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/trainer/login',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  return !publicPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));
};

/**
 * Get redirect path after login based on user role
 */
export const getLoginRedirectPath = (user: User): string => {
  switch (user.role) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/trainer';
    case 'student':
    default:
      return '/student/dashboard';
  }
};

// Re-export types for convenience
export type { User, UserRole, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse };
