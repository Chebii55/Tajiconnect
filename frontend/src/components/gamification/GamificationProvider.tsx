/**
 * GamificationProvider Component
 *
 * Global provider that handles XP animations, level-up modals,
 * streak milestones, and streak warnings.
 * Wraps the application to provide gamification UI overlays.
 */

import { useEffect } from 'react'
import { XPGainIndicatorContainer } from './XPGainIndicator'
import { LevelUpModal } from './LevelUpModal'
import { StreakMilestoneModal } from './StreakMilestoneModal'
import { StreakWarning } from './StreakWarning'
import { useXPAnimation } from '../../hooks/useXPAnimation'
import { useLevelUp } from '../../hooks/useLevelUp'
import { useGamificationStore, initializeGamificationListeners } from '../../stores/gamificationStore'
import { getMilestoneInfo, type MilestoneDay } from '../../lib/streakEngine'

interface GamificationProviderProps {
  children: React.ReactNode
}

export const GamificationProvider = ({ children }: GamificationProviderProps) => {
  const { indicators, removeIndicator } = useXPAnimation({ autoListen: true })
  const { isOpen, newLevel, previousLevel, unlockedRewards, closeModal } = useLevelUp()

  // Streak milestone state from store
  const showMilestoneModal = useGamificationStore((state) => state.showMilestoneModal)
  const pendingMilestone = useGamificationStore((state) => state.pendingMilestone)
  const currentStreak = useGamificationStore((state) => state.currentStreak)
  const streakFreezes = useGamificationStore((state) => state.streakFreezes)
  const closeMilestoneModal = useGamificationStore((state) => state.closeMilestoneModal)
  const isStreakAtRisk = useGamificationStore((state) => state.isStreakAtRisk)

  // Initialize gamification event listeners
  useEffect(() => {
    const cleanup = initializeGamificationListeners()

    // Check streak and record daily login on mount
    const store = useGamificationStore.getState()
    store.checkStreak()

    // Set up periodic streak check (every minute)
    const streakCheckInterval = setInterval(() => {
      useGamificationStore.getState().checkStreak()
    }, 60000)

    return () => {
      cleanup()
      clearInterval(streakCheckInterval)
    }
  }, [])

  // Get milestone info for the modal
  const milestoneInfo = pendingMilestone ? getMilestoneInfo(pendingMilestone) : null

  return (
    <>
      {/* Streak Warning Banner - shows at top when at risk */}
      {isStreakAtRisk && <StreakWarning />}

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

      {/* Streak Milestone Modal */}
      {showMilestoneModal && pendingMilestone && milestoneInfo && (
        <StreakMilestoneModal
          milestone={pendingMilestone}
          currentStreak={currentStreak}
          freezesAwarded={milestoneInfo.freezeReward}
          badgeId={milestoneInfo.badgeId}
          onClose={closeMilestoneModal}
        />
      )}
    </>
  )
}

export default GamificationProvider
