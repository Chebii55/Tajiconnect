/**
 * BadgeUnlockModal Component
 *
 * Celebration modal when user unlocks a badge.
 * Features rarity-colored effects, confetti animation,
 * and XP reward display.
 */

import { useEffect, useState, useCallback } from 'react'
import { X, Sparkles, Gift, Share2 } from 'lucide-react'
import {
  BookOpen,
  GraduationCap,
  Languages,
  Library,
  Crown,
  Flame,
  CalendarCheck,
  CalendarDays,
  Trophy,
  CheckCircle,
  Brain,
  Zap,
  Moon,
  Sunrise,
  Star,
  Award,
  Gem,
} from 'lucide-react'
import { RARITY_CONFIG, type BadgeDefinition } from '../../data/badges'

interface BadgeUnlockModalProps {
  badge: BadgeDefinition
  xpEarned: number
  onClose: () => void
  isFirstUnlock?: boolean
}

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
  opacity: number
}

/**
 * Map icon names to Lucide components
 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  languages: Languages,
  library: Library,
  crown: Crown,
  flame: Flame,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  trophy: Trophy,
  'check-circle': CheckCircle,
  brain: Brain,
  sparkles: Sparkles,
  zap: Zap,
  moon: Moon,
  sunrise: Sunrise,
  star: Star,
  award: Award,
  gem: Gem,
}

/**
 * Confetti colors by rarity
 */
const CONFETTI_COLORS_BY_RARITY = {
  common: ['#9CA3AF', '#D1D5DB', '#6B7280', '#E5E7EB'],
  rare: ['#3B82F6', '#60A5FA', '#2563EB', '#93C5FD'],
  epic: ['#8B5CF6', '#A78BFA', '#7C3AED', '#C4B5FD'],
  legendary: ['#F59E0B', '#FBBF24', '#D97706', '#FCD34D', '#FFD700'],
}

export function BadgeUnlockModal({
  badge,
  xpEarned,
  onClose,
  isFirstUnlock = true,
}: BadgeUnlockModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])

  const rarityConfig = RARITY_CONFIG[badge.rarity]
  const IconComponent = ICON_MAP[badge.icon] || Star
  const confettiColors = CONFETTI_COLORS_BY_RARITY[badge.rarity]

  // Generate confetti particles
  const generateConfetti = useCallback(() => {
    const particles: ConfettiParticle[] = []
    const particleCount = badge.rarity === 'legendary' ? 200 :
                          badge.rarity === 'epic' ? 150 :
                          badge.rarity === 'rare' ? 100 : 60

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: 2 + Math.random() * 4,
        opacity: 1,
      })
    }

    return particles
  }, [badge.rarity, confettiColors])

  // Animate confetti
  useEffect(() => {
    if (!isVisible) return

    const particles = generateConfetti()
    setConfetti(particles)

    let animationFrame: number
    const startTime = Date.now()
    const duration = 4000

    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed >= duration) {
        setConfetti([])
        return
      }

      setConfetti((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y + p.velocityY,
          x: p.x + p.velocityX,
          rotation: p.rotation + 8,
          opacity: Math.max(0, 1 - elapsed / duration),
        }))
      )

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isVisible, generateConfetti])

  // Entry animation
  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    const contentTimer = setTimeout(() => setShowContent(true), 400)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  // Handle close with exit animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div
      className={`
        fixed inset-0 z-[400] flex items-center justify-center p-4
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Confetti Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              opacity: particle.opacity,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      {/* Glow Effect */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: rarityConfig.color }}
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white dark:bg-darkMode-surface
          rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rarity-colored top border */}
        <div
          className="h-2"
          style={{ backgroundColor: rarityConfig.color }}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full z-10
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover
            transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Title */}
          <div
            className={`
              mb-6 transition-all duration-500 delay-200
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className={`w-5 h-5 ${rarityConfig.textColor}`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${rarityConfig.textColor}`}>
                Badge Unlocked!
              </span>
              <Sparkles className={`w-5 h-5 ${rarityConfig.textColor}`} />
            </div>
          </div>

          {/* Badge Icon */}
          <div
            className={`
              relative inline-block mb-6
              transition-all duration-700 delay-300
              ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
            `}
          >
            <div
              className={`
                relative w-32 h-32 rounded-full
                flex items-center justify-center
                border-4 ${rarityConfig.borderColor}
                ${rarityConfig.bgColor}
                ${rarityConfig.glowClass}
              `}
            >
              <IconComponent
                className={`w-16 h-16 ${rarityConfig.textColor}`}
              />

              {/* Sparkle effects */}
              <Sparkles
                className={`
                  absolute -top-2 -right-2 w-6 h-6 animate-pulse
                  ${rarityConfig.textColor}
                `}
              />
              <Sparkles
                className={`
                  absolute -bottom-1 -left-1 w-5 h-5 animate-pulse
                  ${rarityConfig.textColor}
                `}
                style={{ animationDelay: '200ms' }}
              />
            </div>
          </div>

          {/* Badge Name */}
          <h2
            className={`
              text-2xl font-bold text-gray-900 dark:text-white mb-2
              transition-all duration-500 delay-400
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            {badge.name}
          </h2>

          {/* Description */}
          <p
            className={`
              text-gray-600 dark:text-gray-400 mb-4
              transition-all duration-500 delay-500
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            {badge.description}
          </p>

          {/* Rarity Tag */}
          <div
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
              ${rarityConfig.bgColor} border ${rarityConfig.borderColor}
              transition-all duration-500 delay-500
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <span className={`text-sm font-semibold ${rarityConfig.textColor}`}>
              {rarityConfig.label}
            </span>
          </div>

          {/* XP Reward */}
          <div
            className={`
              flex items-center justify-center gap-2 mb-6
              transition-all duration-500 delay-600
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <Gift className="w-5 h-5 text-accent-gold" />
            <span className="text-lg font-bold text-accent-gold">
              +{xpEarned} XP
            </span>
          </div>

          {/* Hidden badge discovery */}
          {badge.hidden && (
            <div
              className={`
                mb-6 px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/20
                border border-purple-200 dark:border-purple-800
                transition-all duration-500 delay-600
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You discovered a hidden badge!
              </p>
            </div>
          )}

          {/* First unlock indicator */}
          {isFirstUnlock && (
            <div
              className={`
                text-xs text-gray-500 dark:text-gray-400 mb-6
                transition-all duration-500 delay-600
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              First time unlocking this badge!
            </div>
          )}

          {/* Actions */}
          <div
            className={`
              flex gap-3
              transition-all duration-500 delay-700
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <button
              onClick={handleClose}
              className={`
                flex-1 py-3 px-6 rounded-xl font-semibold
                text-white
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200
              `}
              style={{ backgroundColor: rarityConfig.color }}
            >
              Awesome!
            </button>
            <button
              onClick={() => {
                // TODO: Implement share functionality
                console.log('Share badge:', badge.name)
              }}
              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-400
                hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
                transition-colors"
              title="Share badge"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeUnlockModal
