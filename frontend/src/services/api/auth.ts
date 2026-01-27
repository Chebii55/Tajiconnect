/**
 * Authentication Service
 * Handles all authentication-related API calls to the backend
 */

import { apiClient } from './client';
import { AUTH, USERS } from './endpoints';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = 'admin' | 'instructor' | 'student' | 'moderator';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type SubscriptionTier = 'free' | 'premium' | 'corporate' | 'enterprise';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  subscription_tier: SubscriptionTier;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  last_login?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface RegisterResponse {
  user: User;
  onboarding_status: string;
  verification_required: boolean;
  next_steps: string[];
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface VerifyEmailResponse {
  message: string;
  user_id: string;
  next_step: string;
  onboarding_completed: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

// ============================================
// AUTH SERVICE CLASS
// ============================================

class AuthService {
  private readonly TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token';
  private readonly REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
  private readonly USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'user';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, credentials);

    // Store tokens and user data
    this.setTokens(response.access_token, response.refresh_token);
    this.setUser(response.user);

    return response;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(AUTH.REGISTER, data);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return apiClient.post<VerifyEmailResponse>(`${AUTH.VERIFY_EMAIL}?token=${token}`);
  }

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(AUTH.FORGOT_PASSWORD, { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(AUTH.RESET_PASSWORD, {
      token,
      new_password: newPassword,
    });
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>(AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    // Update stored access token
    localStorage.setItem(this.TOKEN_KEY, response.access_token);

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH.LOGOUT);
    } catch {
      // Logout even if API call fails
      console.warn('Logout API call failed, clearing local storage anyway');
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get current user from API (validates token)
   */
  async getCurrentUserFromAPI(): Promise<User> {
    const user = await apiClient.get<User>(USERS.ME);
    this.setUser(user);
    return user;
  }

  // ============================================
  // LOCAL STORAGE HELPERS
  // ============================================

  /**
   * Store tokens in localStorage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Store user data in localStorage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Get user role
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_superuser === true || user?.role === 'admin';
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Update stored user data
   */
  updateStoredUser(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
