/**
 * Goal Completed Modal Component
 *
 * Celebration modal displayed when user achieves their daily learning goal.
 * Shows bonus XP earned, goal streak, and options to continue or finish.
 */

import React, { useEffect, useState } from 'react'
import { Target, Star, Trophy, Zap, ArrowRight, X, Sparkles } from 'lucide-react'
import { useGoalsStore } from '../../stores/goalsStore'
import { Link } from 'react-router-dom'

interface GoalCompletedModalProps {
  /** Callback when modal is dismissed */
  onClose?: () => void
  /** Callback when user chooses to continue learning */
  onContinue?: () => void
}

/**
 * Bonus XP for meeting daily goal
 */
const GOAL_BONUS_XP = 25

/**
 * Confetti particle component
 */
const Confetti: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  return (
    <div
      className={`absolute w-2 h-2 ${color} rounded-full animate-confetti`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${1000 + Math.random() * 1000}ms`,
      }}
    />
  )
}

const GoalCompletedModal: React.FC<GoalCompletedModalProps> = ({
  onClose,
  onContinue,
}) => {
  const { showGoalCompletedModal, dismissGoalCompletedModal, getTodayProgress, goalStreak } =
    useGoalsStore()

  const [xpAnimated, setXpAnimated] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const progress = getTodayProgress()

  // Animate XP counter
  useEffect(() => {
    if (!showGoalCompletedModal) return

    setShowConfetti(true)
    const targetXP = GOAL_BONUS_XP

    let current = 0
    const step = Math.ceil(targetXP / 20)
    const interval = setInterval(() => {
      current = Math.min(current + step, targetXP)
      setXpAnimated(current)
      if (current >= targetXP) {
        clearInterval(interval)
      }
    }, 50)

    // Hide confetti after animation
    const confettiTimeout = setTimeout(() => setShowConfetti(false), 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(confettiTimeout)
    }
  }, [showGoalCompletedModal])

  const handleClose = () => {
    dismissGoalCompletedModal()
    onClose?.()
  }

  const handleContinue = () => {
    dismissGoalCompletedModal()
    onContinue?.()
  }

  if (!showGoalCompletedModal) return null

  const confettiColors = [
    'bg-yellow-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-pink-400',
    'bg-purple-400',
    'bg-orange-400',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-darkMode-surface rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* Confetti Container */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <Confetti
                key={i}
                delay={i * 30}
                color={confettiColors[i % confettiColors.length]}
              />
            ))}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-darkMode-textMuted dark:hover:text-darkMode-text rounded-full hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="relative pt-8 pb-12 px-6 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white text-center">
          <div className="absolute inset-0 opacity-10">
            <Sparkles className="absolute top-4 left-8 w-8 h-8" />
            <Sparkles className="absolute top-12 right-12 w-6 h-6" />
            <Sparkles className="absolute bottom-8 left-16 w-5 h-5" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-pulse">
              <Target className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Daily Goal Achieved!</h2>
            <p className="text-green-100">
              You completed {progress.completed} {progress.completed === 1 ? 'lesson' : 'lessons'} today
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* XP Bonus */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">Bonus XP Earned</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                +{xpAnimated} XP
              </p>
            </div>
          </div>

          {/* Goal Streak */}
          {goalStreak.current > 0 && (
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">Goal Streak</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {goalStreak.current} {goalStreak.current === 1 ? 'day' : 'days'} in a row!
                  </p>
                </div>
              </div>
              {goalStreak.current >= goalStreak.longest && goalStreak.current > 1 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-200 dark:bg-orange-800/50 rounded-full">
                  <Star className="w-4 h-4 text-orange-600 dark:text-orange-400 fill-current" />
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                    New Record!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Encouragement */}
          <div className="text-center py-2">
            <p className="text-gray-600 dark:text-darkMode-textSecondary">
              {goalStreak.current >= 7
                ? 'You are on fire! Keep the momentum going!'
                : goalStreak.current >= 3
                ? 'Building great habits! Keep it up!'
                : 'Great start! Come back tomorrow to grow your streak.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/student/courses"
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-xl hover:bg-primary-dark dark:hover:bg-darkMode-accent transition-colors"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleClose}
              className="w-full py-3 text-gray-600 dark:text-darkMode-textSecondary font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              Done for Today
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default GoalCompletedModal
