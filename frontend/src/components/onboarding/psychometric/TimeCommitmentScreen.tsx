/**
 * TimeCommitmentScreen Component
 * Screen 4 of psychometric onboarding - Time availability
 */

import type { TimeCommitmentType } from '../../../utils/learnerArchetype'
import OptionCard from './OptionCard'
import ProgressIndicator from './ProgressIndicator'

interface TimeCommitmentScreenProps {
  value: TimeCommitmentType | null
  onSelect: (value: TimeCommitmentType) => void
  onSkip?: () => void
}

const timeCommitmentOptions: Array<{ emoji: string; label: string; value: TimeCommitmentType }> = [
  { emoji: '23F1', label: '5-10 min/day', value: 'short' },
  { emoji: '23F0', label: '15-30 min/day', value: 'medium' },
  { emoji: '1F4C6', label: 'Few times a week', value: 'flexible' },
]

// Convert unicode code points to emoji
const toEmoji = (codePoint: string): string => {
  return String.fromCodePoint(parseInt(codePoint, 16))
}

const TimeCommitmentScreen: React.FC<TimeCommitmentScreenProps> = ({
  value,
  onSelect,
  onSkip,
}) => {
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="mb-6">
        <ProgressIndicator currentStep={4} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          How much time can you spend learning?
        </h2>
        <p className="text-gray-500 dark:text-darkMode-textSecondary">
          This helps us set achievable daily goals
        </p>
      </div>

      <div className="flex-grow space-y-3">
        {timeCommitmentOptions.map((option) => (
          <OptionCard
            key={option.value}
            emoji={toEmoji(option.emoji)}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onSelect={(v) => onSelect(v as TimeCommitmentType)}
            testId={`time-${option.value}`}
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

export default TimeCommitmentScreen
