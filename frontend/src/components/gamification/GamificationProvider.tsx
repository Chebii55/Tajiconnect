/**
 * GamificationProvider Component
 *
 * Global provider that handles XP animations and level-up modals.
 * Wraps the application to provide gamification UI overlays.
 */

import { useEffect } from 'react'
import { XPGainIndicatorContainer } from './XPGainIndicator'
import { LevelUpModal } from './LevelUpModal'
import { useXPAnimation } from '../../hooks/useXPAnimation'
import { useLevelUp } from '../../hooks/useLevelUp'
import { useGamificationStore, initializeGamificationListeners } from '../../stores/gamificationStore'

interface GamificationProviderProps {
  children: React.ReactNode
}

export const GamificationProvider = ({ children }: GamificationProviderProps) => {
  const { indicators, removeIndicator } = useXPAnimation({ autoListen: true })
  const { isOpen, newLevel, previousLevel, unlockedRewards, closeModal } = useLevelUp()

  // Initialize gamification event listeners
  useEffect(() => {
    const cleanup = initializeGamificationListeners()

    // Check streak and record daily login on mount
    const store = useGamificationStore.getState()
    store.checkStreak()

    return cleanup
  }, [])

  return (
    <>
      {children}

      {/* XP Gain Indicators */}
      <XPGainIndicatorContainer indicators={indicators} onRemove={removeIndicator} />

      {/* Level Up Modal */}
      {isOpen && (
        <LevelUpModal
          newLevel={newLevel}
          previousLevel={previousLevel}
          unlockedRewards={unlockedRewards}
          onClose={closeModal}
        />
      )}
    </>
  )
}

export default GamificationProvider
