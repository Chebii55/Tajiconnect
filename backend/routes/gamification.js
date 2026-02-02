/**
 * Gamification API Routes
 *
 * Handles XP, levels, and gamification data endpoints.
 */

const express = require('express');

/**
 * XP Values Configuration
 */
const XP_VALUES = {
  LESSON_COMPLETE: 10,
  LESSON_FIRST_ATTEMPT_BONUS: 5,
  QUIZ_PASS: 25,
  QUIZ_PERFECT_BONUS: 25,
  DAILY_LOGIN: 5,
  COURSE_COMPLETE: 100,
  STREAK_MULTIPLIER_PER_DAY: 0.1,
  MAX_STREAK_MULTIPLIER: 1.0,
};

/**
 * Level calculation formula: XP = 100 * level^1.5
 */
function xpForLevel(level) {
  if (level <= 0) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate level from total XP
 */
function calculateLevel(totalXP) {
  if (totalXP <= 0) {
    return {
      level: 1,
      currentXP: 0,
      xpToNextLevel: xpForLevel(1),
      totalXP: 0,
      progressPercent: 0,
    };
  }

  let level = 1;
  let xpRemaining = totalXP;
  let xpNeeded = xpForLevel(level);
  const MAX_LEVEL = 100;

  while (xpRemaining >= xpNeeded && level < MAX_LEVEL) {
    xpRemaining -= xpNeeded;
    level++;
    xpNeeded = xpForLevel(level);
  }

  if (level >= MAX_LEVEL) {
    return {
      level: MAX_LEVEL,
      currentXP: xpRemaining,
      xpToNextLevel: 0,
      totalXP,
      progressPercent: 100,
    };
  }

  const progressPercent = Math.floor((xpRemaining / xpNeeded) * 100);

  return {
    level,
    currentXP: xpRemaining,
    xpToNextLevel: xpNeeded - xpRemaining,
    totalXP,
    progressPercent,
  };
}

/**
 * Apply streak bonus to XP
 */
function applyStreakBonus(baseXP, streakDays) {
  if (streakDays <= 0) return baseXP;

  const bonusMultiplier = Math.min(
    streakDays * XP_VALUES.STREAK_MULTIPLIER_PER_DAY,
    XP_VALUES.MAX_STREAK_MULTIPLIER
  );

  return Math.floor(baseXP * (1 + bonusMultiplier));
}

/**
 * Create gamification routes
 * @param {object} router - JSON Server router instance
 */
function createGamificationRoutes(router) {
  const gamificationRouter = express.Router();

  /**
   * GET /api/v1/gamification/xp
   * Get user's current XP and level information
   */
  gamificationRouter.get('/xp', (req, res) => {
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
        // Return default values for new user
        const levelInfo = calculateLevel(0);
        return res.json({
          success: true,
          data: {
            ...levelInfo,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            streakFreezes: 0,
          },
        });
      }

      const levelInfo = calculateLevel(gamificationData.totalXP);

      res.json({
        success: true,
        data: {
          ...levelInfo,
          currentStreak: gamificationData.currentStreak || 0,
          longestStreak: gamificationData.longestStreak || 0,
          lastActivityDate: gamificationData.lastActivityDate || null,
          streakFreezes: gamificationData.streakFreezes || 0,
        },
      });
    } catch (error) {
      console.error('Error getting XP data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve XP data',
      });
    }
  });

  /**
   * POST /api/v1/gamification/xp
   * Record XP gain for a user
   */
  gamificationRouter.post('/xp', (req, res) => {
    try {
      const { userId, amount, source, metadata = {} } = req.body;

      if (!userId || !amount || !source) {
        return res.status(400).json({
          success: false,
          message: 'userId, amount, and source are required',
        });
      }

      const db = router.db.getState();

      // Initialize gamification array if not exists
      if (!db.gamification) {
        db.gamification = [];
      }

      // Find or create user gamification data
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
          xpHistory: [],
        };
        db.gamification.push(gamificationData);
      }

      // Calculate final XP with streak bonus
      const finalAmount = applyStreakBonus(amount, gamificationData.currentStreak);
      const previousLevel = calculateLevel(gamificationData.totalXP).level;

      // Update XP
      gamificationData.totalXP += finalAmount;
      gamificationData.lastActivityDate = new Date().toISOString().split('T')[0];

      // Add to history
      gamificationData.xpHistory = gamificationData.xpHistory || [];
      gamificationData.xpHistory.unshift({
        amount: finalAmount,
        source,
        ...metadata,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 100 entries
      if (gamificationData.xpHistory.length > 100) {
        gamificationData.xpHistory = gamificationData.xpHistory.slice(0, 100);
      }

      // Calculate new level info
      const newLevelInfo = calculateLevel(gamificationData.totalXP);
      const didLevelUp = newLevelInfo.level > previousLevel;

      // Save to database
      router.db.setState(db);

      res.json({
        success: true,
        data: {
          xpEarned: finalAmount,
          source,
          ...newLevelInfo,
          didLevelUp,
          previousLevel: didLevelUp ? previousLevel : null,
          streakBonus: finalAmount - amount,
        },
      });
    } catch (error) {
      console.error('Error recording XP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record XP',
      });
    }
  });

  /**
   * GET /api/v1/gamification/xp/history
   * Get XP earning history for a user
   */
  gamificationRouter.get('/xp/history', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const source = req.query.source;
      const dateFrom = req.query.dateFrom;
      const dateTo = req.query.dateTo;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);

      if (!gamificationData || !gamificationData.xpHistory) {
        return res.json({
          success: true,
          data: {
            history: [],
            total: 0,
            totalXP: 0,
          },
        });
      }

      let history = [...gamificationData.xpHistory];

      // Apply filters
      if (source) {
        history = history.filter(h => h.source === source);
      }

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        history = history.filter(h => new Date(h.timestamp) >= fromDate);
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        history = history.filter(h => new Date(h.timestamp) <= toDate);
      }

      // Calculate total XP for filtered results
      const filteredTotalXP = history.reduce((sum, h) => sum + h.amount, 0);

      // Apply pagination
      const total = history.length;
      history = history.slice(offset, offset + limit);

      res.json({
        success: true,
        data: {
          history,
          total,
          totalXP: filteredTotalXP,
          pagination: {
            offset,
            limit,
            hasMore: offset + limit < total,
          },
        },
      });
    } catch (error) {
      console.error('Error getting XP history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve XP history',
      });
    }
  });

  /**
   * POST /api/v1/gamification/level-check
   * Check if user would level up with given XP
   */
  gamificationRouter.post('/level-check', (req, res) => {
    try {
      const { userId, xpToAdd } = req.body;

      if (!userId || xpToAdd === undefined) {
        return res.status(400).json({
          success: false,
          message: 'userId and xpToAdd are required',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);
      const currentTotalXP = gamificationData?.totalXP || 0;

      const currentLevel = calculateLevel(currentTotalXP);
      const projectedLevel = calculateLevel(currentTotalXP + xpToAdd);

      const wouldLevelUp = projectedLevel.level > currentLevel.level;
      const levelsGained = projectedLevel.level - currentLevel.level;

      res.json({
        success: true,
        data: {
          currentLevel: currentLevel.level,
          projectedLevel: projectedLevel.level,
          wouldLevelUp,
          levelsGained: Math.max(0, levelsGained),
          currentProgress: currentLevel.progressPercent,
          projectedProgress: projectedLevel.progressPercent,
        },
      });
    } catch (error) {
      console.error('Error checking level:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check level',
      });
    }
  });

  /**
   * POST /api/v1/gamification/daily-login
   * Record daily login and update streak
   */
  gamificationRouter.post('/daily-login', (req, res) => {
    try {
      const { userId } = req.body;

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
          xpHistory: [],
        };
        db.gamification.push(gamificationData);
      }

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = gamificationData.lastActivityDate;

      // Check if already logged in today
      if (lastActivity === today) {
        return res.json({
          success: true,
          data: {
            message: 'Already logged in today',
            currentStreak: gamificationData.currentStreak,
            xpEarned: 0,
          },
        });
      }

      // Check if streak continues
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      if (lastActivity === yesterdayStr) {
        newStreak = gamificationData.currentStreak + 1;
      }

      // Calculate XP for daily login
      let xpEarned = XP_VALUES.DAILY_LOGIN;

      // Milestone bonuses
      if (newStreak === 5) xpEarned += 25;
      else if (newStreak === 10) xpEarned += 50;
      else if (newStreak === 30) xpEarned += 150;
      else if (newStreak === 100) xpEarned += 500;
      else if (newStreak > 0 && newStreak % 7 === 0) xpEarned += 15;

      // Update gamification data
      gamificationData.currentStreak = newStreak;
      gamificationData.longestStreak = Math.max(gamificationData.longestStreak, newStreak);
      gamificationData.lastActivityDate = today;
      gamificationData.totalXP += xpEarned;

      // Add to history
      gamificationData.xpHistory = gamificationData.xpHistory || [];
      gamificationData.xpHistory.unshift({
        amount: xpEarned,
        source: 'daily_login',
        streakDay: newStreak,
        timestamp: new Date().toISOString(),
      });

      router.db.setState(db);

      const levelInfo = calculateLevel(gamificationData.totalXP);

      res.json({
        success: true,
        data: {
          currentStreak: newStreak,
          longestStreak: gamificationData.longestStreak,
          xpEarned,
          ...levelInfo,
          isNewRecord: newStreak > gamificationData.longestStreak,
        },
      });
    } catch (error) {
      console.error('Error recording daily login:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record daily login',
      });
    }
  });

  return gamificationRouter;
}

module.exports = { createGamificationRoutes, XP_VALUES, calculateLevel, applyStreakBonus };
