/**
 * Streak API Routes
 *
 * Handles daily learning streak tracking, freeze management,
 * and streak-based rewards.
 */

const express = require('express');

/**
 * Streak configuration
 */
const STREAK_CONFIG = {
  MAX_FREEZES: 5,
  WARNING_HOUR: 20,
  FREEZE_RECOVERY_HOURS: 24,
};

/**
 * Streak milestones and rewards
 */
const STREAK_MILESTONES = {
  7: {
    title: 'Week Warrior!',
    freezeReward: 1,
    badgeId: 'week-warrior',
    xpBonus: 50,
  },
  30: {
    title: 'Month Master!',
    freezeReward: 2,
    badgeId: 'month-master',
    xpBonus: 150,
  },
  100: {
    title: 'Century Club!',
    freezeReward: 5,
    badgeId: 'centurion',
    xpBonus: 500,
  },
};

/**
 * XP bonus tiers based on streak length
 */
const STREAK_XP_BONUS_TIERS = [
  { minDays: 100, bonusPercent: 100 },
  { minDays: 30, bonusPercent: 50 },
  { minDays: 14, bonusPercent: 25 },
  { minDays: 7, bonusPercent: 10 },
  { minDays: 1, bonusPercent: 0 },
];

/**
 * Get XP bonus percentage for a streak length
 */
function getStreakBonusPercent(streakDays) {
  for (const tier of STREAK_XP_BONUS_TIERS) {
    if (streakDays >= tier.minDays) {
      return tier.bonusPercent;
    }
  }
  return 0;
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date string in YYYY-MM-DD format
 */
function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Check if a date string is today
 */
function isToday(dateString) {
  if (!dateString) return false;
  return dateString === getTodayDateString();
}

/**
 * Check if a date string is yesterday
 */
function isYesterday(dateString) {
  if (!dateString) return false;
  return dateString === getYesterdayDateString();
}

/**
 * Create streak routes
 * @param {object} router - JSON Server router instance
 */
function createStreakRoutes(router) {
  const streakRouter = express.Router();

  /**
   * GET /api/v1/streaks
   * Get user's current streak status
   */
  streakRouter.get('/', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);

      if (!gamificationData) {
        return res.json({
          success: true,
          data: {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            streakFreezes: 0,
            isAtRisk: false,
            hasActivityToday: false,
            xpBonusPercent: 0,
            nextMilestone: 7,
            daysUntilMilestone: 7,
          },
        });
      }

      const today = getTodayDateString();
      const hasActivityToday = gamificationData.lastActivityDate === today;
      const currentHour = new Date().getHours();
      const isAtRisk = !hasActivityToday &&
                       currentHour >= STREAK_CONFIG.WARNING_HOUR &&
                       gamificationData.currentStreak > 0;

      // Calculate next milestone
      const milestones = Object.keys(STREAK_MILESTONES).map(Number).sort((a, b) => a - b);
      let nextMilestone = null;
      let daysUntilMilestone = null;

      for (const milestone of milestones) {
        if (milestone > gamificationData.currentStreak) {
          nextMilestone = milestone;
          daysUntilMilestone = milestone - gamificationData.currentStreak;
          break;
        }
      }

      res.json({
        success: true,
        data: {
          currentStreak: gamificationData.currentStreak || 0,
          longestStreak: gamificationData.longestStreak || 0,
          lastActivityDate: gamificationData.lastActivityDate || null,
          streakFreezes: gamificationData.streakFreezes || 0,
          freezeActiveDate: gamificationData.freezeActiveDate || null,
          isAtRisk,
          hasActivityToday,
          xpBonusPercent: getStreakBonusPercent(gamificationData.currentStreak || 0),
          nextMilestone,
          daysUntilMilestone,
        },
      });
    } catch (error) {
      console.error('Error getting streak status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve streak status',
      });
    }
  });

  /**
   * POST /api/v1/streaks/activity
   * Record daily activity and update streak
   */
  streakRouter.post('/activity', (req, res) => {
    try {
      const { userId, activityType = 'lesson' } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required',
        });
      }

      const db = router.db.getState();

      if (!db.gamification) {
        db.gamification = [];
      }

      let gamificationData = db.gamification.find(g => g.userId === userId);

      if (!gamificationData) {
        gamificationData = {
          id: Date.now().toString(),
          userId,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakFreezes: 0,
          freezeActiveDate: null,
          xpHistory: [],
          unlockedBadges: [],
        };
        db.gamification.push(gamificationData);
      }

      const today = getTodayDateString();
      const previousStreak = gamificationData.currentStreak || 0;

      // Check if already active today
      if (isToday(gamificationData.lastActivityDate)) {
        return res.json({
          success: true,
          data: {
            message: 'Activity already recorded today',
            newStreak: gamificationData.currentStreak,
            previousStreak,
            isNewRecord: false,
            milestone: null,
            freezesAwarded: 0,
            xpBonusPercent: getStreakBonusPercent(gamificationData.currentStreak),
          },
        });
      }

      // Calculate new streak
      let newStreak = 1;

      if (isYesterday(gamificationData.lastActivityDate)) {
        // Continue streak from yesterday
        newStreak = previousStreak + 1;
      } else if (
        gamificationData.freezeActiveDate &&
        isYesterday(gamificationData.freezeActiveDate)
      ) {
        // Freeze was used yesterday, continue streak
        newStreak = previousStreak + 1;
      }

      // Check for milestone
      let milestone = null;
      let freezesAwarded = 0;
      let badgeAwarded = null;
      let milestoneXP = 0;

      if (STREAK_MILESTONES[newStreak]) {
        milestone = newStreak;
        freezesAwarded = STREAK_MILESTONES[newStreak].freezeReward;
        badgeAwarded = STREAK_MILESTONES[newStreak].badgeId;
        milestoneXP = STREAK_MILESTONES[newStreak].xpBonus;
      }

      // Update data
      const isNewRecord = newStreak > (gamificationData.longestStreak || 0);

      gamificationData.currentStreak = newStreak;
      gamificationData.longestStreak = Math.max(
        gamificationData.longestStreak || 0,
        newStreak
      );
      gamificationData.lastActivityDate = today;
      gamificationData.streakFreezes = Math.min(
        (gamificationData.streakFreezes || 0) + freezesAwarded,
        STREAK_CONFIG.MAX_FREEZES
      );
      gamificationData.freezeActiveDate = null; // Clear freeze

      // Add milestone XP
      if (milestoneXP > 0) {
        gamificationData.totalXP = (gamificationData.totalXP || 0) + milestoneXP;
        gamificationData.xpHistory = gamificationData.xpHistory || [];
        gamificationData.xpHistory.unshift({
          amount: milestoneXP,
          source: 'streak_milestone',
          milestone: newStreak,
          timestamp: new Date().toISOString(),
        });
      }

      // Add badge if awarded
      if (badgeAwarded && !gamificationData.unlockedBadges?.includes(badgeAwarded)) {
        gamificationData.unlockedBadges = gamificationData.unlockedBadges || [];
        gamificationData.unlockedBadges.push(badgeAwarded);
      }

      // Save changes
      router.db.setState(db);

      res.json({
        success: true,
        data: {
          newStreak,
          previousStreak,
          isNewRecord,
          milestone,
          freezesAwarded,
          badgeAwarded,
          milestoneXP,
          xpBonusPercent: getStreakBonusPercent(newStreak),
          currentFreezes: gamificationData.streakFreezes,
        },
      });
    } catch (error) {
      console.error('Error recording activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record activity',
      });
    }
  });

  /**
   * POST /api/v1/streaks/freeze
   * Use a streak freeze
   */
  streakRouter.post('/freeze', (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);

      if (!gamificationData) {
        return res.status(404).json({
          success: false,
          message: 'User gamification data not found',
        });
      }

      // Validate freeze can be used
      const today = getTodayDateString();

      if (isToday(gamificationData.lastActivityDate)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot use freeze - activity already recorded today',
        });
      }

      if ((gamificationData.streakFreezes || 0) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No freezes available',
        });
      }

      if ((gamificationData.currentStreak || 0) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No streak to protect',
        });
      }

      if (gamificationData.freezeActiveDate === today) {
        return res.status(400).json({
          success: false,
          message: 'Freeze already used today',
        });
      }

      // Use freeze
      gamificationData.streakFreezes -= 1;
      gamificationData.freezeActiveDate = today;

      router.db.setState(db);

      res.json({
        success: true,
        data: {
          message: 'Freeze activated successfully',
          remainingFreezes: gamificationData.streakFreezes,
          streakProtected: gamificationData.currentStreak,
          freezeActiveDate: today,
        },
      });
    } catch (error) {
      console.error('Error using freeze:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to use freeze',
      });
    }
  });

  /**
   * GET /api/v1/streaks/history
   * Get streak history for a user
   */
  streakRouter.get('/history', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const limit = parseInt(req.query.limit) || 30;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);

      if (!gamificationData) {
        return res.json({
          success: true,
          data: {
            history: [],
            currentStreak: 0,
            longestStreak: 0,
            totalActiveDays: 0,
          },
        });
      }

      // Extract streak-related entries from XP history
      const streakHistory = (gamificationData.xpHistory || [])
        .filter(entry =>
          entry.source === 'daily_login' ||
          entry.source === 'streak_milestone'
        )
        .slice(0, limit);

      res.json({
        success: true,
        data: {
          history: streakHistory,
          currentStreak: gamificationData.currentStreak || 0,
          longestStreak: gamificationData.longestStreak || 0,
          totalActiveDays: streakHistory.filter(h => h.source === 'daily_login').length,
        },
      });
    } catch (error) {
      console.error('Error getting streak history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve streak history',
      });
    }
  });

  /**
   * POST /api/v1/streaks/check
   * Check and potentially break streak (called on app load)
   */
  streakRouter.post('/check', (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required',
        });
      }

      const db = router.db.getState();
      let gamificationData = db.gamification?.find(g => g.userId === userId);

      if (!gamificationData) {
        return res.json({
          success: true,
          data: {
            streakBroken: false,
            currentStreak: 0,
          },
        });
      }

      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();
      const lastActivity = gamificationData.lastActivityDate;
      const freezeActive = gamificationData.freezeActiveDate;

      // Check if streak should be broken
      let streakBroken = false;
      let previousStreak = 0;

      if (
        lastActivity !== today &&
        lastActivity !== yesterday &&
        freezeActive !== yesterday &&
        (gamificationData.currentStreak || 0) > 0
      ) {
        // Streak is broken
        streakBroken = true;
        previousStreak = gamificationData.currentStreak;
        gamificationData.currentStreak = 0;
        gamificationData.freezeActiveDate = null;

        router.db.setState(db);
      }

      res.json({
        success: true,
        data: {
          streakBroken,
          previousStreak: streakBroken ? previousStreak : null,
          currentStreak: gamificationData.currentStreak,
          longestStreak: gamificationData.longestStreak,
        },
      });
    } catch (error) {
      console.error('Error checking streak:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check streak',
      });
    }
  });

  /**
   * GET /api/v1/streaks/milestones
   * Get milestone information
   */
  streakRouter.get('/milestones', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);
      const currentStreak = gamificationData?.currentStreak || 0;

      const milestones = Object.entries(STREAK_MILESTONES).map(([days, info]) => ({
        days: parseInt(days),
        ...info,
        achieved: currentStreak >= parseInt(days),
        daysUntil: Math.max(0, parseInt(days) - currentStreak),
      }));

      res.json({
        success: true,
        data: {
          milestones,
          currentStreak,
          xpBonusTiers: STREAK_XP_BONUS_TIERS,
        },
      });
    } catch (error) {
      console.error('Error getting milestones:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve milestones',
      });
    }
  });

  return streakRouter;
}

module.exports = {
  createStreakRoutes,
  STREAK_CONFIG,
  STREAK_MILESTONES,
  STREAK_XP_BONUS_TIERS,
  getStreakBonusPercent,
};
