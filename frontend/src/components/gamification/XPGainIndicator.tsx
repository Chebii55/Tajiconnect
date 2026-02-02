/**
 * XPGainIndicator Component
 *
 * Floating +XP animation that appears when XP is earned.
 * Floats up 50px while fading out over 1.5 seconds.
 */

import { useEffect, useState } from 'react'
import { formatXP } from '../../utils/xpCalculator'

interface XPGainIndicatorProps {
  amount: number
  position: { x: number; y: number }
  onComplete: () => void
  id: string
}

export const XPGainIndicator = ({
  amount,
  position,
  onComplete,
  id,
}: XPGainIndicatorProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const animationFrame = requestAnimationFrame(() => {
      setIsAnimating(true)
    })

    // Cleanup after animation completes
    const timeout = setTimeout(() => {
      onComplete()
    }, 1500)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <div
      data-xp-indicator={id}
      className={`
        fixed pointer-events-none z-[200]
        font-bold text-lg
        transition-all duration-[1500ms] ease-out
        ${isAnimating ? 'opacity-0 -translate-y-[50px]' : 'opacity-100 translate-y-0'}
      `}
      style={{
        left: position.x,
        top: position.y,
        color: '#FFD700',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.5)',
      }}
    >
      <span className="flex items-center gap-1">
        <span className="text-xl">+</span>
        <span>{formatXP(amount)}</span>
        <span className="text-sm">XP</span>
      </span>
    </div>
  )
}

/**
 * XPGainIndicatorContainer
 *
 * Manages multiple XP indicators on screen.
 * Used with the useXPAnimation hook.
 */
interface XPIndicator {
  id: string
  amount: number
  position: { x: number; y: number }
}

interface XPGainIndicatorContainerProps {
  indicators: XPIndicator[]
  onRemove: (id: string) => void
}

export const XPGainIndicatorContainer = ({
  indicators,
  onRemove,
}: XPGainIndicatorContainerProps) => {
  return (
    <>
      {indicators.map((indicator) => (
        <XPGainIndicator
          key={indicator.id}
          id={indicator.id}
          amount={indicator.amount}
          position={indicator.position}
          onComplete={() => onRemove(indicator.id)}
        />
      ))}
    </>
  )
}

export default XPGainIndicator
