import { useState } from 'react'

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'rating' | 'text'
  options?: string[]
  category: string
}

interface AssessmentDetailProps {
  assessmentId: string
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'I prefer working with concrete facts rather than abstract theories.',
    type: 'rating',
    category: 'Work Style'
  },
  {
    id: 'q2',
    text: 'Which work environment appeals to you most?',
    type: 'multiple_choice',
    options: [
      'Fast-paced startup environment',
      'Structured corporate setting',
      'Remote/flexible workspace',
      'Collaborative team environment'
    ],
    category: 'Environment'
  },
  {
    id: 'q3',
    text: 'When faced with a complex problem, I typically:',
    type: 'multiple_choice',
    options: [
      'Break it down into smaller parts',
      'Look for similar past solutions',
      'Brainstorm creative approaches',
      'Seek input from others'
    ],
    category: 'Problem Solving'
  }
]

export default function AssessmentDetail({ assessmentId }: AssessmentDetailProps) {
  console.log('Assessment ID:', assessmentId);
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [showFeedback, setShowFeedback] = useState(false)

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowFeedback(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-dark mb-4">Assessment Complete!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for completing the assessment. Your results are being processed.
            </p>

            {/* Success Notification */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">🎉</span>
                <p className="text-green-800 text-sm">
                  Your assessment has been successfully submitted and will be available in your results within 24 hours.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="btn-primary w-full">
                View Preliminary Results
              </button>
              <button className="w-full border border-[#1C3D6E] text-primary-dark py-3 px-6 rounded-lg font-medium hover:bg-[#1C3D6E] hover:text-white transition-colors">
                Return to Assessment Center
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = mockQuestions[currentQuestion]
  const hasAnswer = answers[question.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{currentQuestion + 1}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-dark">Career Aptitude Assessment</h1>
                <p className="text-gray-600">Question {currentQuestion + 1} of {mockQuestions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="text-lg font-bold text-secondary">{Math.round(progress)}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-dark h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="inline-block bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-sm font-medium mb-4">
              {question.category}
            </div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">{question.text}</h2>
          </div>

          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    answers[question.id] === option
                      ? 'border-[#4A9E3D] bg-[#4A9E3D]/5'
                      : 'border-gray-200 hover:border-[#3DAEDB] hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[question.id] === option
                        ? 'border-[#4A9E3D] bg-[#4A9E3D]'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'rating' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleAnswer(question.id, rating)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      answers[question.id] === rating
                        ? 'border-[#4A9E3D] bg-[#4A9E3D] text-white'
                        : 'border-gray-300 hover:border-[#3DAEDB] text-gray-600'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === mockQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          </button>
        </div>

        {/* Help Notification */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">💡</span>
            <div>
              <p className="text-blue-800 text-sm font-medium">Assessment Tip</p>
              <p className="text-blue-700 text-sm">
                Answer honestly for the most accurate results. There are no right or wrong answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}