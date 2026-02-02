/**
 * OptionCard Component
 * Reusable tap card with emoji and label for psychometric questions
 */

import { Check } from 'lucide-react'

interface OptionCardProps {
  emoji: string
  label: string
  value: string
  isSelected: boolean
  onSelect: (value: string) => void
  testId?: string
}

const OptionCard: React.FC<OptionCardProps> = ({
  emoji,
  label,
  value,
  isSelected,
  onSelect,
  testId,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      data-testid={testId}
      className={`
        relative w-full p-4 rounded-xl border-2 transition-all duration-200
        flex items-center gap-4 text-left
        min-h-[72px] touch-manipulation
        ${isSelected
          ? 'border-primary dark:border-darkMode-link bg-primary/5 dark:bg-darkMode-link/10'
          : 'border-gray-200 dark:border-darkMode-border bg-white dark:bg-darkMode-surface hover:border-gray-300 dark:hover:border-darkMode-borderHover'
        }
        focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkMode-focus
        active:scale-[0.98]
      `}
    >
      <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
        {emoji}
      </span>
      <span className={`
        text-base font-medium flex-grow
        ${isSelected
          ? 'text-primary dark:text-darkMode-link'
          : 'text-gray-800 dark:text-darkMode-text'
        }
      `}>
        {label}
      </span>
      {isSelected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary dark:bg-darkMode-link flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  )
}

export default OptionCard
