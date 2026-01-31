import { useEffect, useMemo, useState } from 'react'
import {
  Target,
  Trophy,
  Flame,
  Palette,
  Award,
  Sparkles
} from 'lucide-react'
import { achievementCatalogService } from '../../services/api/achievements'
import { userService } from '../../services/api/user'
import type { Achievement as UserAchievement } from '../../services/api/user'
import type { AchievementDefinition } from '../../services/api/achievements'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'milestone' | 'performance' | 'consistency' | 'skill' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  progress: number
  total: number
  unlocked: boolean
  unlockedDate?: string
  requirements: string[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  level: number
  maxLevel: number
  category: string
  progress: number
  earned: boolean
}

const categoryIcon = (category?: string) => {
  switch (category) {
    case 'milestone':
      return <Target className="w-6 h-6" />
    case 'performance':
      return <Trophy className="w-6 h-6" />
    case 'consistency':
      return <Flame className="w-6 h-6" />
    case 'skill':
      return <Award className="w-6 h-6" />
    case 'social':
      return <Sparkles className="w-6 h-6" />
    default:
      return <Sparkles className="w-6 h-6" />
  }
}

const normalizeCategory = (category?: string): Achievement['category'] => {
  switch (category) {
    case 'milestone':
    case 'performance':
    case 'consistency':
    case 'skill':
    case 'social':
      return category
    default:
      return 'milestone'
  }
}

const normalizeRarity = (value?: string): Achievement['rarity'] => {
  switch (value) {
    case 'common':
    case 'rare':
    case 'epic':
    case 'legendary':
      return value
    default:
      return 'common'
  }
}

const toBadgeLevel = (progress?: number, earned?: boolean): number => {
  if (typeof progress === 'number') {
    return Math.min(5, Math.max(0, Math.floor(progress / 20)))
  }
  return earned ? 1 : 0
}

export default function Achievements() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements')
  const [filter, setFilter] = useState<'all' | Achievement['category']>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [catalog, setCatalog] = useState<AchievementDefinition[]>([])
  const [earned, setEarned] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadAchievements = async () => {
      try {
        setLoading(true)
        setError(null)
        const [catalogData, earnedData] = await Promise.all([
          achievementCatalogService.list(),
          userService.getMyAchievements()
        ])
        if (!isMounted) return
        setCatalog(catalogData)
        setEarned(earnedData)
      } catch (err) {
        console.error('Failed to load achievements:', err)
        if (!isMounted) return
        setError('Unable to load achievements right now.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAchievements()
    return () => {
      isMounted = false
    }
  }, [])

  const achievements: Achievement[] = useMemo(() => {
    const earnedById = new Map<string, UserAchievement>()
    const earnedByTitle = new Map<string, UserAchievement>()

    earned.forEach((item) => {
      if (item.achievement_id) {
        earnedById.set(item.achievement_id, item)
      }
      earnedByTitle.set(item.title, item)
    })

    const mapped = catalog.map((item) => {
      const match = (item.id && earnedById.get(item.id)) || earnedByTitle.get(item.title)
      const progress = match?.progress ?? (match?.status === 'earned' ? 100 : 0)
      const total = 100
      const requirements =
        (match?.requirements as string[]) ||
        ((item.criteria as { requirements?: string[] })?.requirements ?? [])
      const rarity = normalizeRarity((item.metadata as { rarity?: string })?.rarity)
      const points = (item.metadata as { points?: number })?.points ?? 0

      return {
        id: item.id,
        title: item.title,
        description: item.description || '',
        icon: categoryIcon(item.category),
        category: normalizeCategory(item.category),
        rarity,
        points,
        progress,
        total,
        unlocked: Boolean(match) || progress >= total,
        unlockedDate: match?.earned_at,
        requirements,
      }
    })

    const unmatchedEarned = earned.filter(
      (item) => !catalog.some((catalogItem) => catalogItem.id === item.achievement_id)
    )

    unmatchedEarned.forEach((item) => {
      mapped.push({
        id: item.id,
        title: item.title,
        description: item.description || '',
        icon: categoryIcon(item.category),
        category: normalizeCategory(item.category),
        rarity: normalizeRarity((item.metadata as { rarity?: string })?.rarity),
        points: (item.metadata as { points?: number })?.points ?? 0,
        progress: item.progress ?? 100,
        total: 100,
        unlocked: true,
        unlockedDate: item.earned_at,
        requirements: item.requirements || [],
      })
    })

    return mapped
  }, [catalog, earned])

  const badges: Badge[] = useMemo(() => {
    return earned
      .filter((item) => item.achievement_type === 'badge')
      .map((item) => {
        const progress = item.progress ?? (item.status === 'earned' ? 100 : 0)
        return {
          id: item.id,
          name: item.title,
          description: item.description || '',
          icon: categoryIcon(item.category) || <Palette className="w-6 h-6" />,
          level: toBadgeLevel(progress, item.status === 'earned'),
          maxLevel: 5,
          category: item.category || 'General',
          progress,
          earned: item.status === 'earned',
        }
      })
  }, [earned])

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:border-darkMode-border dark:bg-darkMode-surface'
      case 'rare': return 'border-blue-300 bg-blue-50 dark:border-info dark:bg-info/10'
      case 'epic': return 'border-purple-300 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
      case 'legendary': return 'border-accent-gold bg-accent-goldLight/20 dark:border-darkMode-accent dark:bg-darkMode-accent/10'
    }
  }

  const getRarityText = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-darkMode-textSecondary'
      case 'rare': return 'text-blue-600 dark:text-info'
      case 'epic': return 'text-purple-600 dark:text-purple-400'
      case 'legendary': return 'text-accent-gold dark:text-darkMode-accent'
    }
  }

  const getBadgeLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 text-gray-600 dark:bg-darkMode-surface dark:text-darkMode-textSecondary'
      case 1: return 'bg-bronze-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-600'
      case 2: return 'bg-silver-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      case 3: return 'bg-accent-goldLight/30 text-accent-gold dark:bg-darkMode-accent/20 dark:text-darkMode-accent'
      case 4: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 5: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-darkMode-surface dark:text-darkMode-textSecondary'
    }
  }

  const getBadgeLevelText = (level: number) => {
    switch (level) {
      case 0: return 'Not Earned'
      case 1: return 'Bronze'
      case 2: return 'Silver'
      case 3: return 'Gold'
      case 4: return 'Platinum'
      case 5: return 'Diamond'
      default: return 'Unknown'
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = filter === 'all' || achievement.category === filter
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked
    return categoryMatch && unlockedMatch
  })

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, achievement) => sum + achievement.points, 0)

  const unlockedCount = achievements.filter(a => a.unlocked).length

  const latestUnlocked = useMemo(() => {
    const unlocked = achievements
      .filter(item => item.unlocked)
      .map(item => ({
        ...item,
        unlockedAt: item.unlockedDate ? new Date(item.unlockedDate).getTime() : 0,
      }))
      .sort((a, b) => b.unlockedAt - a.unlockedAt)
    return unlocked[0]
  }, [achievements])

  const badgeProgressTip = useMemo(() => {
    const inProgress = badges
      .filter(badge => !badge.earned)
      .map(badge => ({ ...badge, progressValue: badge.progress ?? 0 }))
      .sort((a, b) => b.progressValue - a.progressValue)
    return inProgress[0]
  }, [badges])

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600 dark:text-darkMode-textSecondary">Loading achievements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-600 dark:text-darkMode-error">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-accent-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">Achievements & Rewards</h1>
              <p className="text-gray-600 dark:text-darkMode-textSecondary">Track your progress and unlock exciting rewards</p>
            </div>
          </div>

          {/* Achievement Unlock Notification */}
          {latestUnlocked && (
            <div className="bg-accent-goldLight/20 border border-accent-gold/30 rounded-lg p-4 mb-6 dark:bg-darkMode-accent/10 dark:border-darkMode-accent/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent-gold dark:text-darkMode-accent" />
                <div>
                  <p className="text-yellow-800 dark:text-darkMode-accent font-medium">New Achievement Unlocked!</p>
                  <p className="text-yellow-700 dark:text-darkMode-textSecondary text-sm">
                    "{latestUnlocked.title}"{latestUnlocked.description ? ` - ${latestUnlocked.description}` : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary dark:text-darkMode-success">{totalPoints}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Total Points</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-light dark:text-darkMode-link">{unlockedCount}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Achievements</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-forest-sage dark:text-darkMode-progress">{badges.filter(b => b.earned).length}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Badges Earned</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">15</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Leaderboard Rank</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-darkMode-surface rounded-lg shadow-sm">
          {[
            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
            { id: 'badges', label: 'Skill Badges', icon: <Award className="w-5 h-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex gap-2">
                {['all', 'milestone', 'performance', 'consistency', 'skill', 'social'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category as typeof filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === category
                        ? 'bg-primary-light text-white dark:bg-darkMode-accent dark:text-darkMode-bg'
                        : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text bg-white dark:bg-darkMode-surface'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-gray-600 dark:text-darkMode-textSecondary">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-darkMode-border focus:ring-primary-light dark:focus:ring-darkMode-accent"
                />
                <span>Unlocked only</span>
              </label>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                    achievement.unlocked
                      ? getRarityColor(achievement.rarity)
                      : 'border-gray-200 bg-gray-50 opacity-75 dark:border-darkMode-border dark:bg-darkMode-surfaceHover'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`text-6xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      achievement.unlocked ? 'text-primary-dark dark:text-darkMode-text' : 'text-gray-500 dark:text-darkMode-textMuted'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600 dark:text-darkMode-textSecondary' : 'text-gray-400 dark:text-darkMode-textMuted'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium capitalize ${getRarityText(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                      <span className={`font-bold ${
                        achievement.unlocked ? 'text-secondary dark:text-darkMode-success' : 'text-gray-400 dark:text-darkMode-textMuted'
                      }`}>
                        {achievement.points} pts
                      </span>
                    </div>

                    {!achievement.unlocked && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                          <div
                            className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-xs text-gray-500 dark:text-darkMode-textMuted text-center">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="border-t dark:border-darkMode-border pt-3">
                      <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mb-2">Requirements:</p>
                      <ul className="space-y-1">
                        {achievement.requirements.map((req, index) => (
                          <li key={index} className="text-xs text-gray-600 dark:text-darkMode-textSecondary flex items-center gap-2">
                            <span className={achievement.unlocked ? 'text-secondary dark:text-darkMode-success' : 'text-gray-400 dark:text-darkMode-textMuted'}>
                              {achievement.unlocked ? '✓' : '○'}
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                    badge.earned ? 'border-secondary dark:border-darkMode-success' : 'border-gray-200 dark:border-darkMode-border'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`text-5xl mb-3 ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      badge.earned ? 'text-primary-dark dark:text-darkMode-text' : 'text-gray-500 dark:text-darkMode-textMuted'
                    }`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      badge.earned ? 'text-gray-600 dark:text-darkMode-textSecondary' : 'text-gray-400 dark:text-darkMode-textMuted'
                    }`}>
                      {badge.description}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeLevelColor(badge.level)}`}>
                      {getBadgeLevelText(badge.level)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                        Level {badge.level}/{badge.maxLevel}
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {Array.from({ length: badge.maxLevel }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < badge.level ? 'bg-secondary dark:bg-darkMode-success' : 'bg-gray-200 dark:bg-darkMode-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {badge.earned && badge.level < badge.maxLevel && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                          <span>Next Level Progress</span>
                          <span>{badge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                          <div
                            className="bg-primary-dark dark:bg-darkMode-progress h-2 rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <span className="text-xs text-gray-500 dark:text-darkMode-textMuted bg-gray-100 dark:bg-darkMode-surfaceHover px-2 py-1 rounded-full">
                        {badge.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Badge Progress Feedback */}
            {badgeProgressTip && (
              <div className="mt-8 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Target className="w-6 h-6 text-blue-600 dark:text-info" />
                  <div>
                    <p className="text-blue-800 dark:text-info font-medium">Badge Progress Tip</p>
                    <p className="text-blue-700 dark:text-darkMode-textSecondary text-sm">
                      Focus on {badgeProgressTip.name} by completing more {badgeProgressTip.category.toLowerCase()} courses to unlock advanced skills.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
