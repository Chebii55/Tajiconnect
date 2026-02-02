import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { TrainerProvider } from './contexts/TrainerContext'
import { RecommendationsProvider } from './contexts/RecommendationsContext'
import { LearningPathProvider } from './contexts/LearningPathContext'
import { RealTimeProvider } from './contexts/RealTimeContext'
import { useGamificationStore, initializeGamificationListeners } from './stores/gamificationStore'
import { useUserProfileStore } from './stores/userProfileStore'
import './App.css'

/**
 * Initialize gamification and user profile stores on app mount
 */
function StoreInitializer() {
  const checkStreak = useGamificationStore((state) => state.checkStreak)
  const loadGamificationFromServer = useGamificationStore((state) => state.loadFromServer)
  const loadProfileFromServer = useUserProfileStore((state) => state.loadFromServer)

  useEffect(() => {
    // Initialize event listeners for cross-feature communication
    const cleanupListeners = initializeGamificationListeners()

    // Check streak status on mount
    checkStreak()

    // Load data from server (when API is ready)
    loadGamificationFromServer()
    loadProfileFromServer()

    return () => {
      cleanupListeners()
    }
  }, [checkStreak, loadGamificationFromServer, loadProfileFromServer])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <TrainerProvider>
          <RecommendationsProvider>
            <LearningPathProvider>
              <RealTimeProvider>
                <StoreInitializer />
                <RouterProvider router={router} />
                {/* <PerformanceMonitor /> */}
              </RealTimeProvider>
            </LearningPathProvider>
          </RecommendationsProvider>
        </TrainerProvider>
      </OnboardingProvider>
    </ThemeProvider>
  )
}

export default App
