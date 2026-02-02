/**
 * LevelUpModal Component
 *
 * Celebration modal when user levels up.
 * Features confetti animation, scale entrance, and reward display.
 */

import { useEffect, useState, useCallback } from 'react'
import { Star, Trophy, Gift, X, Sparkles } from 'lucide-react'
import { getLevelTitle, isMilestoneLevel } from '../../utils/levelSystem'
import type { Badge } from '../../types/gamification'

interface LevelUpModalProps {
  newLevel: number
  previousLevel: number
  unlockedRewards?: Badge[]
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

const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#4CAF73', // Green
  '#3A7D44', // Forest Green
  '#FDC500', // Bright Gold
  '#6FCF97', // Light Green
  '#E6C97A', // Muted Gold
]

export const LevelUpModal = ({
  newLevel,
  previousLevel,
  unlockedRewards = [],
  onClose,
}: LevelUpModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const [showContent, setShowContent] = useState(false)

  const isMilestone = isMilestoneLevel(newLevel)
  const levelTitle = getLevelTitle(newLevel)
  const levelsGained = newLevel - previousLevel

  // Generate confetti particles
  const generateConfetti = useCallback(() => {
    const particles: ConfettiParticle[] = []
    const particleCount = isMilestone ? 150 : 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 3,
        velocityY: 2 + Math.random() * 3,
        opacity: 1,
      })
    }

    return particles
  }, [isMilestone])

  // Animate confetti
  useEffect(() => {
    if (!isVisible) return

    const particles = generateConfetti()
    setConfetti(particles)

    let animationFrame: number
    let startTime = Date.now()
    const duration = 3000 // 3 seconds

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
          rotation: p.rotation + 5,
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
    // Small delay before showing modal
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Delay content for staggered animation
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 400)

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
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

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

      {/* Modal Content */}
      <div
        className={`
          relative bg-white dark:bg-darkMode-surface
          rounded-2xl shadow-2xl max-w-md w-full
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-[0.8] opacity-0'}
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent-gold/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Level Badge */}
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
                  ${isMilestone
                    ? 'bg-gradient-to-br from-accent-gold via-accent-goldLight to-accent-gold'
                    : 'bg-gradient-to-br from-primary via-primary-light to-success'
                  }
                  flex items-center justify-center
                  shadow-lg
                `}
              >
                {/* Inner Circle */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-darkMode-surface flex items-center justify-center">
                  <div className="text-center">
                    <Star className={`w-6 h-6 mx-auto mb-1 ${isMilestone ? 'text-accent-gold' : 'text-primary'}`} />
                    <span className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text">
                      {newLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-gold animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-accent-goldLight animate-pulse delay-200" />
            </div>
          </div>

          {/* Title */}
          <div
            className={`
              mb-4 transition-all duration-500 delay-300
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-1">
              Level Up!
            </h2>
            <p className="text-lg text-forest-sage dark:text-darkMode-textSecondary">
              You reached <span className="font-semibold text-primary dark:text-darkMode-progress">Level {newLevel}</span>
            </p>
          </div>

          {/* Level Title */}
          <div
            className={`
              mb-6 transition-all duration-500 delay-400
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full
              ${isMilestone
                ? 'bg-accent-gold/10 text-accent-gold'
                : 'bg-primary/10 text-primary dark:bg-darkMode-progress/10 dark:text-darkMode-progress'
              }
            `}>
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">{levelTitle}</span>
            </div>
            {levelsGained > 1 && (
              <p className="text-sm text-forest-sage dark:text-darkMode-textMuted mt-2">
                +{levelsGained} levels gained!
              </p>
            )}
          </div>

          {/* Unlocked Rewards */}
          {unlockedRewards.length > 0 && (
            <div
              className={`
                mb-6 transition-all duration-500 delay-500
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <h3 className="text-sm font-medium text-forest-sage dark:text-darkMode-textMuted mb-3">
                Rewards Unlocked
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {unlockedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-darkMode-bg rounded-lg"
                  >
                    <Gift className="w-4 h-4 text-accent-gold" />
                    <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                      {reward.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleClose}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold
              ${isMilestone
                ? 'bg-gradient-to-r from-accent-gold to-accent-goldLight text-neutral-dark hover:shadow-gold'
                : 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-forest'
              }
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  )
}

export default LevelUpModal
