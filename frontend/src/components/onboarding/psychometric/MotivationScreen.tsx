/**
 * MotivationScreen Component
 * Screen 1 of psychometric onboarding - Why learning
 */

import type { Motivation } from '../../../utils/learnerArchetype'
import OptionCard from './OptionCard'
import ProgressIndicator from './ProgressIndicator'

interface MotivationScreenProps {
  value: Motivation | null
  onSelect: (value: Motivation) => void
  onSkip?: () => void
}

const motivationOptions: Array<{ emoji: string; label: string; value: Motivation }> = [
  { emoji: '1F393', label: 'School/Exams', value: 'school' },
  { emoji: '1F30D', label: 'Culture & heritage', value: 'culture' },
  { emoji: '1F4AC', label: 'Communication', value: 'communication' },
  { emoji: '2708', label: 'Travel', value: 'travel' },
  { emoji: '2764', label: 'Personal interest', value: 'personal' },
]

// Convert unicode code points to emoji
const toEmoji = (codePoint: string): string => {
  return String.fromCodePoint(parseInt(codePoint, 16))
}

const MotivationScreen: React.FC<MotivationScreenProps> = ({
  value,
  onSelect,
  onSkip,
}) => {
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="mb-6">
        <ProgressIndicator currentStep={1} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          Why do you want to learn this language?
        </h2>
        <p className="text-gray-500 dark:text-darkMode-textSecondary">
          Select the option that best describes your motivation
        </p>
      </div>

      <div className="flex-grow space-y-3">
        {motivationOptions.map((option) => (
          <OptionCard
            key={option.value}
            emoji={toEmoji(option.emoji)}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onSelect={(v) => onSelect(v as Motivation)}
            testId={`motivation-${option.value}`}
          />
        ))}
      </div>

      {onSkip && (
        <div className="mt-6 text-center">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 dark:text-darkMode-textSecondary hover:text-gray-700 dark:hover:text-darkMode-text underline"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  )
}

export default MotivationScreen
