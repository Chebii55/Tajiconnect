/**
 * Goals API Routes
 *
 * Handles daily learning goals, progress tracking, and goal streaks.
 */

const express = require('express');

/**
 * Goal configuration defaults
 */
const GOAL_CONFIG = {
  MIN_DAILY_GOAL: 1,
  MAX_DAILY_GOAL: 10,
  DEFAULT_DAILY_GOAL: 3,
  GOAL_COMPLETION_BONUS_XP: 25,
  STREAK_MILESTONE_BONUSES: {
    7: 50,   // 1 week
    14: 75,  // 2 weeks
    30: 150, // 1 month
    60: 300, // 2 months
    100: 500 // 100 days
  }
};

/**
 * Get today's date string in ISO format (YYYY-MM-DD)
 */
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if a date is yesterday
 */
function isYesterday(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * Create goals routes
 * @param {object} router - JSON Server router instance
 */
function createGoalsRoutes(router) {
  const goalsRouter = express.Router();

  /**
   * GET /api/v1/goals/daily
   * Get today's goal progress for a user
   */
  goalsRouter.get('/daily', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const goalsData = db.goals?.find(g => g.userId === userId);

      const today = getTodayString();

      if (!goalsData) {
        // Return default values for new user
        return res.json({
          success: true,
          data: {
            date: today,
            dailyGoal: GOAL_CONFIG.DEFAULT_DAILY_GOAL,
            completedToday: 0,
            lessonsCompleted: [],
            goalMet: false,
            exceededBy: 0,
            goalStreak: {
              current: 0,
              longest: 0,
              lastGoalMetDate: null,
              streakStartDate: null,
            },
            timeCommitment: 'flexible',
          },
        });
      }

      // Get today's progress
      const todayProgress = goalsData.dailyProgress?.find(p => p.date === today) || {
        date: today,
        completed: 0,
        lessonsCompleted: [],
        goalMet: false,
        exceededBy: 0,
      };

      res.json({
        success: true,
        data: {
          date: today,
          dailyGoal: goalsData.dailyGoal || GOAL_CONFIG.DEFAULT_DAILY_GOAL,
          completedToday: todayProgress.completed,
          lessonsCompleted: todayProgress.lessonsCompleted,
          goalMet: todayProgress.goalMet,
          exceededBy: todayProgress.exceededBy,
          goalStreak: {
            current: goalsData.goalStreak?.current || 0,
            longest: goalsData.goalStreak?.longest || 0,
            lastGoalMetDate: goalsData.goalStreak?.lastGoalMetDate || null,
            streakStartDate: goalsData.goalStreak?.streakStartDate || null,
          },
          timeCommitment: goalsData.timeCommitment || 'flexible',
        },
      });
    } catch (error) {
      console.error('Error getting daily goal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve daily goal data',
      });
    }
  });

  /**
   * PUT /api/v1/goals/daily
   * Update daily goal target
   */
  goalsRouter.put('/daily', (req, res) => {
    try {
      const { userId, dailyGoal, timeCommitment } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      // Validate daily goal
      const goal = Math.max(
        GOAL_CONFIG.MIN_DAILY_GOAL,
        Math.min(GOAL_CONFIG.MAX_DAILY_GOAL, parseInt(dailyGoal) || GOAL_CONFIG.DEFAULT_DAILY_GOAL)
      );

      // Validate time commitment
      const validCommitments = ['short', 'medium', 'flexible'];
      const commitment = validCommitments.includes(timeCommitment)
        ? timeCommitment
        : 'flexible';

      const db = router.db.getState();

      // Initialize goals array if not exists
      if (!db.goals) {
        db.goals = [];
      }

      // Find or create user goals data
      let goalsData = db.goals.find(g => g.userId === userId);

      if (!goalsData) {
        goalsData = {
          id: Date.now().toString(),
          userId,
          dailyGoal: goal,
          timeCommitment: commitment,
          goalStreak: {
            current: 0,
            longest: 0,
            lastGoalMetDate: null,
            streakStartDate: null,
          },
          dailyProgress: [],
        };
        db.goals.push(goalsData);
      } else {
        goalsData.dailyGoal = goal;
        goalsData.timeCommitment = commitment;
      }

      router.db.setState(db);

      res.json({
        success: true,
        data: {
          dailyGoal: goal,
          timeCommitment: commitment,
          message: 'Daily goal updated successfully',
        },
      });
    } catch (error) {
      console.error('Error updating daily goal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update daily goal',
      });
    }
  });

  /**
   * POST /api/v1/goals/complete
   * Record a lesson completion toward daily goal
   */
  goalsRouter.post('/complete', (req, res) => {
    try {
      const { userId, lessonId, courseId } = req.body;

      if (!userId || !lessonId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and lesson ID are required',
        });
      }

      const today = getTodayString();
      const db = router.db.getState();

      // Initialize goals array if not exists
      if (!db.goals) {
        db.goals = [];
      }

      // Find or create user goals data
      let goalsData = db.goals.find(g => g.userId === userId);

      if (!goalsData) {
        goalsData = {
          id: Date.now().toString(),
          userId,
          dailyGoal: GOAL_CONFIG.DEFAULT_DAILY_GOAL,
          timeCommitment: 'flexible',
          goalStreak: {
            current: 0,
            longest: 0,
            lastGoalMetDate: null,
            streakStartDate: null,
          },
          dailyProgress: [],
        };
        db.goals.push(goalsData);
      }

      // Initialize daily progress array if not exists
      if (!goalsData.dailyProgress) {
        goalsData.dailyProgress = [];
      }

      // Get or create today's progress
      let todayProgress = goalsData.dailyProgress.find(p => p.date === today);

      if (!todayProgress) {
        todayProgress = {
          date: today,
          completed: 0,
          lessonsCompleted: [],
          goalMet: false,
          exceededBy: 0,
        };
        goalsData.dailyProgress.unshift(todayProgress);
      }

      // Check if lesson already counted today
      if (todayProgress.lessonsCompleted.includes(lessonId)) {
        return res.json({
          success: true,
          data: {
            message: 'Lesson already counted for today',
            completed: todayProgress.completed,
            goalMet: todayProgress.goalMet,
            isNew: false,
          },
        });
      }

      // Update progress
      todayProgress.completed += 1;
      todayProgress.lessonsCompleted.push(lessonId);

      const wasGoalMet = todayProgress.goalMet;
      todayProgress.goalMet = todayProgress.completed >= goalsData.dailyGoal;
      todayProgress.exceededBy = Math.max(0, todayProgress.completed - goalsData.dailyGoal);

      // Check if goal was just met
      let bonusXP = 0;
      let streakUpdated = false;
      let isNewStreak = false;

      if (todayProgress.goalMet && !wasGoalMet) {
        bonusXP = GOAL_CONFIG.GOAL_COMPLETION_BONUS_XP;

        // Update goal streak
        const lastGoalMet = goalsData.goalStreak?.lastGoalMetDate;

        if (isYesterday(lastGoalMet)) {
          // Continue streak
          goalsData.goalStreak.current = (goalsData.goalStreak.current || 0) + 1;
        } else if (lastGoalMet !== today) {
          // Start new streak
          goalsData.goalStreak.current = 1;
          goalsData.goalStreak.streakStartDate = today;
          isNewStreak = true;
        }

        goalsData.goalStreak.longest = Math.max(
          goalsData.goalStreak.longest || 0,
          goalsData.goalStreak.current
        );
        goalsData.goalStreak.lastGoalMetDate = today;
        streakUpdated = true;

        // Check for streak milestone bonus
        const currentStreak = goalsData.goalStreak.current;
        if (GOAL_CONFIG.STREAK_MILESTONE_BONUSES[currentStreak]) {
          bonusXP += GOAL_CONFIG.STREAK_MILESTONE_BONUSES[currentStreak];
        }
      }

      // Keep only last 30 days of progress
      if (goalsData.dailyProgress.length > 30) {
        goalsData.dailyProgress = goalsData.dailyProgress.slice(0, 30);
      }

      router.db.setState(db);

      res.json({
        success: true,
        data: {
          completed: todayProgress.completed,
          goal: goalsData.dailyGoal,
          goalMet: todayProgress.goalMet,
          exceededBy: todayProgress.exceededBy,
          goalJustMet: todayProgress.goalMet && !wasGoalMet,
          bonusXP,
          goalStreak: {
            current: goalsData.goalStreak.current,
            longest: goalsData.goalStreak.longest,
            isNewStreak,
          },
          lessonId,
          courseId,
          isNew: true,
        },
      });
    } catch (error) {
      console.error('Error recording goal completion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record goal completion',
      });
    }
  });

  /**
   * GET /api/v1/goals/history
   * Get goal achievement history
   */
  goalsRouter.get('/history', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const limit = parseInt(req.query.limit) || 30;
      const offset = parseInt(req.query.offset) || 0;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const goalsData = db.goals?.find(g => g.userId === userId);

      if (!goalsData || !goalsData.dailyProgress) {
        return res.json({
          success: true,
          data: {
            history: [],
            total: 0,
            stats: {
              daysGoalMet: 0,
              totalLessonsCompleted: 0,
              currentStreak: 0,
              longestStreak: 0,
            },
          },
        });
      }

      const history = goalsData.dailyProgress.slice(offset, offset + limit);
      const total = goalsData.dailyProgress.length;

      // Calculate stats
      const daysGoalMet = goalsData.dailyProgress.filter(p => p.goalMet).length;
      const totalLessonsCompleted = goalsData.dailyProgress.reduce(
        (sum, p) => sum + p.completed,
        0
      );

      res.json({
        success: true,
        data: {
          history,
          total,
          stats: {
            daysGoalMet,
            totalLessonsCompleted,
            currentStreak: goalsData.goalStreak?.current || 0,
            longestStreak: goalsData.goalStreak?.longest || 0,
            successRate: total > 0 ? Math.round((daysGoalMet / total) * 100) : 0,
          },
          pagination: {
            offset,
            limit,
            hasMore: offset + limit < total,
          },
        },
      });
    } catch (error) {
      console.error('Error getting goal history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve goal history',
      });
    }
  });

  /**
   * GET /api/v1/goals/streak
   * Get goal streak information
   */
  goalsRouter.get('/streak', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const db = router.db.getState();
      const goalsData = db.goals?.find(g => g.userId === userId);

      if (!goalsData) {
        return res.json({
          success: true,
          data: {
            current: 0,
            longest: 0,
            lastGoalMetDate: null,
            streakStartDate: null,
            isAtRisk: false,
          },
        });
      }

      // Check if streak is at risk (no goal met today and it's late)
      const today = getTodayString();
      const lastGoalMet = goalsData.goalStreak?.lastGoalMetDate;
      const isAtRisk = lastGoalMet && lastGoalMet !== today && !isYesterday(lastGoalMet);

      res.json({
        success: true,
        data: {
          current: goalsData.goalStreak?.current || 0,
          longest: goalsData.goalStreak?.longest || 0,
          lastGoalMetDate: goalsData.goalStreak?.lastGoalMetDate || null,
          streakStartDate: goalsData.goalStreak?.streakStartDate || null,
          isAtRisk,
        },
      });
    } catch (error) {
      console.error('Error getting goal streak:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve goal streak',
      });
    }
  });

  return goalsRouter;
}

module.exports = { createGoalsRoutes, GOAL_CONFIG };
