/**
 * LevelScreen Component
 * Screen 2 of psychometric onboarding - Current level
 */

import type { Level } from '../../../utils/learnerArchetype'
import OptionCard from './OptionCard'
import ProgressIndicator from './ProgressIndicator'

interface LevelScreenProps {
  value: Level | null
  onSelect: (value: Level) => void
  onSkip?: () => void
}

const levelOptions: Array<{ emoji: string; label: string; value: Level }> = [
  { emoji: '1F331', label: 'New learner', value: 'new' },
  { emoji: '1F33F', label: 'Know a few words', value: 'few_words' },
  { emoji: '1F333', label: 'Can form sentences', value: 'sentences' },
]

// Convert unicode code points to emoji
const toEmoji = (codePoint: string): string => {
  return String.fromCodePoint(parseInt(codePoint, 16))
}

const LevelScreen: React.FC<LevelScreenProps> = ({
  value,
  onSelect,
  onSkip,
}) => {
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="mb-6">
        <ProgressIndicator currentStep={2} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          How would you describe your current level?
        </h2>
        <p className="text-gray-500 dark:text-darkMode-textSecondary">
          This helps us tailor content to your proficiency
        </p>
      </div>

      <div className="flex-grow space-y-3">
        {levelOptions.map((option) => (
          <OptionCard
            key={option.value}
            emoji={toEmoji(option.emoji)}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onSelect={(v) => onSelect(v as Level)}
            testId={`level-${option.value}`}
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

export default LevelScreen
