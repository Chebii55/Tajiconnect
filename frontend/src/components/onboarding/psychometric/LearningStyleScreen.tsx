/**
 * LearningStyleScreen Component
 * Screen 3 of psychometric onboarding - Learning preference
 */

import type { LearningStyleType } from '../../../utils/learnerArchetype'
import OptionCard from './OptionCard'
import ProgressIndicator from './ProgressIndicator'

interface LearningStyleScreenProps {
  value: LearningStyleType | null
  onSelect: (value: LearningStyleType) => void
  onSkip?: () => void
}

const learningStyleOptions: Array<{ emoji: string; label: string; value: LearningStyleType }> = [
  { emoji: '1F3A7', label: 'Listening', value: 'listening' },
  { emoji: '1F3AC', label: 'Watching', value: 'watching' },
  { emoji: '1F4D6', label: 'Reading', value: 'reading' },
  { emoji: '1F504', label: 'A mix', value: 'mixed' },
]

// Convert unicode code points to emoji
const toEmoji = (codePoint: string): string => {
  return String.fromCodePoint(parseInt(codePoint, 16))
}

const LearningStyleScreen: React.FC<LearningStyleScreenProps> = ({
  value,
  onSelect,
  onSkip,
}) => {
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="mb-6">
        <ProgressIndicator currentStep={3} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          How do you prefer to learn?
        </h2>
        <p className="text-gray-500 dark:text-darkMode-textSecondary">
          We will adapt content to match your learning style
        </p>
      </div>

      <div className="flex-grow space-y-3">
        {learningStyleOptions.map((option) => (
          <OptionCard
            key={option.value}
            emoji={toEmoji(option.emoji)}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onSelect={(v) => onSelect(v as LearningStyleType)}
            testId={`style-${option.value}`}
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

export default LearningStyleScreen
