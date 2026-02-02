/**
 * Leaderboard API Routes
 *
 * Handles leaderboard endpoints for weekly competitions with tiered leagues.
 */

const express = require('express');
const LeaderboardService = require('../services/leaderboardService');

/**
 * Create leaderboard routes
 * @param {object} router - JSON Server router instance
 */
function createLeaderboardRoutes(router) {
  const leaderboardRouter = express.Router();
  const leaderboardService = new LeaderboardService();

  /**
   * GET /api/v1/leaderboard
   * Get leaderboard for user's current league
   */
  leaderboardRouter.get('/', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const leaderboard = leaderboardService.getLeaderboard(userId);

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve leaderboard',
      });
    }
  });

  /**
   * GET /api/v1/leaderboard/:league
   * Get leaderboard for a specific league
   */
  leaderboardRouter.get('/:league', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const { league } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const validLeagues = ['bronze', 'silver', 'gold', 'diamond'];
      if (!validLeagues.includes(league)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid league. Must be one of: bronze, silver, gold, diamond',
        });
      }

      const leaderboard = leaderboardService.getLeaderboard(userId, league);

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error('Error getting league leaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve league leaderboard',
      });
    }
  });

  /**
   * GET /api/v1/leaderboard/status
   * Get user's leaderboard status
   */
  leaderboardRouter.get('/user/status', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const status = leaderboardService.getUserStatus(userId);

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      console.error('Error getting user status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user status',
      });
    }
  });

  /**
   * POST /api/v1/leaderboard/opt-out
   * Toggle opt-out status
   */
  leaderboardRouter.post('/opt-out', (req, res) => {
    try {
      const { userId, optIn } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      if (typeof optIn !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'optIn must be a boolean value',
        });
      }

      const result = leaderboardService.toggleOptOut(userId, optIn);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error toggling opt-out:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update opt-out status',
      });
    }
  });

  /**
   * GET /api/v1/leaderboard/history
   * Get user's leaderboard history
   */
  leaderboardRouter.get('/user/history', (req, res) => {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const limit = parseInt(req.query.limit) || 10;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const history = leaderboardService.getHistory(userId, limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error('Error getting history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve history',
      });
    }
  });

  /**
   * POST /api/v1/leaderboard/xp
   * Add XP to user's weekly total (called when user earns XP)
   */
  leaderboardRouter.post('/xp', (req, res) => {
    try {
      const { userId, amount } = req.body;

      if (!userId || amount === undefined) {
        return res.status(400).json({
          success: false,
          message: 'userId and amount are required',
        });
      }

      if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({
          success: false,
          message: 'amount must be a non-negative number',
        });
      }

      const result = leaderboardService.addWeeklyXP(userId, amount);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error adding weekly XP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add weekly XP',
      });
    }
  });

  /**
   * GET /api/v1/leaderboard/summary
   * Get league summary (for admin/analytics)
   */
  leaderboardRouter.get('/admin/summary', (req, res) => {
    try {
      const summary = leaderboardService.getLeagueSummary();

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve summary',
      });
    }
  });

  /**
   * POST /api/v1/leaderboard/reset
   * Manually trigger weekly reset (for testing/admin)
   */
  leaderboardRouter.post('/admin/reset', (req, res) => {
    try {
      const result = leaderboardService.processWeeklyReset();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error processing reset:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process weekly reset',
      });
    }
  });

  return leaderboardRouter;
}

module.exports = { createLeaderboardRoutes };
