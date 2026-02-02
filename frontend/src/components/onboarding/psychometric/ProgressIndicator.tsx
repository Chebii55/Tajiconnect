/**
 * ProgressIndicator Component
 * 5-dot progress indicator for psychometric onboarding screens
 */

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps?: number
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
}) => {
  return (
    <div className="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        return (
          <div
            key={stepNumber}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${isCompleted
                ? 'bg-primary dark:bg-darkMode-link'
                : isCurrent
                  ? 'bg-primary dark:bg-darkMode-link scale-125'
                  : 'bg-gray-300 dark:bg-darkMode-border'
              }
            `}
            aria-label={`Step ${stepNumber} ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}
          />
        )
      })}
    </div>
  )
}

export default ProgressIndicator
