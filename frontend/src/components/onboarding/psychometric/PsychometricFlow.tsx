/**
 * PsychometricFlow Component
 * Main orchestrator for the 90-second psychometric onboarding assessment
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader, Shield } from 'lucide-react'
import { useOnboarding } from '../../../contexts/OnboardingContext'
import { onboardingService } from '../../../services/api/onboarding'
import {
  deriveArchetype,
  getArchetypeDescription,
  getDailyXPGoal,
  type Motivation,
  type Level,
  type LearningStyleType,
  type TimeCommitmentType,
  type LearnerProfile,
} from '../../../utils/learnerArchetype'

import WelcomeScreen from './WelcomeScreen'
import MotivationScreen from './MotivationScreen'
import LevelScreen from './LevelScreen'
import LearningStyleScreen from './LearningStyleScreen'
import TimeCommitmentScreen from './TimeCommitmentScreen'
import LanguageScreen from './LanguageScreen'

type Screen = 'welcome' | 'motivation' | 'level' | 'style' | 'time' | 'language' | 'complete'

interface PsychometricData {
  motivation: Motivation | null
  level: Level | null
  learningStyle: LearningStyleType | null
  timeCommitment: TimeCommitmentType | null
  targetLanguage: string | null
}

const SCREEN_ORDER: Screen[] = ['welcome', 'motivation', 'level', 'style', 'time', 'language', 'complete']

const PsychometricFlow: React.FC = () => {
  const navigate = useNavigate()
  const { updateData } = useOnboarding()

  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [psychometricData, setPsychometricData] = useState<PsychometricData>({
    motivation: null,
    level: null,
    learningStyle: null,
    timeCommitment: null,
    targetLanguage: null,
  })

  const currentIndex = SCREEN_ORDER.indexOf(currentScreen)

  const goToNextScreen = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex < SCREEN_ORDER.length) {
      setCurrentScreen(SCREEN_ORDER[nextIndex])
    }
  }, [currentIndex])

  const goToPreviousScreen = useCallback(() => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setCurrentScreen(SCREEN_ORDER[prevIndex])
    }
  }, [currentIndex])

  const handleMotivationSelect = useCallback((value: Motivation) => {
    setPsychometricData(prev => ({ ...prev, motivation: value }))
    goToNextScreen()
  }, [goToNextScreen])

  const handleLevelSelect = useCallback((value: Level) => {
    setPsychometricData(prev => ({ ...prev, level: value }))
    goToNextScreen()
  }, [goToNextScreen])

  const handleStyleSelect = useCallback((value: LearningStyleType) => {
    setPsychometricData(prev => ({ ...prev, learningStyle: value }))
    goToNextScreen()
  }, [goToNextScreen])

  const handleTimeSelect = useCallback((value: TimeCommitmentType) => {
    setPsychometricData(prev => ({ ...prev, timeCommitment: value }))
    goToNextScreen()
  }, [goToNextScreen])

  const handleLanguageSelect = useCallback(async (value: string) => {
    const updatedData = { ...psychometricData, targetLanguage: value }
    setPsychometricData(updatedData)

    // All data collected, submit
    await submitProfile(updatedData)
  }, [psychometricData])

  const submitProfile = async (data: PsychometricData) => {
    // Validate all required fields
    if (!data.motivation || !data.level || !data.learningStyle || !data.timeCommitment || !data.targetLanguage) {
      setError('Please complete all questions before continuing.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Build the learner profile
      const profile: LearnerProfile = {
        motivation: data.motivation,
        level: data.level,
        learningStyle: data.learningStyle,
        timeCommitment: data.timeCommitment,
        targetLanguage: data.targetLanguage,
      }

      // Derive archetype
      const archetype = deriveArchetype(profile)
      profile.archetype = archetype

      // Calculate daily XP goal
      const dailyXPGoal = getDailyXPGoal(data.timeCommitment)

      // Update local context
      updateData({
        learningStyle: data.learningStyle,
        timeCommitment: data.timeCommitment,
        primaryInterest: data.targetLanguage,
      })

      // Submit to backend
      await onboardingService.completeStep('psychometric_assessment', {
        motivation: data.motivation,
        level: data.level,
        learning_style: data.learningStyle,
        time_commitment: data.timeCommitment,
        target_language: data.targetLanguage,
        archetype: archetype,
        daily_xp_goal: dailyXPGoal,
        completed_at: new Date().toISOString(),
      })

      // Store profile data in localStorage for persistence
      localStorage.setItem('learnerProfile', JSON.stringify(profile))
      localStorage.setItem('psychometricComplete', 'true')

      // Navigate to completion screen then dashboard
      setCurrentScreen('complete')

      // Auto-navigate after showing completion
      setTimeout(() => {
        navigate('/student/dashboard', { replace: true })
      }, 3000)
    } catch (err) {
      console.error('Failed to submit psychometric profile:', err)
      setError('Failed to save your preferences. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleSkip = useCallback(() => {
    // Allow skipping with defaults
    const defaults: PsychometricData = {
      motivation: 'personal',
      level: 'new',
      learningStyle: 'mixed',
      timeCommitment: 'short',
      targetLanguage: 'swahili',
    }
    submitProfile(defaults)
  }, [])

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={goToNextScreen} />

      case 'motivation':
        return (
          <MotivationScreen
            value={psychometricData.motivation}
            onSelect={handleMotivationSelect}
          />
        )

      case 'level':
        return (
          <LevelScreen
            value={psychometricData.level}
            onSelect={handleLevelSelect}
          />
        )

      case 'style':
        return (
          <LearningStyleScreen
            value={psychometricData.learningStyle}
            onSelect={handleStyleSelect}
          />
        )

      case 'time':
        return (
          <TimeCommitmentScreen
            value={psychometricData.timeCommitment}
            onSelect={handleTimeSelect}
          />
        )

      case 'language':
        return (
          <LanguageScreen
            value={psychometricData.targetLanguage}
            onSelect={handleLanguageSelect}
          />
        )

      case 'complete':
        return <CompletionScreen archetype={psychometricData.motivation && psychometricData.level && psychometricData.learningStyle && psychometricData.timeCommitment
          ? deriveArchetype({
            motivation: psychometricData.motivation,
            level: psychometricData.level,
            learningStyle: psychometricData.learningStyle,
            timeCommitment: psychometricData.timeCommitment,
            targetLanguage: psychometricData.targetLanguage || '',
          })
          : 'casual'
        } />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-xl w-full max-w-md border dark:border-darkMode-border overflow-hidden">
        {/* Header with back button (shown after welcome) */}
        {currentScreen !== 'welcome' && currentScreen !== 'complete' && (
          <div className="px-6 pt-4 flex items-center justify-between">
            <button
              onClick={goToPreviousScreen}
              disabled={isSubmitting}
              className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-darkMode-textSecondary hover:text-gray-700 dark:hover:text-darkMode-text hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors disabled:opacity-50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-sm text-gray-500 dark:text-darkMode-textSecondary hover:text-gray-700 dark:hover:text-darkMode-text disabled:opacity-50"
            >
              Skip all
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader className="w-12 h-12 text-primary dark:text-darkMode-link animate-spin mb-4" />
              <p className="text-gray-600 dark:text-darkMode-textSecondary">
                Setting up your personalized experience...
              </p>
            </div>
          ) : (
            renderScreen()
          )}
        </div>
      </div>
    </div>
  )
}

// Completion screen component
interface CompletionScreenProps {
  archetype: string
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ archetype }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="mb-6">
        <div className="text-6xl mb-4">
          {String.fromCodePoint(0x1F389)}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          All set!
        </h2>
        <p className="text-lg text-gray-600 dark:text-darkMode-textSecondary">
          Your learning path is ready.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg p-4 mb-6 w-full max-w-sm">
        <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">
          {getArchetypeDescription(archetype as 'structured' | 'cultural_explorer' | 'casual' | 'conversational')}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-darkMode-textSecondary">
        <Shield className="w-4 h-4" />
        <p>Your answers help us personalize your experience. We never sell your data.</p>
      </div>

      <div className="mt-6">
        <Loader className="w-6 h-6 text-primary dark:text-darkMode-link animate-spin" />
        <p className="text-sm text-gray-500 dark:text-darkMode-textSecondary mt-2">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  )
}

export default PsychometricFlow
