/**
 * LeagueBadge Component
 *
 * Displays a league tier badge (Bronze/Silver/Gold/Diamond) with
 * customizable size and optional animation effects.
 */

import { memo } from 'react'
import { Shield, Crown, Gem } from 'lucide-react'
import type { League } from '../../types/leaderboard'
import { LEAGUE_CONFIG } from '../../types/leaderboard'

interface LeagueBadgeProps {
  /** League tier to display */
  league: League

  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  /** Show league name label */
  showLabel?: boolean

  /** Show shimmer animation */
  animated?: boolean

  /** Optional click handler */
  onClick?: () => void

  /** Additional CSS classes */
  className?: string
}

/**
 * Size configurations
 */
const SIZE_CONFIG = {
  xs: {
    container: 'w-5 h-5',
    icon: 12,
    fontSize: 'text-[8px]',
    padding: 'p-0.5',
  },
  sm: {
    container: 'w-7 h-7',
    icon: 14,
    fontSize: 'text-[10px]',
    padding: 'p-1',
  },
  md: {
    container: 'w-10 h-10',
    icon: 18,
    fontSize: 'text-xs',
    padding: 'p-1.5',
  },
  lg: {
    container: 'w-14 h-14',
    icon: 24,
    fontSize: 'text-sm',
    padding: 'p-2',
  },
  xl: {
    container: 'w-20 h-20',
    icon: 32,
    fontSize: 'text-base',
    padding: 'p-3',
  },
}

/**
 * Get league icon component
 */
function LeagueIcon({ league, size }: { league: League; size: number }) {
  const config = LEAGUE_CONFIG[league]

  switch (config.icon) {
    case 'crown':
      return <Crown size={size} />
    case 'gem':
      return <Gem size={size} />
    default:
      return <Shield size={size} />
  }
}

/**
 * LeagueBadge Component
 *
 * Renders a visual badge representing the user's league tier.
 * Features gradient backgrounds, icons, and optional animations.
 */
export const LeagueBadge = memo(function LeagueBadge({
  league,
  size = 'md',
  showLabel = false,
  animated = false,
  onClick,
  className = '',
}: LeagueBadgeProps) {
  const config = LEAGUE_CONFIG[league]
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div
      className={`inline-flex flex-col items-center gap-1 ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Badge Container */}
      <div
        className={`
          relative ${sizeConfig.container} ${sizeConfig.padding}
          rounded-lg
          flex items-center justify-center
          ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
          transition-transform duration-200
          ${animated ? 'animate-pulse' : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
          boxShadow: `0 2px 8px ${config.primaryColor}40`,
        }}
        title={`${config.displayName} League`}
      >
        {/* Shimmer Effect for Diamond */}
        {league === 'diamond' && animated && (
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite',
            }}
          />
        )}

        {/* Icon */}
        <div
          className="relative z-10"
          style={{
            color: league === 'diamond' ? '#1a365d' : '#ffffff',
            filter: league === 'gold' ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' : undefined,
          }}
        >
          <LeagueIcon league={league} size={sizeConfig.icon} />
        </div>

        {/* Border Highlight */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `1px solid ${config.primaryColor}80`,
            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3)`,
          }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`${sizeConfig.fontSize} font-semibold`}
          style={{ color: config.primaryColor }}
        >
          {config.displayName}
        </span>
      )}
    </div>
  )
})

/**
 * LeagueBadgeInline Component
 *
 * Compact inline version of the badge with league name.
 */
export const LeagueBadgeInline = memo(function LeagueBadgeInline({
  league,
  className = '',
}: {
  league: League
  className?: string
}) {
  const config = LEAGUE_CONFIG[league]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5
        rounded-full text-xs font-medium
        ${className}
      `}
      style={{
        backgroundColor: `${config.primaryColor}20`,
        color: config.secondaryColor,
        border: `1px solid ${config.primaryColor}40`,
      }}
    >
      <LeagueIcon league={league} size={12} />
      {config.displayName}
    </span>
  )
})

/**
 * PersonalModeBadge Component
 *
 * Badge shown when user has opted out of competitive leaderboards.
 */
export const PersonalModeBadge = memo(function PersonalModeBadge({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`
          ${sizeConfig.container} ${sizeConfig.padding}
          rounded-lg
          flex items-center justify-center
          bg-gradient-to-br from-neutral-400 to-neutral-500
          dark:from-darkMode-surface dark:to-darkMode-surfaceHover
        `}
        title="Personal Mode - Not competing on leaderboards"
      >
        <Shield
          size={sizeConfig.icon}
          className="text-white dark:text-darkMode-textMuted"
        />
      </div>
      <span className={`${sizeConfig.fontSize} font-medium text-neutral-500 dark:text-darkMode-textMuted`}>
        Personal
      </span>
    </div>
  )
})

/**
 * League color utilities for use in other components
 */
export const leagueColors = {
  bronze: { primary: '#CD7F32', secondary: '#8B4513' },
  silver: { primary: '#C0C0C0', secondary: '#A9A9A9' },
  gold: { primary: '#FFD700', secondary: '#DAA520' },
  diamond: { primary: '#B9F2FF', secondary: '#00CED1' },
}

export default LeagueBadge
