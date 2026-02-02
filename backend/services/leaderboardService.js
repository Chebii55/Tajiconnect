/**
 * Leaderboard Service
 *
 * Manages weekly leaderboards with tiered leagues (Bronze/Silver/Gold/Diamond).
 * Handles weekly resets, promotions, demotions, and opt-out functionality.
 */

const fs = require('fs');
const path = require('path');

/**
 * League configuration
 */
const LEAGUE_CONFIG = {
  bronze: {
    name: 'bronze',
    displayName: 'Bronze',
    promotionThreshold: 50, // Top 50% promote
    demotionThreshold: 0, // No demotion from Bronze
  },
  silver: {
    name: 'silver',
    displayName: 'Silver',
    promotionThreshold: 25, // Top 25% promote
    demotionThreshold: 25, // Bottom 25% demote
  },
  gold: {
    name: 'gold',
    displayName: 'Gold',
    promotionThreshold: 10, // Top 10% promote
    demotionThreshold: 25, // Bottom 25% demote
  },
  diamond: {
    name: 'diamond',
    displayName: 'Diamond',
    promotionThreshold: 0, // Can't promote from Diamond
    demotionThreshold: 50, // Bottom 50% demote
  },
};

const LEAGUE_ORDER = ['bronze', 'silver', 'gold', 'diamond'];

class LeaderboardService {
  constructor(dbPath) {
    this.dbPath = dbPath || path.join(__dirname, '../db.json');
  }

  /**
   * Load database
   */
  loadDB() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading database:', error);
      return {};
    }
  }

  /**
   * Save database
   */
  saveDB(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      return false;
    }
  }

  /**
   * Initialize leaderboard data structure
   */
  initializeLeaderboardData(db) {
    if (!db.leaderboard) {
      db.leaderboard = {
        users: {},
        weeklyData: {},
        currentWeekId: this.getCurrentWeekId(),
        history: [],
      };
    }
    return db;
  }

  /**
   * Get current week ID (format: YYYY-WXX)
   */
  getCurrentWeekId() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  /**
   * Get week start and end dates
   */
  getWeekDates(weekId) {
    const [year, week] = weekId.split('-W');
    const firstDayOfYear = new Date(parseInt(year), 0, 1);
    const daysOffset = (parseInt(week) - 1) * 7;
    const weekStart = new Date(firstDayOfYear);
    weekStart.setDate(firstDayOfYear.getDate() - firstDayOfYear.getDay() + 1 + daysOffset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      start: weekStart.toISOString(),
      end: weekEnd.toISOString(),
    };
  }

  /**
   * Get time until next reset (Monday 00:00 UTC)
   */
  getTimeUntilReset() {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setUTCDate(now.getUTCDate() + ((1 + 7 - now.getUTCDay()) % 7 || 7));
    nextMonday.setUTCHours(0, 0, 0, 0);
    return Math.floor((nextMonday - now) / 1000);
  }

  /**
   * Get or create user leaderboard data
   */
  getUserLeaderboardData(db, userId) {
    db = this.initializeLeaderboardData(db);

    if (!db.leaderboard.users[userId]) {
      db.leaderboard.users[userId] = {
        league: 'bronze',
        isOptedIn: true,
        weeklyXP: 0,
        currentRank: 0,
        previousRank: null,
        promotionStreak: 0,
        lastWeekResult: null,
        joinedAt: new Date().toISOString(),
      };
    }

    return db.leaderboard.users[userId];
  }

  /**
   * Add XP to user's weekly total
   */
  addWeeklyXP(userId, amount) {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const userData = this.getUserLeaderboardData(db, userId);

    if (!userData.isOptedIn) {
      return { success: true, weeklyXP: 0, message: 'User opted out of leaderboards' };
    }

    userData.weeklyXP += amount;

    // Update weekly data
    const weekId = this.getCurrentWeekId();
    if (!db.leaderboard.weeklyData[weekId]) {
      db.leaderboard.weeklyData[weekId] = {};
    }
    db.leaderboard.weeklyData[weekId][userId] = userData.weeklyXP;

    this.saveDB(db);

    return {
      success: true,
      weeklyXP: userData.weeklyXP,
      league: userData.league,
    };
  }

  /**
   * Get leaderboard for a specific league
   */
  getLeaderboard(userId, league = null) {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const userData = this.getUserLeaderboardData(db, userId);
    const targetLeague = league || userData.league;
    const weekId = this.getCurrentWeekId();
    const weekDates = this.getWeekDates(weekId);

    // Get all users in the league who are opted in
    const leagueUsers = [];
    for (const [uid, data] of Object.entries(db.leaderboard.users)) {
      if (data.league === targetLeague && data.isOptedIn) {
        // Get user info
        const user = db.users?.find((u) => u.id === uid);
        leagueUsers.push({
          userId: uid,
          username: user?.name || `User ${uid.substring(0, 4)}`,
          avatarUrl: user?.profile?.avatar || null,
          weeklyXP: data.weeklyXP || 0,
          previousRank: data.previousRank,
        });
      }
    }

    // Sort by weekly XP descending
    leagueUsers.sort((a, b) => b.weeklyXP - a.weeklyXP);

    // Assign ranks and calculate trends
    const entries = leagueUsers.map((user, index) => {
      const rank = index + 1;
      let trend = 'same';
      let trendAmount = 0;

      if (user.previousRank) {
        if (rank < user.previousRank) {
          trend = 'up';
          trendAmount = user.previousRank - rank;
        } else if (rank > user.previousRank) {
          trend = 'down';
          trendAmount = rank - user.previousRank;
        }
      }

      return {
        rank,
        userId: user.userId,
        username: user.username,
        avatarUrl: user.avatarUrl,
        weeklyXP: user.weeklyXP,
        league: targetLeague,
        trend,
        trendAmount,
        isCurrentUser: user.userId === userId,
      };
    });

    // Find current user's rank
    const userEntry = entries.find((e) => e.isCurrentUser);
    const userRank = userEntry?.rank || 0;
    const totalInLeague = entries.length;

    // Determine if user is in promotion/demotion zone
    const config = LEAGUE_CONFIG[targetLeague];
    const promotionZone =
      userRank > 0 && config.promotionThreshold > 0
        ? (userRank / totalInLeague) * 100 <= config.promotionThreshold
        : false;

    const demotionZone =
      userRank > 0 && config.demotionThreshold > 0
        ? ((totalInLeague - userRank + 1) / totalInLeague) * 100 <= config.demotionThreshold
        : false;

    // Update user's current rank
    if (userData.isOptedIn) {
      userData.currentRank = userRank;
      this.saveDB(db);
    }

    return {
      league: targetLeague,
      entries,
      userRank,
      totalInLeague,
      promotionZone,
      demotionZone,
      timeUntilReset: this.getTimeUntilReset(),
      weekStartDate: weekDates.start,
      weekEndDate: weekDates.end,
    };
  }

  /**
   * Get user's leaderboard status
   */
  getUserStatus(userId) {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const userData = this.getUserLeaderboardData(db, userId);

    return {
      userId,
      league: userData.league,
      isOptedIn: userData.isOptedIn,
      weeklyXP: userData.weeklyXP,
      currentRank: userData.currentRank,
      previousRank: userData.previousRank,
      promotionStreak: userData.promotionStreak,
      lastWeekResult: userData.lastWeekResult,
    };
  }

  /**
   * Toggle opt-out status
   */
  toggleOptOut(userId, optIn) {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const userData = this.getUserLeaderboardData(db, userId);
    const wasOptedIn = userData.isOptedIn;
    userData.isOptedIn = optIn;

    // If opting out mid-week, reset weekly XP
    if (wasOptedIn && !optIn) {
      userData.weeklyXP = 0;
      userData.currentRank = 0;

      // Remove from weekly data
      const weekId = this.getCurrentWeekId();
      if (db.leaderboard.weeklyData[weekId]) {
        delete db.leaderboard.weeklyData[weekId][userId];
      }
    }

    this.saveDB(db);

    return {
      isOptedIn: userData.isOptedIn,
      message: optIn ? 'You are now competing on leaderboards!' : 'You have opted out of leaderboards.',
    };
  }

  /**
   * Get leaderboard history for user
   */
  getHistory(userId, limit = 10) {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const userData = this.getUserLeaderboardData(db, userId);
    const history = db.leaderboard.history || [];

    // Filter history for this user
    const userHistory = history
      .filter((week) => week.results && week.results[userId])
      .map((week) => ({
        weekId: week.weekId,
        ...week.results[userId],
      }))
      .slice(0, limit);

    return {
      history: userHistory,
      total: userHistory.length,
    };
  }

  /**
   * Process weekly reset - should be called by a scheduled job
   */
  processWeeklyReset() {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const previousWeekId = db.leaderboard.currentWeekId;
    const newWeekId = this.getCurrentWeekId();

    // Skip if already processed this week
    if (previousWeekId === newWeekId) {
      return { success: false, message: 'Already processed this week' };
    }

    const weekResults = {
      weekId: previousWeekId,
      processedAt: new Date().toISOString(),
      results: {},
    };

    // Process each league separately
    for (const league of LEAGUE_ORDER) {
      const config = LEAGUE_CONFIG[league];

      // Get all opted-in users in this league
      const leagueUsers = [];
      for (const [userId, userData] of Object.entries(db.leaderboard.users)) {
        if (userData.league === league && userData.isOptedIn) {
          leagueUsers.push({
            userId,
            weeklyXP: userData.weeklyXP || 0,
            userData,
          });
        }
      }

      // Sort by XP descending
      leagueUsers.sort((a, b) => b.weeklyXP - a.weeklyXP);
      const totalInLeague = leagueUsers.length;

      if (totalInLeague === 0) continue;

      // Determine promotions and demotions
      leagueUsers.forEach((user, index) => {
        const rank = index + 1;
        const percentile = (rank / totalInLeague) * 100;
        const bottomPercentile = ((totalInLeague - rank + 1) / totalInLeague) * 100;

        let promoted = false;
        let demoted = false;
        let newLeague = league;

        // Check for promotion
        if (config.promotionThreshold > 0 && percentile <= config.promotionThreshold) {
          const nextLeagueIndex = LEAGUE_ORDER.indexOf(league) + 1;
          if (nextLeagueIndex < LEAGUE_ORDER.length) {
            promoted = true;
            newLeague = LEAGUE_ORDER[nextLeagueIndex];
          }
        }

        // Check for demotion
        if (config.demotionThreshold > 0 && bottomPercentile <= config.demotionThreshold) {
          const prevLeagueIndex = LEAGUE_ORDER.indexOf(league) - 1;
          if (prevLeagueIndex >= 0) {
            demoted = true;
            newLeague = LEAGUE_ORDER[prevLeagueIndex];
          }
        }

        // Record result
        weekResults.results[user.userId] = {
          league,
          finalRank: rank,
          totalParticipants: totalInLeague,
          weeklyXP: user.weeklyXP,
          promoted,
          demoted,
          newLeague: promoted || demoted ? newLeague : undefined,
        };

        // Update user data
        user.userData.lastWeekResult = weekResults.results[user.userId];
        user.userData.previousRank = rank;
        user.userData.league = newLeague;
        user.userData.weeklyXP = 0;

        // Update promotion streak
        if (promoted) {
          user.userData.promotionStreak = (user.userData.promotionStreak || 0) + 1;
        } else if (demoted) {
          user.userData.promotionStreak = 0;
        }
      });
    }

    // Save history
    if (!db.leaderboard.history) {
      db.leaderboard.history = [];
    }
    db.leaderboard.history.unshift(weekResults);

    // Keep only last 52 weeks of history
    if (db.leaderboard.history.length > 52) {
      db.leaderboard.history = db.leaderboard.history.slice(0, 52);
    }

    // Update current week ID
    db.leaderboard.currentWeekId = newWeekId;

    // Clear weekly data
    db.leaderboard.weeklyData = {};
    db.leaderboard.weeklyData[newWeekId] = {};

    this.saveDB(db);

    return {
      success: true,
      previousWeekId,
      newWeekId,
      results: weekResults,
    };
  }

  /**
   * Get league summary (for admin/analytics)
   */
  getLeagueSummary() {
    const db = this.loadDB();
    this.initializeLeaderboardData(db);

    const summary = {};

    for (const league of LEAGUE_ORDER) {
      const users = Object.entries(db.leaderboard.users).filter(
        ([_, data]) => data.league === league && data.isOptedIn
      );

      const totalXP = users.reduce((sum, [_, data]) => sum + (data.weeklyXP || 0), 0);

      summary[league] = {
        totalUsers: users.length,
        totalWeeklyXP: totalXP,
        averageXP: users.length > 0 ? Math.round(totalXP / users.length) : 0,
        config: LEAGUE_CONFIG[league],
      };
    }

    return summary;
  }
}

module.exports = LeaderboardService;
