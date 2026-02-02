/**
 * BadgeShowcase Component
 *
 * Profile badge display with grid/list view options,
 * category filtering, and comprehensive badge collection view.
 */

import { useState, useMemo } from 'react'
import {
  Grid,
  List,
  Filter,
  Trophy,
  BookOpen,
  Flame,
  Zap,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  BADGE_DEFINITIONS,
  BADGE_CATEGORY_LABELS,
  BADGE_CATEGORY_ICONS,
  RARITY_CONFIG,
  type BadgeCategory,
} from '../../data/badges'
import type { BadgeRarity } from '../../types/gamification'
import { BadgeEngine, type BadgeProgress } from '../../lib/badgeEngine'
import BadgeCard from './BadgeCard'
import BadgeDetailModal from './BadgeDetailModal'

interface BadgeShowcaseProps {
  badgeEngine: BadgeEngine
  displayMode?: 'grid' | 'list'
  showLocked?: boolean
  showFilters?: boolean
  compact?: boolean
  maxVisible?: number
  onBadgeClick?: (badgeId: string) => void
}

type FilterCategory = 'all' | BadgeCategory
type FilterRarity = 'all' | BadgeRarity

const CATEGORY_ICONS: Record<BadgeCategory, React.ComponentType<{ className?: string }>> = {
  learning: BookOpen,
  consistency: Flame,
  performance: Zap,
  engagement: Trophy,
}

export function BadgeShowcase({
  badgeEngine,
  displayMode: initialDisplayMode = 'grid',
  showLocked = true,
  showFilters = true,
  compact = false,
  maxVisible,
  onBadgeClick,
}: BadgeShowcaseProps) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>(initialDisplayMode)
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [rarityFilter, setRarityFilter] = useState<FilterRarity>('all')
  const [showHidden, setShowHidden] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<
    (typeof BADGE_DEFINITIONS)[0] & { isUnlocked: boolean; unlockedAt?: string } | null
  >(null)
  const [selectedBadgeProgress, setSelectedBadgeProgress] = useState<BadgeProgress | undefined>()

  // Get all badges with unlock status
  const allBadges = useMemo(() => {
    return badgeEngine.getAllBadges(showHidden)
  }, [badgeEngine, showHidden])

  // Get badge statistics
  const stats = useMemo(() => {
    return badgeEngine.getStats()
  }, [badgeEngine])

  // Filter badges
  const filteredBadges = useMemo(() => {
    let badges = allBadges

    // Apply category filter
    if (categoryFilter !== 'all') {
      badges = badges.filter((b) => b.category === categoryFilter)
    }

    // Apply rarity filter
    if (rarityFilter !== 'all') {
      badges = badges.filter((b) => b.rarity === rarityFilter)
    }

    // Apply locked filter
    if (!showLocked) {
      badges = badges.filter((b) => b.isUnlocked)
    }

    // Sort: unlocked first, then by rarity
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 }
    badges = badges.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1
      }
      return rarityOrder[a.rarity] - rarityOrder[b.rarity]
    })

    // Apply max visible limit
    if (maxVisible && maxVisible > 0) {
      badges = badges.slice(0, maxVisible)
    }

    return badges
  }, [allBadges, categoryFilter, rarityFilter, showLocked, maxVisible])

  // Handle badge click
  const handleBadgeClick = (badge: typeof allBadges[0]) => {
    setSelectedBadge(badge)
    setSelectedBadgeProgress(badgeEngine.getProgress(badge.id))
    onBadgeClick?.(badge.id)
  }

  // Close modal
  const closeModal = () => {
    setSelectedBadge(null)
    setSelectedBadgeProgress(undefined)
  }

  return (
    <div className="w-full">
      {/* Header & Stats */}
      {showFilters && (
        <div className="mb-6">
          {/* Stats Overview */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-gold" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.unlocked}/{stats.total}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Badges Unlocked
                </span>
              </div>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-accent-gold rounded-full transition-all duration-300"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  displayMode === 'grid'
                    ? 'bg-primary/10 text-primary dark:text-darkMode-progress'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  displayMode === 'list'
                    ? 'bg-primary/10 text-primary dark:text-darkMode-progress'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-gray-700
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
                  transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="capitalize">{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 py-1 rounded-lg shadow-lg z-10
                  bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setCategoryFilter('all')
                      setShowFilterDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
                      ${categoryFilter === 'all' ? 'text-primary dark:text-darkMode-progress font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    All Categories
                  </button>
                  {(Object.keys(BADGE_CATEGORY_LABELS) as BadgeCategory[]).map((cat) => {
                    const Icon = CATEGORY_ICONS[cat]
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat)
                          setShowFilterDropdown(false)
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2
                          hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
                          ${categoryFilter === cat ? 'text-primary dark:text-darkMode-progress font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        <Icon className="w-4 h-4" />
                        {BADGE_CATEGORY_LABELS[cat]}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Rarity Filter Pills */}
            <div className="flex gap-2">
              <button
                onClick={() => setRarityFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${rarityFilter === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                All
              </button>
              {(['common', 'rare', 'epic', 'legendary'] as BadgeRarity[]).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${rarityFilter === rarity
                      ? `${RARITY_CONFIG[rarity].bgColor} ${RARITY_CONFIG[rarity].textColor}`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {RARITY_CONFIG[rarity].label}
                </button>
              ))}
            </div>

            {/* Show Hidden Toggle */}
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${showHidden
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {showHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showHidden ? 'Hide Secret' : 'Show Secret'}
            </button>
          </div>
        </div>
      )}

      {/* Badge Grid/List */}
      {displayMode === 'grid' ? (
        <div className={`grid gap-4 ${
          compact
            ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}>
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              progress={badgeEngine.getProgress(badge.id)}
              onClick={() => handleBadgeClick(badge)}
              size={compact ? 'sm' : 'md'}
              compact={compact}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBadges.map((badge) => {
            const progress = badgeEngine.getProgress(badge.id)
            const rarityConfig = RARITY_CONFIG[badge.rarity]
            const isHiddenAndLocked = badge.hidden && !badge.isUnlocked

            return (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl
                  border-2 transition-all duration-300
                  ${badge.isUnlocked
                    ? `${rarityConfig.borderColor} ${rarityConfig.bgColor}`
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  }
                  hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                `}
              >
                {/* Badge Icon */}
                <div
                  className={`
                    flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                    ${badge.isUnlocked
                      ? `bg-white dark:bg-gray-900 ${rarityConfig.glowClass}`
                      : 'bg-gray-100 dark:bg-gray-700'
                    }
                  `}
                >
                  <BadgeCard
                    badge={badge}
                    size="sm"
                    compact
                    showProgress={false}
                  />
                </div>

                {/* Badge Info */}
                <div className="flex-1 text-left min-w-0">
                  <h3
                    className={`font-semibold truncate ${
                      badge.isUnlocked
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {isHiddenAndLocked ? '???' : badge.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {isHiddenAndLocked ? 'Hidden badge' : badge.description}
                  </p>
                </div>

                {/* Rarity & Progress */}
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`
                      inline-block px-2 py-0.5 rounded-full text-xs font-medium
                      ${rarityConfig.bgColor} ${rarityConfig.textColor}
                    `}
                  >
                    {rarityConfig.label}
                  </span>
                  {!badge.isUnlocked && !isHiddenAndLocked && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {progress.currentValue}/{progress.targetValue}
                    </p>
                  )}
                  {badge.isUnlocked && badge.unlockedAt && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No badges found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your filters or start earning badges!
          </p>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          progress={selectedBadgeProgress}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default BadgeShowcase
