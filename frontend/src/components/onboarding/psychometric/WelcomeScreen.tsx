/**
 * WelcomeScreen Component
 * Screen 0 of psychometric onboarding - Welcome message
 */

import { Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-darkMode-link/10 flex items-center justify-center mb-6 mx-auto">
          <Sparkles className="w-10 h-10 text-primary dark:text-darkMode-link" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-darkMode-text mb-4">
          Welcome to Tajiconnect
        </h1>
        <p className="text-lg text-gray-600 dark:text-darkMode-textSecondary max-w-sm mx-auto">
          Let&apos;s personalize your learning experience. This takes less than 2 minutes.
        </p>
      </div>

      <button
        onClick={onStart}
        className="
          px-8 py-4 rounded-xl font-semibold text-lg
          bg-primary dark:bg-darkMode-link text-white
          hover:bg-primary-dark dark:hover:bg-darkMode-linkHover
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkMode-focus
          active:scale-[0.98]
          min-w-[200px]
        "
      >
        Start learning
      </button>

      <p className="mt-8 text-sm text-gray-500 dark:text-darkMode-textSecondary">
        Quick 5-question assessment
      </p>
    </div>
  )
}

export default WelcomeScreen
