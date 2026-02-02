/**
 * StreakMilestoneModal Component
 *
 * Celebration modal for streak milestones (7, 30, 100 days).
 * Features confetti animations, freeze rewards, and badge display.
 */

import { useEffect, useState, useCallback } from 'react'
import { Flame, Snowflake, X, Sparkles, Award, Calendar, Star } from 'lucide-react'
import { STREAK_MILESTONES, type MilestoneDay } from '../../lib/streakEngine'

interface StreakMilestoneModalProps {
  milestone: MilestoneDay
  currentStreak: number
  freezesAwarded: number
  badgeId: string | null
  onClose: () => void
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

// Confetti colors for different milestones
const CONFETTI_COLORS = {
  blue: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#1D4ED8'],
  gold: ['#FFD700', '#FFC107', '#FFEB3B', '#FFF176', '#F59E0B', '#D97706'],
  rainbow: [
    '#FF6B6B', '#FF9E43', '#FFD93D', '#6BCB77', '#4D96FF',
    '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4', '#FEE440',
  ],
}

export const StreakMilestoneModal = ({
  milestone,
  currentStreak,
  freezesAwarded,
  badgeId,
  onClose,
}: StreakMilestoneModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const [showContent, setShowContent] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  const milestoneInfo = STREAK_MILESTONES[milestone]
  const confettiType = milestoneInfo.confettiType

  // Generate confetti particles
  const generateConfetti = useCallback(() => {
    const particles: ConfettiParticle[] = []
    const colors = CONFETTI_COLORS[confettiType]
    const particleCount = confettiType === 'rainbow' ? 200 : confettiType === 'gold' ? 150 : 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: 2 + Math.random() * 4,
        opacity: 1,
      })
    }

    return particles
  }, [confettiType])

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
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 400)

    // Show fireworks for gold and rainbow
    if (confettiType === 'gold' || confettiType === 'rainbow') {
      const fireworksTimer = setTimeout(() => {
        setShowFireworks(true)
      }, 600)
      return () => {
        clearTimeout(showTimer)
        clearTimeout(contentTimer)
        clearTimeout(fireworksTimer)
      }
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(contentTimer)
    }
  }, [confettiType])

  // Handle close with exit animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Get gradient based on milestone
  const getGradient = () => {
    switch (confettiType) {
      case 'rainbow':
        return 'from-purple-500 via-pink-500 to-red-500'
      case 'gold':
        return 'from-yellow-400 via-amber-500 to-orange-500'
      default:
        return 'from-blue-400 via-blue-500 to-indigo-500'
    }
  }

  return (
    <div
      className={`
        fixed inset-0 z-[300] flex items-center justify-center p-4
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
              boxShadow: confettiType === 'gold' ? `0 0 6px ${particle.color}` : 'none',
            }}
          />
        ))}
      </div>

      {/* Fireworks effect for higher milestones */}
      {showFireworks && (confettiType === 'gold' || confettiType === 'rainbow') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(confettiType === 'rainbow' ? 8 : 5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1.5s',
              }}
            >
              <Sparkles
                className={`w-8 h-8 ${
                  confettiType === 'rainbow' ? 'text-pink-400' : 'text-yellow-400'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div
        className={`
          relative bg-white dark:bg-darkMode-surface
          rounded-2xl shadow-2xl max-w-md w-full
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-[0.8] opacity-0'}
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover
            transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Glow Effect */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b ${getGradient()} opacity-30 rounded-full blur-3xl`}
        />

        {/* Top Banner */}
        <div className={`relative h-3 bg-gradient-to-r ${getGradient()}`} />

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Milestone Badge */}
          <div
            className={`
              relative inline-block mb-6
              transition-all duration-700 delay-200
              ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
            `}
          >
            <div className="relative">
              {/* Outer Ring */}
              <div
                className={`
                  w-28 h-28 rounded-full
                  bg-gradient-to-br ${getGradient()}
                  flex items-center justify-center
                  shadow-xl
                  ${showContent ? 'animate-bounce' : ''}
                `}
                style={{ animationDuration: '2s', animationIterationCount: 3 }}
              >
                {/* Inner Circle */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-darkMode-surface flex items-center justify-center">
                  <div className="text-center">
                    <Flame
                      className={`w-8 h-8 mx-auto mb-1 ${
                        confettiType === 'rainbow'
                          ? 'text-purple-500'
                          : confettiType === 'gold'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }`}
                    />
                    <span className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">
                      {currentStreak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkle Effects */}
              <Sparkles
                className={`absolute -top-2 -right-2 w-7 h-7 ${
                  confettiType === 'rainbow' ? 'text-pink-400' : 'text-yellow-400'
                } animate-pulse`}
              />
              <Star
                className={`absolute -bottom-1 -left-1 w-5 h-5 ${
                  confettiType === 'rainbow' ? 'text-purple-400' : 'text-amber-400'
                } animate-pulse delay-200`}
                fill="currentColor"
              />
            </div>
          </div>

          {/* Title */}
          <div
            className={`
              mb-4 transition-all duration-500 delay-300
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <h2
              className={`
                text-2xl font-bold mb-1
                bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent
              `}
            >
              {milestoneInfo.title}
            </h2>
            <p className="text-lg text-forest-sage dark:text-darkMode-textSecondary">
              {milestoneInfo.description}
            </p>
          </div>

          {/* Rewards Section */}
          <div
            className={`
              mb-6 transition-all duration-500 delay-400
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <h3 className="text-sm font-medium text-forest-sage dark:text-darkMode-textMuted mb-3">
              Rewards Earned
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Freeze Reward */}
              <div
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg
                  border border-blue-100 dark:border-blue-900/30"
              >
                <Snowflake className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  +{freezesAwarded} Streak {freezesAwarded === 1 ? 'Freeze' : 'Freezes'}
                </span>
              </div>

              {/* Badge Reward */}
              {badgeId && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border
                    ${
                      confettiType === 'rainbow'
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30'
                        : confettiType === 'gold'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
                    }
                  `}
                >
                  <Award
                    className={`w-5 h-5 ${
                      confettiType === 'rainbow'
                        ? 'text-purple-500'
                        : confettiType === 'gold'
                        ? 'text-amber-500'
                        : 'text-blue-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      confettiType === 'rainbow'
                        ? 'text-purple-700 dark:text-purple-400'
                        : confettiType === 'gold'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {milestoneInfo.badgeId === 'week-warrior'
                      ? 'Week Warrior Badge'
                      : milestoneInfo.badgeId === 'month-master'
                      ? 'Month Master Badge'
                      : 'Century Club Badge'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Streak Stats */}
          <div
            className={`
              flex justify-center gap-6 mb-6 transition-all duration-500 delay-500
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-forest-sage dark:text-darkMode-textMuted text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Days
              </div>
              <span className="text-xl font-bold text-neutral-dark dark:text-darkMode-text">
                {currentStreak}
              </span>
            </div>
            <div className="w-px bg-border-light dark:bg-darkMode-border" />
            <div className="text-center">
              <div className="text-forest-sage dark:text-darkMode-textMuted text-xs mb-1">
                XP Bonus
              </div>
              <span
                className={`text-xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}
              >
                +{milestone >= 100 ? 100 : milestone >= 30 ? 50 : milestone >= 7 ? 10 : 0}%
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleClose}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold
              bg-gradient-to-r ${getGradient()} text-white
              shadow-lg hover:shadow-xl
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            Keep the Streak Going!
          </button>
        </div>
      </div>
    </div>
  )
}

export default StreakMilestoneModal
