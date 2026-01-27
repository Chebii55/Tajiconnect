# TajiConnect Frontend-Backend Integration Plan

## Executive Summary

This document outlines the comprehensive plan for integrating the TajiConnect React frontend with the TajiLMS backend microservices architecture.

**Backend**: 8 Python/FastAPI microservices behind an API Gateway (port 8000)
**Frontend**: React 19 + TypeScript + Vite application

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│   Port 3000 (Vite Dev) / Static Build                               │
├─────────────────────────────────────────────────────────────────────┤
│  Components → Contexts → Services → API Client                      │
│                              │                                      │
│                              ▼                                      │
│                    HTTP/WebSocket Requests                          │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Port 8000)                        │
│   Routes requests to appropriate microservices                      │
├────────────┬────────────┬────────────┬────────────┬────────────────┤
│  User      │  Course    │  Content   │  AI        │  Others...     │
│  Service   │  Service   │  Service   │  Service   │                │
│  (8001)    │  (8002)    │  (8003)    │  (8007)    │                │
└────────────┴────────────┴────────────┴────────────┴────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                                   │
│   PostgreSQL (5432) │ Redis (6379) │ RabbitMQ (5672)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Environment & Configuration Setup

### 1.1 Update Frontend Environment Variables

**File**: `frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_API_BASE_PATH=/api/v1

# WebSocket Configuration
VITE_WS_URL=ws://localhost:8000/ws
VITE_ENABLE_WEBSOCKET=true
VITE_WS_RECONNECT_INTERVAL=3000
VITE_WS_MAX_RECONNECT_ATTEMPTS=5

# Authentication
VITE_TOKEN_STORAGE_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_USER_STORAGE_KEY=user

# Cache Configuration
VITE_CACHE_DURATION=1800000
VITE_PROFILE_CACHE_TTL=3600000
VITE_RECOMMENDATIONS_CACHE_TTL=1800000

# Environment
VITE_ENV=development
VITE_DEBUG=true
```

### 1.2 Backend CORS Configuration

**Verify** in each microservice's `config.py` or `settings.py`:

```python
BACKEND_CORS_ORIGINS = [
    "http://localhost:3000",      # Vite dev server
    "http://localhost:5173",      # Vite alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
```

---

## Phase 2: API Client & Endpoint Alignment

### 2.1 Update API Endpoints Configuration

**File**: `frontend/src/services/api/endpoints.ts`

```typescript
// Base URL from environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

export const ENDPOINTS = {
  // Authentication (User Service via Gateway)
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    REGISTER: `${API_VERSION}/auth/register`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    VERIFY_EMAIL: `${API_VERSION}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_VERSION}/auth/forgot-password`,
    RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
  },

  // User Management
  USERS: {
    ME: `${API_VERSION}/users/me`,
    PROFILE: `${API_VERSION}/users/me/profile`,
    BY_ID: (id: string) => `${API_VERSION}/users/${id}`,
  },

  // Onboarding
  ONBOARDING: {
    FLOW: `${API_VERSION}/onboarding/flow`,
    STATUS: `${API_VERSION}/onboarding/status`,
    COMPLETE_STEP: `${API_VERSION}/onboarding/step/complete`,
    PROFILE_SETUP: `${API_VERSION}/onboarding/profile-setup`,
    LEARNING_GOALS: `${API_VERSION}/onboarding/learning-goals`,
    PREFERENCES: `${API_VERSION}/onboarding/preferences`,
    NEXT_STEPS: `${API_VERSION}/onboarding/next-steps`,
  },

  // Courses
  COURSES: {
    LIST: `${API_VERSION}/courses`,
    BY_ID: (id: string) => `${API_VERSION}/courses/${id}`,
    CREATE: `${API_VERSION}/courses`,
  },

  // Grades & Subjects
  GRADES: {
    LIST: `${API_VERSION}/grades`,
    BY_ID: (id: string) => `${API_VERSION}/grades/${id}`,
    SUBJECTS: (gradeId: string) => `${API_VERSION}/grades/${gradeId}/subjects`,
  },

  SUBJECTS: {
    LIST: `${API_VERSION}/subjects`,
    BY_ID: (id: string) => `${API_VERSION}/subjects/${id}`,
  },

  // Content
  CONTENT: {
    LIST: `${API_VERSION}/content`,
    BY_ID: (id: string) => `${API_VERSION}/content/${id}`,
    UPLOAD: `${API_VERSION}/content/upload`,
    STREAM: (id: string) => `${API_VERSION}/content/${id}/stream`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_VERSION}/notifications`,
    SEND: `${API_VERSION}/notifications/send`,
    MARK_READ: `${API_VERSION}/notifications/mark-read`,
    MARK_ALL_READ: `${API_VERSION}/notifications/mark-all-read`,
    PREFERENCES: `${API_VERSION}/notifications/preferences`,
  },

  // Payments
  PAYMENTS: {
    CREATE: `${API_VERSION}/payments/create`,
    BY_ID: (id: string) => `${API_VERSION}/payments/${id}`,
    LIST: `${API_VERSION}/payments`,
    CONFIRM: (id: string) => `${API_VERSION}/payments/${id}/confirm`,
  },

  SUBSCRIPTIONS: {
    CREATE: `${API_VERSION}/subscriptions`,
    LIST: `${API_VERSION}/subscriptions`,
    BY_ID: (id: string) => `${API_VERSION}/subscriptions/${id}`,
  },

  // AI Services
  AI: {
    RECOMMENDATIONS: {
      COURSES: `${API_VERSION}/ai/recommendations/courses`,
      BEHAVIOR: `${API_VERSION}/ai/recommendations/behavior`,
      TRENDING: `${API_VERSION}/ai/recommendations/trending`,
      SIMILAR: (courseId: string) => `${API_VERSION}/ai/recommendations/similar/${courseId}`,
    },
    CHAT: `${API_VERSION}/ai/chat`,
    TUTORING: {
      LEARNING_PATH: `${API_VERSION}/ai/tutoring/learning-path`,
    },
    ASSESSMENT: {
      GENERATE_QUIZ: `${API_VERSION}/ai/generate-quiz`,
      GENERATE: `${API_VERSION}/ai/assessment/generate`,
    },
    PSYCHOMETRIC: {
      ASSESSMENT: `${API_VERSION}/ai/psychometric/assessment`,
    },
    SKILLS: {
      TRACK: `${API_VERSION}/ai/skills/track`,
    },
    LEARNING_PATHS: `${API_VERSION}/ai/learning-paths`,
    ANALYTICS: {
      PROGRESS: `${API_VERSION}/ai/analytics/progress`,
    },
  },

  // Analytics
  ANALYTICS: {
    EVENTS: `${API_VERSION}/analytics/events`,
    DASHBOARD: `${API_VERSION}/analytics/dashboard`,
    USERS: `${API_VERSION}/analytics/users`,
    COURSES: `${API_VERSION}/analytics/courses`,
    REPORTS: (type: string) => `${API_VERSION}/analytics/reports/${type}`,
  },

  // Gateway
  GATEWAY: {
    SERVICES: `${API_VERSION}/gateway/services`,
    HEALTH: `${API_VERSION}/gateway/health`,
  },
};
```

### 2.2 Enhanced API Client with Token Refresh

**File**: `frontend/src/services/api/client.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ENDPOINTS } from './endpoints';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401 and refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                };
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.client.post<TokenResponse>(
              ENDPOINTS.AUTH.REFRESH,
              { refresh_token: refreshToken }
            );

            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Notify subscribers
            this.refreshSubscribers.forEach((callback) => callback(access_token));
            this.refreshSubscribers = [];

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${access_token}`,
            };

            return this.client(originalRequest);
          } catch (refreshError) {
            // Clear tokens and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: AxiosError): Error {
    if (error.response) {
      const data = error.response.data as { detail?: string; message?: string };
      return new Error(data.detail || data.message || 'An error occurred');
    }
    if (error.request) {
      return new Error('Network error. Please check your connection.');
    }
    return error;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // File upload with progress
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
```

---

## Phase 3: Authentication Service Integration

### 3.1 Create Auth Service Module

**File**: `frontend/src/services/api/auth.ts`

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

// Types matching backend responses
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  subscription_tier: 'free' | 'premium' | 'corporate' | 'enterprise';
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
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

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data);
  }

  async verifyEmail(token: string): Promise<{ message: string; user_id: string }> {
    return apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, null, {
      params: { token },
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      new_password: newPassword,
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return apiClient.post<RefreshResponse>(ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }
}

export const authService = new AuthService();
export default authService;
```

### 3.2 Update Auth Utils

**File**: `frontend/src/utils/auth.ts`

```typescript
import authService, { LoginRequest, RegisterRequest, User } from '../services/api/auth';

export const loginUser = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  return {
    success: true,
    user: response.user,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
};

export const registerUser = async (data: RegisterRequest) => {
  const response = await authService.register(data);
  return {
    success: true,
    user: response.user,
    verificationRequired: response.verification_required,
    nextSteps: response.next_steps,
  };
};

export const logout = async () => {
  await authService.logout();
};

export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

export const getCurrentUser = (): User | null => {
  return authService.getCurrentUser();
};

export const getUserRole = (): string | null => {
  return authService.getUserRole();
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};
```

---

## Phase 4: User & Profile Service Integration

### 4.1 Create User Service Module

**File**: `frontend/src/services/api/user.ts`

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { User } from './auth';

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
  accessibility_preferences: Record<string, unknown>;
  notification_preferences: Record<string, unknown>;
  total_courses_completed: number;
  total_hours_learned: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
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
  accessibility_preferences?: Record<string, unknown>;
  notification_preferences?: Record<string, unknown>;
}

class UserService {
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.USERS.ME);
  }

  async updateCurrentUser(data: UpdateUserRequest): Promise<User> {
    const user = await apiClient.put<User>(ENDPOINTS.USERS.ME, data);
    // Update cached user
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.ME);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(ENDPOINTS.USERS.PROFILE);
  }

  async createProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.post<UserProfile>(ENDPOINTS.USERS.PROFILE, data);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.put<UserProfile>(ENDPOINTS.USERS.PROFILE, data);
  }
}

export const userService = new UserService();
export default userService;
```

---

## Phase 5: Onboarding Service Integration

### 5.1 Create Onboarding Service Module

**File**: `frontend/src/services/api/onboarding.ts`

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export interface OnboardingStep {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  is_required: boolean;
  is_completed: boolean;
}

export interface OnboardingFlow {
  steps: OnboardingStep[];
  current_step: number;
  total_steps: number;
  completed_percentage: number;
}

export interface OnboardingStatus {
  user_id: string;
  is_completed: boolean;
  current_step: string;
  completed_steps: string[];
  started_at: string;
  completed_at?: string;
}

export interface ProfileSetupData {
  bio?: string;
  location?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
}

export interface LearningGoalsData {
  goals: string[];
  target_completion_date?: string;
  weekly_hours_commitment: number;
  learning_style?: string;
}

export interface PreferencesData {
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  content_preferences: {
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    content_types: string[];
  };
  accessibility_preferences?: Record<string, unknown>;
}

class OnboardingService {
  async getFlow(): Promise<OnboardingFlow> {
    return apiClient.get<OnboardingFlow>(ENDPOINTS.ONBOARDING.FLOW);
  }

  async getStatus(): Promise<OnboardingStatus> {
    return apiClient.get<OnboardingStatus>(ENDPOINTS.ONBOARDING.STATUS);
  }

  async completeStep(stepName: string): Promise<{ success: boolean; next_step?: string }> {
    return apiClient.post(ENDPOINTS.ONBOARDING.COMPLETE_STEP, { step_name: stepName });
  }

  async submitProfileSetup(data: ProfileSetupData): Promise<{ success: boolean }> {
    return apiClient.post(ENDPOINTS.ONBOARDING.PROFILE_SETUP, data);
  }

  async submitLearningGoals(data: LearningGoalsData): Promise<{ success: boolean }> {
    return apiClient.post(ENDPOINTS.ONBOARDING.LEARNING_GOALS, data);
  }

  async submitPreferences(data: PreferencesData): Promise<{ success: boolean }> {
    return apiClient.post(ENDPOINTS.ONBOARDING.PREFERENCES, data);
  }

  async getNextSteps(): Promise<{ steps: OnboardingStep[] }> {
    return apiClient.get(ENDPOINTS.ONBOARDING.NEXT_STEPS);
  }

  async skipStep(stepName: string): Promise<{ success: boolean }> {
    return apiClient.post(`${ENDPOINTS.ONBOARDING.FLOW}/skip-step`, { step_name: stepName });
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;
```

---

## Phase 6: Course Service Integration

### 6.1 Create Course Service Module

**File**: `frontend/src/services/api/courses.ts`

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  grade_id?: number;
  subject_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: number;
  name: string;
  description: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  grade_id?: number;
  subject_id?: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  grade_id?: number;
  subject_id?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

class CourseService {
  // Courses
  async getCourses(skip = 0, limit = 100): Promise<PaginatedResponse<Course>> {
    return apiClient.get<PaginatedResponse<Course>>(ENDPOINTS.COURSES.LIST, {
      skip,
      limit,
    });
  }

  async getCourseById(id: string): Promise<Course> {
    return apiClient.get<Course>(ENDPOINTS.COURSES.BY_ID(id));
  }

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return apiClient.post<Course>(ENDPOINTS.COURSES.CREATE, data);
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    return apiClient.put<Course>(ENDPOINTS.COURSES.BY_ID(id), data);
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.COURSES.BY_ID(id));
  }

  // Grades
  async getGrades(): Promise<Grade[]> {
    return apiClient.get<Grade[]>(ENDPOINTS.GRADES.LIST);
  }

  async getGradeById(id: string): Promise<Grade> {
    return apiClient.get<Grade>(ENDPOINTS.GRADES.BY_ID(id));
  }

  async getSubjectsInGrade(gradeId: string): Promise<Subject[]> {
    return apiClient.get<Subject[]>(ENDPOINTS.GRADES.SUBJECTS(gradeId));
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return apiClient.get<Subject[]>(ENDPOINTS.SUBJECTS.LIST);
  }

  async getSubjectById(id: string): Promise<Subject> {
    return apiClient.get<Subject>(ENDPOINTS.SUBJECTS.BY_ID(id));
  }
}

export const courseService = new CourseService();
export default courseService;
```

---

## Phase 7: AI Service Integration

### 7.1 Create AI Service Module

**File**: `frontend/src/services/api/ai.ts`

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

// Recommendation Types
export interface CourseRecommendation {
  course_id: string;
  title: string;
  score: number;
  reason: string;
  estimated_duration: number;
}

export interface RecommendationRequest {
  user_id: string;
  limit?: number;
  include_enrolled?: boolean;
}

export interface BehaviorTrackRequest {
  user_id: string;
  course_id: string;
  action_type: 'view' | 'enroll' | 'complete' | 'rate';
  action_value?: number;
  metadata?: Record<string, unknown>;
}

// Learning Path Types
export interface LearningPath {
  id: string;
  user_id: string;
  goal: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  courses: CourseRecommendation[];
  estimated_duration: number;
  created_at: string;
}

export interface GenerateLearningPathRequest {
  user_id: string;
  goal: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  available_hours_per_week?: number;
}

// Assessment Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  suggestions?: string[];
}

// Psychometric Types
export interface PsychometricAssessment {
  id: string;
  user_id: string;
  learning_style: string;
  aptitude: string;
  score: number;
  results: Record<string, unknown>;
  created_at: string;
}

export interface PsychometricRequest {
  user_id: string;
  answers: Record<string, unknown>[];
}

class AIService {
  // Recommendations
  async getCourseRecommendations(
    request: RecommendationRequest
  ): Promise<CourseRecommendation[]> {
    return apiClient.post<CourseRecommendation[]>(
      ENDPOINTS.AI.RECOMMENDATIONS.COURSES,
      request
    );
  }

  async trackBehavior(request: BehaviorTrackRequest): Promise<{ success: boolean }> {
    return apiClient.post(ENDPOINTS.AI.RECOMMENDATIONS.BEHAVIOR, request);
  }

  async getTrendingCourses(limit = 10): Promise<CourseRecommendation[]> {
    return apiClient.post<CourseRecommendation[]>(
      ENDPOINTS.AI.RECOMMENDATIONS.TRENDING,
      { limit }
    );
  }

  async getSimilarCourses(courseId: string): Promise<CourseRecommendation[]> {
    return apiClient.get<CourseRecommendation[]>(
      ENDPOINTS.AI.RECOMMENDATIONS.SIMILAR(courseId)
    );
  }

  // Learning Paths
  async generateLearningPath(
    request: GenerateLearningPathRequest
  ): Promise<LearningPath> {
    return apiClient.post<LearningPath>(
      ENDPOINTS.AI.TUTORING.LEARNING_PATH,
      request
    );
  }

  async getLearningPaths(userId: string): Promise<LearningPath[]> {
    return apiClient.get<LearningPath[]>(ENDPOINTS.AI.LEARNING_PATHS, {
      user_id: userId,
    });
  }

  // Assessments
  async generateQuiz(request: GenerateQuizRequest): Promise<QuizQuestion[]> {
    return apiClient.post<QuizQuestion[]>(
      ENDPOINTS.AI.ASSESSMENT.GENERATE_QUIZ,
      request
    );
  }

  // Chat/Tutoring
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>(ENDPOINTS.AI.CHAT, request);
  }

  async getChatHistory(conversationId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`${ENDPOINTS.AI.CHAT}/history/${conversationId}`);
  }

  // Psychometric Assessment
  async submitPsychometricAssessment(
    request: PsychometricRequest
  ): Promise<PsychometricAssessment> {
    return apiClient.post<PsychometricAssessment>(
      ENDPOINTS.AI.PSYCHOMETRIC.ASSESSMENT,
      request
    );
  }

  // Skill Tracking
  async trackSkill(
    userId: string,
    skillId: string,
    progress: number
  ): Promise<{ success: boolean }> {
    return apiClient.post(ENDPOINTS.AI.SKILLS.TRACK, {
      user_id: userId,
      skill_id: skillId,
      progress,
    });
  }

  // Analytics/Progress
  async getProgressAnalytics(userId: string): Promise<Record<string, unknown>> {
    return apiClient.get(ENDPOINTS.AI.ANALYTICS.PROGRESS, { user_id: userId });
  }
}

export const aiService = new AIService();
export default aiService;
```

---

## Phase 8: Context Updates

### 8.1 Update OnboardingContext to Use Real API

**File**: `frontend/src/contexts/OnboardingContext.tsx` (modifications)

```typescript
// Add imports
import onboardingService, {
  OnboardingFlow,
  OnboardingStatus,
} from '../services/api/onboarding';

// Update the context to fetch from API
const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch onboarding status on mount
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        setLoading(true);
        const status = await onboardingService.getStatus();
        const flow = await onboardingService.getFlow();

        // Update state based on API response
        setCurrentStep(flow.current_step);
        // Map completed steps to local state
        // ...
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load onboarding');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, []);

  // Update completeStep to call API
  const completeStep = async (stepName: string) => {
    try {
      const result = await onboardingService.completeStep(stepName);
      if (result.next_step) {
        // Navigate to next step
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete step');
    }
  };

  // ... rest of context implementation
};
```

### 8.2 Update RecommendationsContext

**File**: `frontend/src/contexts/RecommendationsContext.tsx` (modifications)

```typescript
// Add imports
import aiService from '../services/api/ai';
import { getCurrentUser } from '../utils/auth';

// Update to fetch from real API
const fetchRecommendations = async () => {
  const user = getCurrentUser();
  if (!user) return;

  try {
    setLoading(true);
    const recommendations = await aiService.getCourseRecommendations({
      user_id: user.id,
      limit: 10,
    });

    setRecommendations(recommendations.map(rec => ({
      id: rec.course_id,
      title: rec.title,
      relevanceScore: rec.score,
      reason: rec.reason,
      estimatedDuration: rec.estimated_duration,
      // ... map other fields
    })));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load recommendations');
  } finally {
    setLoading(false);
  }
};
```

---

## Phase 9: Component Integration Updates

### 9.1 Update Login Component

**File**: `frontend/src/components/auth/Login.tsx` (key changes)

```typescript
import { loginUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        // Navigate based on user role
        const role = result.user.role;
        if (role === 'student') {
          navigate('/student/dashboard');
        } else if (role === 'instructor') {
          navigate('/trainer/');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### 9.2 Update StudentDashboard to Fetch Real Data

**File**: `frontend/src/components/student/StudentDashboard.tsx` (key changes)

```typescript
import { useEffect, useState } from 'react';
import courseService, { Course } from '../../services/api/courses';
import aiService, { CourseRecommendation } from '../../services/api/ai';
import userService, { UserProfile } from '../../services/api/user';
import { getCurrentUser } from '../../utils/auth';

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all data in parallel
        const [coursesRes, recsRes, profileRes] = await Promise.all([
          courseService.getCourses(0, 10),
          aiService.getCourseRecommendations({ user_id: user.id, limit: 5 }),
          userService.getProfile(),
        ]);

        setCourses(coursesRes.items);
        setRecommendations(recsRes);
        setProfile(profileRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // ... rest of component using real data
};
```

---

## Phase 10: Real-Time WebSocket Integration

### 10.1 Update RealTimeContext

**File**: `frontend/src/contexts/RealTimeContext.tsx` (modifications)

```typescript
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// Message types from backend
interface WSMessage {
  type: string;
  data: unknown;
  timestamp: string;
}

const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = Number(import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS) || 5;

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Include token in WebSocket URL for authentication
    const wsUrl = `${WEBSOCKET_URL}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Attempt reconnection
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay = Number(import.meta.env.VITE_WS_RECONNECT_INTERVAL) || 3000;
        setTimeout(connect, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);
  }, []);

  const handleMessage = (message: WSMessage) => {
    switch (message.type) {
      case 'notification':
        // Handle notification
        break;
      case 'course_update':
        // Handle course update
        break;
      case 'progress_update':
        // Handle progress update
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  // ... rest of context
};
```

---

## Phase 11: Error Handling & Loading States

### 11.1 Create Global Error Handler

**File**: `frontend/src/components/common/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Send to error tracking service
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 11.2 Create Loading Component

**File**: `frontend/src/components/common/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
```

---

## Phase 12: Testing & Validation

### 12.1 API Integration Tests

**File**: `frontend/tests/api/auth.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication API Integration', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    const response = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'testpassword123',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('access_token');
    expect(data).toHaveProperty('refresh_token');
    expect(data).toHaveProperty('user');
  });

  test('should fail login with invalid credentials', async ({ request }) => {
    const response = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
  });
});
```

### 12.2 E2E Tests

**File**: `frontend/tests/e2e/login.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should complete login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'student@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect
    await expect(page).toHaveURL(/student\/dashboard/);

    // Verify dashboard loaded
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

---

## Implementation Checklist

### Phase 1: Environment Setup
- [ ] Update frontend `.env` with correct API URLs
- [ ] Verify backend CORS configuration
- [ ] Test connectivity between frontend and backend

### Phase 2: API Client
- [ ] Update `endpoints.ts` with all backend routes
- [ ] Enhance `client.ts` with token refresh logic
- [ ] Test API client configuration

### Phase 3: Authentication
- [ ] Create `auth.ts` service module
- [ ] Update `utils/auth.ts`
- [ ] Test login/register/logout flow

### Phase 4: User Service
- [ ] Create `user.ts` service module
- [ ] Test profile CRUD operations

### Phase 5: Onboarding
- [ ] Create `onboarding.ts` service module
- [ ] Update OnboardingContext
- [ ] Test onboarding flow

### Phase 6: Courses
- [ ] Create `courses.ts` service module
- [ ] Test course listing and details

### Phase 7: AI Services
- [ ] Create `ai.ts` service module
- [ ] Test recommendations and learning paths

### Phase 8: Context Updates
- [ ] Update all contexts to use real APIs
- [ ] Replace mock data with API calls

### Phase 9: Component Updates
- [ ] Update Login component
- [ ] Update Dashboard components
- [ ] Update all data-fetching components

### Phase 10: WebSocket
- [ ] Update RealTimeContext
- [ ] Test real-time updates

### Phase 11: Error Handling
- [ ] Implement ErrorBoundary
- [ ] Add loading states
- [ ] Test error scenarios

### Phase 12: Testing
- [ ] Write API integration tests
- [ ] Write E2E tests
- [ ] Run full test suite

---

## Quick Start Commands

```bash
# Start backend services
cd ~/Documents/TajiFanisi/backend/TajiConnectMain
docker-compose up -d

# Start frontend
cd ~/Documents/TajiFanisi/Taji/Tajiconnect/frontend
npm run dev

# Run tests
npm run test:e2e
```

---

## Service Mapping Reference

| Frontend Route | Backend Service | Port | Endpoint Prefix |
|---------------|-----------------|------|-----------------|
| /login, /register | User Service | 8001 | /api/v1/auth/* |
| /student/profile | User Service | 8001 | /api/v1/users/* |
| /onboarding/* | User Service | 8001 | /api/v1/onboarding/* |
| /student/courses | Course Service | 8002 | /api/v1/courses/* |
| /trainer/courses | Course Service | 8002 | /api/v1/courses/* |
| /student/assessments | AI Service | 8007 | /api/v1/ai/* |
| /student/learning-path | AI Service | 8007 | /api/v1/ai/learning-paths |
| /notifications | Notification Service | 8005 | /api/v1/notifications/* |
| /payments | Payment Service | 8006 | /api/v1/payments/* |
| /student/progress | Analytics Service | 8004 | /api/v1/analytics/* |

All requests go through the **API Gateway on port 8000** which routes to appropriate services.
