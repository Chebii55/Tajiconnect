/**
 * Gamification API Service
 *
 * Handles all gamification-related API calls including XP, levels, and history.
 */

import { apiClient } from './client'
import type { XPSource, XPEarnedEvent, LevelInfo } from '../../types/gamification'

/**
 * API Response types
 */
interface XPDataResponse {
  success: boolean
  data: LevelInfo & {
    currentStreak: number
    longestStreak: number
    lastActivityDate: string | null
    streakFreezes: number
  }
}

interface XPRecordResponse {
  success: boolean
  data: {
    xpEarned: number
    source: XPSource
    level: number
    currentXP: number
    xpToNextLevel: number
    totalXP: number
    progressPercent: number
    didLevelUp: boolean
    previousLevel: number | null
    streakBonus: number
  }
}

interface XPHistoryResponse {
  success: boolean
  data: {
    history: XPEarnedEvent[]
    total: number
    totalXP: number
    pagination: {
      offset: number
      limit: number
      hasMore: boolean
    }
  }
}

interface LevelCheckResponse {
  success: boolean
  data: {
    currentLevel: number
    projectedLevel: number
    wouldLevelUp: boolean
    levelsGained: number
    currentProgress: number
    projectedProgress: number
  }
}

interface DailyLoginResponse {
  success: boolean
  data: {
    currentStreak: number
    longestStreak: number
    xpEarned: number
    level: number
    currentXP: number
    xpToNextLevel: number
    totalXP: number
    progressPercent: number
    isNewRecord: boolean
  }
}

/**
 * Gamification API endpoints
 */
const ENDPOINTS = {
  XP: '/api/v1/gamification/xp',
  XP_HISTORY: '/api/v1/gamification/xp/history',
  LEVEL_CHECK: '/api/v1/gamification/level-check',
  DAILY_LOGIN: '/api/v1/gamification/daily-login',
}

/**
 * Gamification Service
 */
export const gamificationService = {
  /**
   * Get user's current XP and level information
   */
  async getXPData(userId: string): Promise<XPDataResponse['data']> {
    const response = await apiClient.get<XPDataResponse>(ENDPOINTS.XP, { userId })
    return response.data
  },

  /**
   * Record XP gain for a user
   */
  async recordXP(
    userId: string,
    amount: number,
    source: XPSource,
    metadata?: { lessonId?: string; courseId?: string }
  ): Promise<XPRecordResponse['data']> {
    const response = await apiClient.post<XPRecordResponse>(ENDPOINTS.XP, {
      userId,
      amount,
      source,
      metadata,
    })
    return response.data
  },

  /**
   * Get XP earning history
   */
  async getXPHistory(
    userId: string,
    options?: {
      limit?: number
      offset?: number
      source?: XPSource
      dateFrom?: string
      dateTo?: string
    }
  ): Promise<XPHistoryResponse['data']> {
    const response = await apiClient.get<XPHistoryResponse>(ENDPOINTS.XP_HISTORY, {
      userId,
      ...options,
    })
    return response.data
  },

  /**
   * Check if adding XP would cause a level up
   */
  async checkLevelUp(userId: string, xpToAdd: number): Promise<LevelCheckResponse['data']> {
    const response = await apiClient.post<LevelCheckResponse>(ENDPOINTS.LEVEL_CHECK, {
      userId,
      xpToAdd,
    })
    return response.data
  },

  /**
   * Record daily login and update streak
   */
  async recordDailyLogin(userId: string): Promise<DailyLoginResponse['data']> {
    const response = await apiClient.post<DailyLoginResponse>(ENDPOINTS.DAILY_LOGIN, {
      userId,
    })
    return response.data
  },
}

export default gamificationService
