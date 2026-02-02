/**
 * useXPAnimation Hook
 *
 * Manages XP gain animations triggered by the event bus.
 * Creates floating +XP indicators at cursor position or specified coordinates.
 */

import { useState, useCallback, useEffect } from 'react'
import { eventBus } from '../lib/eventBus'
import type { XPSource } from '../types/gamification'

export interface XPIndicator {
  id: string
  amount: number
  position: { x: number; y: number }
  source: XPSource
}

interface UseXPAnimationOptions {
  /**
   * Default position for XP indicators when no position is specified.
   * Defaults to center-top of viewport.
   */
  defaultPosition?: { x: number; y: number }

  /**
   * Maximum number of simultaneous indicators.
   * Older indicators are removed when limit is reached.
   */
  maxIndicators?: number

  /**
   * Whether to listen to event bus automatically.
   */
  autoListen?: boolean
}

interface UseXPAnimationReturn {
  /** Active XP indicators to render */
  indicators: XPIndicator[]

  /** Manually trigger an XP animation */
  triggerXP: (amount: number, position?: { x: number; y: number }, source?: XPSource) => void

  /** Remove a specific indicator by ID */
  removeIndicator: (id: string) => void

  /** Clear all indicators */
  clearAll: () => void
}

/**
 * Generate unique ID for each indicator
 */
const generateId = (): string => {
  return `xp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get default position (center-top of viewport)
 */
const getDefaultPosition = (): { x: number; y: number } => {
  if (typeof window === 'undefined') {
    return { x: 200, y: 100 }
  }
  return {
    x: window.innerWidth / 2 - 30, // Offset for indicator width
    y: 120, // Below navbar
  }
}

/**
 * Get mouse position from last known event
 */
let lastMousePosition = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mousemove',
    (e) => {
      lastMousePosition = { x: e.clientX, y: e.clientY }
    },
    { passive: true }
  )
}

export function useXPAnimation(options: UseXPAnimationOptions = {}): UseXPAnimationReturn {
  const {
    defaultPosition,
    maxIndicators = 5,
    autoListen = true,
  } = options

  const [indicators, setIndicators] = useState<XPIndicator[]>([])

  /**
   * Trigger an XP animation at the specified position
   */
  const triggerXP = useCallback(
    (amount: number, position?: { x: number; y: number }, source: XPSource = 'lesson') => {
      const finalPosition = position || defaultPosition || lastMousePosition || getDefaultPosition()

      // Add some randomness to prevent stacking
      const offsetX = (Math.random() - 0.5) * 40
      const offsetY = (Math.random() - 0.5) * 20

      const newIndicator: XPIndicator = {
        id: generateId(),
        amount,
        position: {
          x: finalPosition.x + offsetX,
          y: finalPosition.y + offsetY,
        },
        source,
      }

      setIndicators((prev) => {
        // Remove oldest if at max
        const updated = prev.length >= maxIndicators ? prev.slice(1) : prev
        return [...updated, newIndicator]
      })
    },
    [defaultPosition, maxIndicators]
  )

  /**
   * Remove a specific indicator
   */
  const removeIndicator = useCallback((id: string) => {
    setIndicators((prev) => prev.filter((i) => i.id !== id))
  }, [])

  /**
   * Clear all indicators
   */
  const clearAll = useCallback(() => {
    setIndicators([])
  }, [])

  /**
   * Listen to event bus for XP earned events
   */
  useEffect(() => {
    if (!autoListen) return

    const unsubscribe = eventBus.on('xp:earned', ({ amount, source }) => {
      // Use last known mouse position or default
      triggerXP(amount, undefined, source)
    })

    return unsubscribe
  }, [autoListen, triggerXP])

  return {
    indicators,
    triggerXP,
    removeIndicator,
    clearAll,
  }
}

/**
 * Hook to trigger XP animation at element position
 */
export function useXPAnimationAtElement() {
  const { triggerXP, ...rest } = useXPAnimation({ autoListen: false })

  /**
   * Trigger XP animation centered on a DOM element
   */
  const triggerAtElement = useCallback(
    (element: HTMLElement | null, amount: number, source?: XPSource) => {
      if (!element) {
        triggerXP(amount, undefined, source)
        return
      }

      const rect = element.getBoundingClientRect()
      const position = {
        x: rect.left + rect.width / 2 - 30, // Offset for indicator width
        y: rect.top,
      }

      triggerXP(amount, position, source)
    },
    [triggerXP]
  )

  return {
    ...rest,
    triggerXP,
    triggerAtElement,
  }
}

export default useXPAnimation
