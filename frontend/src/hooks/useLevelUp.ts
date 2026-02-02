/**
 * useLevelUp Hook
 *
 * Manages level-up modal state triggered by the event bus.
 * Automatically shows celebration modal when user levels up.
 */

import { useState, useCallback, useEffect } from 'react'
import { eventBus } from '../lib/eventBus'
import type { Badge } from '../types/gamification'

interface LevelUpState {
  isOpen: boolean
  newLevel: number
  previousLevel: number
  totalXP: number
  unlockedRewards: Badge[]
}

interface UseLevelUpReturn {
  /** Whether the level-up modal is open */
  isOpen: boolean

  /** New level reached */
  newLevel: number

  /** Previous level before level-up */
  previousLevel: number

  /** Any rewards unlocked at this level */
  unlockedRewards: Badge[]

  /** Close the level-up modal */
  closeModal: () => void

  /** Manually trigger a level-up celebration */
  triggerLevelUp: (newLevel: number, previousLevel: number, rewards?: Badge[]) => void
}

/**
 * Hook to manage level-up modal state
 */
export function useLevelUp(): UseLevelUpReturn {
  const [state, setState] = useState<LevelUpState>({
    isOpen: false,
    newLevel: 1,
    previousLevel: 1,
    totalXP: 0,
    unlockedRewards: [],
  })

  /**
   * Close the modal
   */
  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  /**
   * Manually trigger level-up celebration
   */
  const triggerLevelUp = useCallback(
    (newLevel: number, previousLevel: number, rewards: Badge[] = []) => {
      setState({
        isOpen: true,
        newLevel,
        previousLevel,
        totalXP: 0,
        unlockedRewards: rewards,
      })
    },
    []
  )

  /**
   * Listen to event bus for level-up events
   */
  useEffect(() => {
    const unsubscribe = eventBus.on('level:up', ({ newLevel, previousLevel, totalXP }) => {
      // Small delay to let XP animation play first
      setTimeout(() => {
        setState({
          isOpen: true,
          newLevel,
          previousLevel,
          totalXP,
          unlockedRewards: [], // TODO: Fetch unlocked rewards from store
        })
      }, 500)
    })

    return unsubscribe
  }, [])

  return {
    isOpen: state.isOpen,
    newLevel: state.newLevel,
    previousLevel: state.previousLevel,
    unlockedRewards: state.unlockedRewards,
    closeModal,
    triggerLevelUp,
  }
}

export default useLevelUp
