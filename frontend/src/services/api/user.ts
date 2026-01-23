/**
 * User Service
 * Handles all user and profile-related API calls
 */

import { apiClient } from './client';
import { USERS, ADMIN } from './endpoints';
import type { User } from './auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  preferred_language: string;
  timezone: string;
  accessibility_preferences: AccessibilityPreferences;
  notification_preferences: NotificationPreferences;
  total_courses_completed: number;
  total_hours_learned: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  user_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AccessibilityPreferences {
  high_contrast?: boolean;
  large_text?: boolean;
  screen_reader_optimized?: boolean;
  reduce_motion?: boolean;
  captions_enabled?: boolean;
  [key: string]: unknown;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  course_updates: boolean;
  achievement_notifications: boolean;
  [key: string]: unknown;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  preferred_language?: string;
  timezone?: string;
  accessibility_preferences?: Partial<AccessibilityPreferences>;
  notification_preferences?: Partial<NotificationPreferences>;
  user_metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  users_by_role: Record<string, number>;
  users_by_subscription: Record<string, number>;
}

export interface UserSearchParams {
  query?: string;
  role?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

// ============================================
// USER SERVICE CLASS
// ============================================

class UserService {
  // ============================================
  // CURRENT USER OPERATIONS
  // ============================================

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(USERS.ME);
  }

  /**
   * Update current user's basic info
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<User> {
    const updatedUser = await apiClient.put<User>(USERS.ME, data);
    // Update local storage
    const userKey = import.meta.env.VITE_USER_STORAGE_KEY || 'user';
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
    return updatedUser;
  }

  /**
   * Delete current user's account
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete(USERS.ME);
    // Clear local storage
    const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token';
    const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
    const userKey = import.meta.env.VITE_USER_STORAGE_KEY || 'user';
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
    localStorage.removeItem(userKey);
  }

  // ============================================
  // PROFILE OPERATIONS
  // ============================================

  /**
   * Get current user's profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(USERS.PROFILE);
  }

  /**
   * Create profile for current user
   */
  async createProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.post<UserProfile>(USERS.PROFILE, data);
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.put<UserProfile>(USERS.PROFILE, data);
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ avatar_url: string }> {
    return apiClient.uploadFile<{ avatar_url: string }>(
      `${USERS.PROFILE}/avatar`,
      file,
      onProgress
    );
  }

  // ============================================
  // USER MANAGEMENT (Admin only)
  // ============================================

  /**
   * Get all users (admin only)
   */
  async getUsers(
    skip = 0,
    limit = 100
  ): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(USERS.LIST, { skip, limit });
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(USERS.BY_ID(userId));
  }

  /**
   * Update user by ID (admin only)
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(USERS.BY_ID(userId), data);
  }

  /**
   * Delete user by ID (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(USERS.BY_ID(userId));
  }

  /**
   * Get user's profile by ID (admin only)
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(USERS.USER_PROFILE(userId));
  }

  // ============================================
  // ADMIN OPERATIONS
  // ============================================

  /**
   * Get admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>(ADMIN.STATS);
  }

  /**
   * Change user's role (admin only)
   */
  async changeUserRole(
    userId: string,
    role: 'admin' | 'instructor' | 'student' | 'moderator'
  ): Promise<User> {
    return apiClient.put<User>(ADMIN.CHANGE_ROLE(userId), { role });
  }

  /**
   * Change user's status (admin only)
   */
  async changeUserStatus(
    userId: string,
    status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  ): Promise<User> {
    return apiClient.put<User>(ADMIN.CHANGE_STATUS(userId), { status });
  }

  /**
   * Update user's subscription (admin only)
   */
  async updateUserSubscription(
    userId: string,
    subscription_tier: 'free' | 'premium' | 'corporate' | 'enterprise'
  ): Promise<User> {
    return apiClient.put<User>(ADMIN.UPDATE_SUBSCRIPTION(userId), { subscription_tier });
  }

  /**
   * Get recent registrations (admin only)
   */
  async getRecentRegistrations(limit = 10): Promise<User[]> {
    return apiClient.get<User[]>(ADMIN.RECENT_REGISTRATIONS, { limit });
  }

  /**
   * Search users (admin only)
   */
  async searchUsers(params: UserSearchParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(
      ADMIN.SEARCH,
      params as Record<string, unknown>
    );
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
