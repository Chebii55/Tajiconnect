/**
 * LanguageScreen Component
 * Screen 5 of psychometric onboarding - Target language selection
 */

import OptionCard from './OptionCard'
import ProgressIndicator from './ProgressIndicator'

interface LanguageScreenProps {
  value: string | null
  onSelect: (value: string) => void
  onSkip?: () => void
}

const languageOptions: Array<{ emoji: string; label: string; value: string }> = [
  { emoji: '1F1F0_1F1EA', label: 'Swahili', value: 'swahili' },
  { emoji: '1F1F3_1F1EC', label: 'Yoruba', value: 'yoruba' },
  { emoji: '1F1EA_1F1F9', label: 'Amharic', value: 'amharic' },
  { emoji: '1F1F3_1F1EC', label: 'Hausa', value: 'hausa' },
  { emoji: '1F1F3_1F1EC', label: 'Igbo', value: 'igbo' },
  { emoji: '1F1FF_1F1E6', label: 'Zulu', value: 'zulu' },
]

// Convert unicode code points to emoji (supports flag emojis with underscore separator)
const toEmoji = (codePoint: string): string => {
  const parts = codePoint.split('_')
  return parts.map(part => String.fromCodePoint(parseInt(part, 16))).join('')
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({
  value,
  onSelect,
  onSkip,
}) => {
  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="mb-6">
        <ProgressIndicator currentStep={5} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
          Which language do you want to start with?
        </h2>
        <p className="text-gray-500 dark:text-darkMode-textSecondary">
          You can always add more languages later
        </p>
      </div>

      <div className="flex-grow space-y-3">
        {languageOptions.map((option) => (
          <OptionCard
            key={option.value}
            emoji={toEmoji(option.emoji)}
            label={option.label}
            value={option.value}
            isSelected={value === option.value}
            onSelect={onSelect}
            testId={`language-${option.value}`}
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

export default LanguageScreen
