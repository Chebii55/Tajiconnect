/**
 * Badge API Routes
 *
 * Handles badge definitions, user unlocks, and progress tracking.
 */

const express = require('express');

/**
 * Badge definitions (18 total)
 * Note: Full definitions with criteria are also stored in frontend for client-side checks
 */
const BADGE_DEFINITIONS = [
  // Learning Milestones (5)
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', rarity: 'common', category: 'learning', hidden: false, xpReward: 25 },
  { id: 'course-conqueror', name: 'Course Conqueror', description: 'Complete your first course', rarity: 'rare', category: 'learning', hidden: false, xpReward: 75 },
  { id: 'polyglot-path', name: 'Polyglot Path', description: 'Start learning a second language or skill track', rarity: 'rare', category: 'learning', hidden: false, xpReward: 75 },
  { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Complete 10 courses', rarity: 'epic', category: 'learning', hidden: false, xpReward: 150 },
  { id: 'master-scholar', name: 'Master Scholar', description: 'Complete 25 courses', rarity: 'legendary', category: 'learning', hidden: false, xpReward: 300 },

  // Consistency (4)
  { id: 'getting-started', name: 'Getting Started', description: 'Maintain a 3-day learning streak', rarity: 'common', category: 'consistency', hidden: false, xpReward: 25 },
  { id: 'week-warrior', name: 'Week Warrior', description: 'Maintain a 7-day learning streak', rarity: 'rare', category: 'consistency', hidden: false, xpReward: 75 },
  { id: 'month-master', name: 'Month Master', description: 'Maintain a 30-day learning streak', rarity: 'epic', category: 'consistency', hidden: false, xpReward: 150 },
  { id: 'century-club', name: 'Century Club', description: 'Maintain a 100-day learning streak', rarity: 'legendary', category: 'consistency', hidden: false, xpReward: 300 },

  // Performance (5)
  { id: 'quick-learner', name: 'Quick Learner', description: 'Score 100% on 3 quizzes', rarity: 'common', category: 'performance', hidden: false, xpReward: 25 },
  { id: 'sharp-mind', name: 'Sharp Mind', description: 'Score 100% on 10 quizzes', rarity: 'rare', category: 'performance', hidden: false, xpReward: 75 },
  { id: 'flawless', name: 'Flawless', description: 'Complete a course with 100% on all quizzes', rarity: 'epic', category: 'performance', hidden: false, xpReward: 150 },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a lesson in under 3 minutes', rarity: 'rare', category: 'performance', hidden: false, xpReward: 75 },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete 10 lessons after 10pm', rarity: 'common', category: 'performance', hidden: true, xpReward: 25 },

  // Engagement (4)
  { id: 'early-bird', name: 'Early Bird', description: 'Login before 6am, 5 times', rarity: 'common', category: 'engagement', hidden: true, xpReward: 25 },
  { id: 'level-10', name: 'Rising Star', description: 'Reach level 10', rarity: 'rare', category: 'engagement', hidden: false, xpReward: 75 },
  { id: 'level-25', name: 'Veteran Learner', description: 'Reach level 25', rarity: 'epic', category: 'engagement', hidden: false, xpReward: 150 },
  { id: 'level-40', name: 'Learning Legend', description: 'Reach level 40', rarity: 'legendary', category: 'engagement', hidden: false, xpReward: 300 },
];

/**
 * Get badge definition by ID
 */
function getBadgeById(badgeId) {
  return BADGE_DEFINITIONS.find(b => b.id === badgeId);
}

/**
 * Create badge routes
 * @param {object} router - JSON Server router instance
 */
function createBadgeRoutes(router) {
  const badgeRouter = express.Router();

  /**
   * GET /api/v1/badges
   * Get all badge definitions
   * Query params: category, rarity, showHidden
   */
  badgeRouter.get('/', (req, res) => {
    try {
      const { category, rarity, showHidden } = req.query;
      let badges = [...BADGE_DEFINITIONS];

      // Filter by category
      if (category) {
        badges = badges.filter(b => b.category === category);
      }

      // Filter by rarity
      if (rarity) {
        badges = badges.filter(b => b.rarity === rarity);
      }

      // Filter hidden badges (unless showHidden=true)
      if (showHidden !== 'true') {
        badges = badges.filter(b => !b.hidden);
      }

      res.json({
        success: true,
        data: badges,
        total: badges.length,
      });
    } catch (error) {
      console.error('Error getting badges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve badges',
      });
    }
  });

  /**
   * GET /api/v1/badges/user
   * Get user's unlocked badges with unlock dates
   */
  badgeRouter.get('/user', (req, res) => {
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

      if (!gamificationData || !gamificationData.unlockedBadges) {
        return res.json({
          success: true,
          data: {
            unlockedBadges: [],
            total: 0,
          },
        });
      }

      // Get full badge details for unlocked badges
      const unlockedBadges = gamificationData.unlockedBadges
        .map(badgeId => {
          const badge = getBadgeById(typeof badgeId === 'string' ? badgeId : badgeId.id);
          if (!badge) return null;

          return {
            ...badge,
            unlockedAt: typeof badgeId === 'object' ? badgeId.unlockedAt : null,
          };
        })
        .filter(Boolean);

      res.json({
        success: true,
        data: {
          unlockedBadges,
          total: unlockedBadges.length,
        },
      });
    } catch (error) {
      console.error('Error getting user badges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user badges',
      });
    }
  });

  /**
   * POST /api/v1/badges/unlock
   * Record a badge unlock for a user
   */
  badgeRouter.post('/unlock', (req, res) => {
    try {
      const { userId, badgeId } = req.body;

      if (!userId || !badgeId) {
        return res.status(400).json({
          success: false,
          message: 'userId and badgeId are required',
        });
      }

      const badge = getBadgeById(badgeId);
      if (!badge) {
        return res.status(404).json({
          success: false,
          message: 'Badge not found',
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
          unlockedBadges: [],
        };
        db.gamification.push(gamificationData);
      }

      // Initialize unlockedBadges array if not exists
      if (!gamificationData.unlockedBadges) {
        gamificationData.unlockedBadges = [];
      }

      // Check if already unlocked
      const alreadyUnlocked = gamificationData.unlockedBadges.some(
        b => (typeof b === 'string' ? b : b.id) === badgeId
      );

      if (alreadyUnlocked) {
        return res.json({
          success: true,
          data: {
            badge,
            alreadyUnlocked: true,
            xpReward: 0,
          },
          message: 'Badge was already unlocked',
        });
      }

      // Record unlock
      const unlockedAt = new Date().toISOString();
      gamificationData.unlockedBadges.push({
        id: badgeId,
        unlockedAt,
      });

      // Award XP for badge
      gamificationData.totalXP += badge.xpReward;

      // Add to XP history
      gamificationData.xpHistory = gamificationData.xpHistory || [];
      gamificationData.xpHistory.unshift({
        amount: badge.xpReward,
        source: 'badge',
        badgeId,
        badgeName: badge.name,
        timestamp: unlockedAt,
      });

      // Keep only last 100 entries
      if (gamificationData.xpHistory.length > 100) {
        gamificationData.xpHistory = gamificationData.xpHistory.slice(0, 100);
      }

      // Save to database
      router.db.setState(db);

      res.json({
        success: true,
        data: {
          badge: {
            ...badge,
            unlockedAt,
          },
          xpReward: badge.xpReward,
          totalXP: gamificationData.totalXP,
          alreadyUnlocked: false,
        },
        message: 'Badge unlocked successfully',
      });
    } catch (error) {
      console.error('Error unlocking badge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unlock badge',
      });
    }
  });

  /**
   * GET /api/v1/badges/:id/progress
   * Get progress toward a specific badge
   */
  badgeRouter.get('/:id/progress', (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const badge = getBadgeById(id);
      if (!badge) {
        return res.status(404).json({
          success: false,
          message: 'Badge not found',
        });
      }

      const db = router.db.getState();
      const gamificationData = db.gamification?.find(g => g.userId === userId);

      // Check if already unlocked
      const isUnlocked = gamificationData?.unlockedBadges?.some(
        b => (typeof b === 'string' ? b : b.id) === id
      );

      if (isUnlocked) {
        const unlockedBadge = gamificationData.unlockedBadges.find(
          b => (typeof b === 'string' ? b : b.id) === id
        );

        return res.json({
          success: true,
          data: {
            badgeId: id,
            isUnlocked: true,
            unlockedAt: typeof unlockedBadge === 'object' ? unlockedBadge.unlockedAt : null,
            progressPercent: 100,
            currentValue: 1,
            targetValue: 1,
          },
        });
      }

      // Calculate progress based on badge criteria
      // This is a simplified version - full progress tracking happens on frontend
      const progress = calculateBadgeProgress(id, gamificationData, db);

      res.json({
        success: true,
        data: {
          badgeId: id,
          isUnlocked: false,
          progressPercent: progress.percent,
          currentValue: progress.current,
          targetValue: progress.target,
        },
      });
    } catch (error) {
      console.error('Error getting badge progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve badge progress',
      });
    }
  });

  /**
   * GET /api/v1/badges/stats
   * Get badge statistics for a user
   */
  badgeRouter.get('/stats', (req, res) => {
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

      const unlockedIds = gamificationData?.unlockedBadges?.map(
        b => (typeof b === 'string' ? b : b.id)
      ) || [];

      const visibleBadges = BADGE_DEFINITIONS.filter(b => !b.hidden);
      const total = visibleBadges.length;
      const unlocked = visibleBadges.filter(b => unlockedIds.includes(b.id)).length;

      // Count by rarity
      const byRarity = {
        common: { total: 0, unlocked: 0 },
        rare: { total: 0, unlocked: 0 },
        epic: { total: 0, unlocked: 0 },
        legendary: { total: 0, unlocked: 0 },
      };

      // Count by category
      const byCategory = {
        learning: { total: 0, unlocked: 0 },
        consistency: { total: 0, unlocked: 0 },
        performance: { total: 0, unlocked: 0 },
        engagement: { total: 0, unlocked: 0 },
      };

      visibleBadges.forEach(badge => {
        byRarity[badge.rarity].total++;
        byCategory[badge.category].total++;

        if (unlockedIds.includes(badge.id)) {
          byRarity[badge.rarity].unlocked++;
          byCategory[badge.category].unlocked++;
        }
      });

      res.json({
        success: true,
        data: {
          total,
          unlocked,
          locked: total - unlocked,
          progressPercent: Math.round((unlocked / total) * 100),
          byRarity,
          byCategory,
        },
      });
    } catch (error) {
      console.error('Error getting badge stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve badge stats',
      });
    }
  });

  return badgeRouter;
}

/**
 * Calculate badge progress (simplified server-side version)
 */
function calculateBadgeProgress(badgeId, gamificationData, db) {
  const defaultProgress = { current: 0, target: 1, percent: 0 };

  if (!gamificationData) {
    return defaultProgress;
  }

  // Map badge IDs to their metrics and thresholds
  const badgeMetrics = {
    // Streak badges
    'getting-started': { metric: 'currentStreak', threshold: 3 },
    'week-warrior': { metric: 'currentStreak', threshold: 7 },
    'month-master': { metric: 'currentStreak', threshold: 30 },
    'century-club': { metric: 'currentStreak', threshold: 100 },

    // Level badges
    'level-10': { metric: 'level', threshold: 10 },
    'level-25': { metric: 'level', threshold: 25 },
    'level-40': { metric: 'level', threshold: 40 },
  };

  const config = badgeMetrics[badgeId];
  if (!config) {
    return defaultProgress;
  }

  let currentValue = 0;

  switch (config.metric) {
    case 'currentStreak':
      currentValue = gamificationData.currentStreak || 0;
      break;
    case 'level':
      // Calculate level from XP
      currentValue = calculateLevelFromXP(gamificationData.totalXP || 0);
      break;
    default:
      currentValue = 0;
  }

  const percent = Math.min(100, Math.round((currentValue / config.threshold) * 100));

  return {
    current: currentValue,
    target: config.threshold,
    percent,
  };
}

/**
 * Calculate level from total XP (same formula as frontend)
 */
function calculateLevelFromXP(totalXP) {
  if (totalXP <= 0) return 1;

  let level = 1;
  let xpRemaining = totalXP;
  let xpNeeded = Math.floor(100 * Math.pow(level, 1.5));

  while (xpRemaining >= xpNeeded && level < 100) {
    xpRemaining -= xpNeeded;
    level++;
    xpNeeded = Math.floor(100 * Math.pow(level, 1.5));
  }

  return level;
}

module.exports = { createBadgeRoutes, BADGE_DEFINITIONS, getBadgeById };
