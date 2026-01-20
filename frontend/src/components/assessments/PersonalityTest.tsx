import { useState } from 'react'

interface PersonalityQuestion {
  id: string
  text: string
  type: 'likert' | 'choice' | 'ranking' | 'scenario'
  options?: string[]
  scale?: { min: number; max: number; labels: string[] }
  category: string
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism' | 'mixed'
}

interface PersonalityResult {
  testType: string
  traits: Record<string, { score: number; percentile: number; description: string }>
  personalityType: string
  strengths: string[]
  challenges: string[]
  careerSuggestions: string[]
  workStyle: string
  communicationStyle: string
  learningPreferences: string[]
}

interface TestType {
  id: string
  name: string
  description: string
  duration: string
  questions: number
  framework: string
  focus: string[]
  popular: boolean
}

const testTypes: TestType[] = [
  {
    id: 'big5',
    name: 'Big Five Personality Test',
    description: 'The most scientifically validated personality assessment measuring five key dimensions of personality.',
    duration: '15-20 minutes',
    questions: 60,
    framework: 'Five-Factor Model',
    focus: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
    popular: true
  },
  {
    id: 'disc',
    name: 'DISC Assessment',
    description: 'Understand your behavioral style and how you interact with others in work and social settings.',
    duration: '10-15 minutes',
    questions: 40,
    framework: 'DISC Model',
    focus: ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness'],
    popular: true
  },
  {
    id: 'mbti',
    name: 'Personality Type Indicator',
    description: 'Discover your psychological preferences and how you perceive the world and make decisions.',
    duration: '20-25 minutes',
    questions: 75,
    framework: 'Jungian Types',
    focus: ['Introversion/Extraversion', 'Sensing/Intuition', 'Thinking/Feeling', 'Judging/Perceiving'],
    popular: true
  },
  {
    id: 'enneagram',
    name: 'Enneagram Assessment',
    description: 'Explore your core motivations, fears, and the driving forces behind your behavior.',
    duration: '25-30 minutes',
    questions: 90,
    framework: 'Nine Types',
    focus: ['Core Motivations', 'Basic Fears', 'Wings', 'Instinctual Variants'],
    popular: false
  }
]

const mockQuestions: PersonalityQuestion[] = [
  {
    id: 'q1',
    text: 'I am the life of the party.',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    category: 'Social Behavior',
    trait: 'extraversion'
  },
  {
    id: 'q2',
    text: 'I feel comfortable around people.',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    category: 'Social Behavior',
    trait: 'extraversion'
  },
  {
    id: 'q3',
    text: 'When working on a project, you prefer to:',
    type: 'choice',
    options: [
      'Start immediately with a rough plan and refine as you go',
      'Create a detailed plan before starting any work',
      'Brainstorm multiple approaches before deciding',
      'Follow established procedures and best practices'
    ],
    category: 'Work Style',
    trait: 'conscientiousness'
  },
  {
    id: 'q4',
    text: 'You\'re at a networking event. What\'s your typical approach?',
    type: 'scenario',
    options: [
      'Introduce yourself to as many people as possible',
      'Find a few interesting people and have deep conversations',
      'Look for people you already know to talk with',
      'Focus on the presentations and take notes'
    ],
    category: 'Social Situations',
    trait: 'extraversion'
  }
]

const mockResult: PersonalityResult = {
  testType: 'Big Five Personality Test',
  traits: {
    openness: {
      score: 85,
      percentile: 78,
      description: 'You are highly open to new experiences, creative, and intellectually curious. You enjoy exploring new ideas and approaches.'
    },
    conscientiousness: {
      score: 70,
      percentile: 65,
      description: 'You are generally organized and goal-oriented, but maintain flexibility when needed. You balance structure with adaptability.'
    },
    extraversion: {
      score: 75,
      percentile: 72,
      description: 'You are energetic and outgoing, enjoying social interactions while also valuing some alone time for reflection.'
    },
    agreeableness: {
      score: 80,
      percentile: 75,
      description: 'You are cooperative and empathetic, valuing harmony in relationships while standing firm on important principles.'
    },
    neuroticism: {
      score: 35,
      percentile: 30,
      description: 'You are emotionally stable and resilient, handling stress well while remaining sensitive to important emotional cues.'
    }
  },
  personalityType: 'The Innovator (ENFP)',
  strengths: [
    'Creative problem-solving',
    'Strong interpersonal skills',
    'Adaptability and flexibility',
    'Enthusiasm and motivation',
    'Open-mindedness'
  ],
  challenges: [
    'May struggle with routine tasks',
    'Can be overly optimistic about timelines',
    'Difficulty with excessive structure',
    'May avoid conflict when necessary'
  ],
  careerSuggestions: [
    'UX/UI Designer',
    'Marketing Manager',
    'Counselor or Coach',
    'Product Manager',
    'Entrepreneur',
    'Teacher or Trainer'
  ],
  workStyle: 'Collaborative and innovative, preferring flexible environments with opportunities for creativity and human interaction.',
  communicationStyle: 'Enthusiastic and empathetic, skilled at reading others and adapting communication style to the situation.',
  learningPreferences: [
    'Visual and interactive learning',
    'Group discussions and collaboration',
    'Real-world applications',
    'Varied and engaging content'
  ]
}

export default function PersonalityTest() {
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({})
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<'tests' | 'taking' | 'results'>('tests')

  const handleTestStart = (test: TestType) => {
    setSelectedTest(test)
    setCurrentQuestion(0)
    setAnswers({})
    setActiveTab('taking')
  }

  const handleAnswer = (questionId: string, answer: string | number | boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setActiveTab('results')
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const progress = selectedTest ? ((currentQuestion + 1) / selectedTest.questions) * 100 : 0
  const currentQuestionData = mockQuestions[currentQuestion]
  const hasAnswer = currentQuestionData && answers[currentQuestionData.id] !== undefined

  const getTraitColor = (trait: string) => {
    const colors = {
      openness: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      conscientiousness: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      extraversion: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      agreeableness: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      neuroticism: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    }
    return colors[trait as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Personality Assessment</h1>
              <p className="text-gray-600 dark:text-gray-300">Understand your personality traits and behavioral preferences</p>
            </div>
          </div>

          {/* Personality Insight Notification */}
          {showResults && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">🎉</span>
                <div>
                  <p className="text-purple-800 dark:text-purple-300 font-medium">Personality Profile Complete!</p>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    Your results show you're "The Innovator" - perfect for creative and collaborative roles!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Selection */}
        {activeTab === 'tests' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Choose Your Personality Assessment</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Each assessment offers unique insights into different aspects of your personality.
                We recommend starting with the Big Five for the most comprehensive scientific analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testTypes.map((test) => (
                <div key={test.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-0 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-dark rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">🧠</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg">{test.name}</h3>
                        {test.popular && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{test.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{test.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{test.questions}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Framework:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{test.framework}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Measures:</p>
                    <div className="flex flex-wrap gap-1">
                      {test.focus.map((focus, index) => (
                        <span key={index} className="text-xs bg-primary/10 dark:bg-blue-900/30 text-primary-dark dark:text-darkMode-link px-2 py-1 rounded-full">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestStart(test)}
                    className="btn-primary w-full"
                  >
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>

            {/* Assessment Info */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">About Personality Assessments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔬</div>
                  <h4 className="font-semibold text-primary-dark dark:text-darkMode-link mb-2">Science-Based</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our assessments are based on peer-reviewed psychological research and validated models.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold text-primary-dark dark:text-darkMode-link mb-2">Career Focused</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Results include career suggestions and workplace insights tailored to your personality.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <h4 className="font-semibold text-primary-dark dark:text-darkMode-link mb-2">Private & Secure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your personality data is encrypted and only shared with your explicit permission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Taking Test */}
        {activeTab === 'taking' && selectedTest && currentQuestionData && (
          <div className="max-w-4xl mx-auto">
            {/* Test Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{currentQuestion + 1}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">{selectedTest.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">Question {currentQuestion + 1} of {selectedTest.questions}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('tests')}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-dark h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {currentQuestionData.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTraitColor(currentQuestionData.trait)}`}>
                    {currentQuestionData.trait}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">{currentQuestionData.text}</h2>
              </div>

              {currentQuestionData.type === 'likert' && currentQuestionData.scale && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{currentQuestionData.scale.labels[0]}</span>
                    <span>{currentQuestionData.scale.labels[currentQuestionData.scale.labels.length - 1]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleAnswer(currentQuestionData.id, rating)}
                        className={`w-12 h-12 rounded-full border-2 transition-colors ${
                          answers[currentQuestionData.id] === rating
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    {currentQuestionData.scale.labels.map((label, index) => (
                      <span key={index} className="text-center max-w-[80px]">{label}</span>
                    ))}
                  </div>
                </div>
              )}

              {(currentQuestionData.type === 'choice' || currentQuestionData.type === 'scenario') && currentQuestionData.options && (
                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestionData.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        answers[currentQuestionData.id] === option
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          answers[currentQuestionData.id] === option
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestionData.id] === option && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                          )}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === selectedTest.questions - 1 ? 'Complete Assessment' : 'Next'}
              </button>
            </div>

            {/* Test Tips */}
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">💡</span>
                <div>
                  <p className="text-purple-800 dark:text-purple-300 text-sm font-medium">Assessment Tip</p>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    Answer honestly based on how you typically behave, not how you think you should behave. There are no right or wrong answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎭</span>
                </div>
                <h2 className="text-3xl font-bold text-primary-dark mb-2">{mockResult.personalityType}</h2>
                <p className="text-gray-600">{mockResult.testType} Results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-primary-dark mb-3">Work Style</h3>
                  <p className="text-gray-700 text-sm mb-4">{mockResult.workStyle}</p>

                  <h3 className="font-bold text-primary-dark mb-3">Communication Style</h3>
                  <p className="text-gray-700 text-sm">{mockResult.communicationStyle}</p>
                </div>

                <div>
                  <h3 className="font-bold text-primary-dark mb-3">Learning Preferences</h3>
                  <ul className="space-y-1">
                    {mockResult.learningPreferences.map((pref, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-purple-500">•</span>
                        {pref}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Trait Scores */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Personality Trait Scores</h2>
              <div className="space-y-6">
                {Object.entries(mockResult.traits).map(([trait, data]) => (
                  <div key={trait} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-primary-dark capitalize">{trait}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-600">{data.score}/100</span>
                        <div className="text-xs text-gray-500">{data.percentile}th percentile</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div
                        className="bg-primary-dark h-3 rounded-full"
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-700">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark mb-4">Your Strengths</h2>
                <div className="space-y-3">
                  {mockResult.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600">✓</span>
                      <span className="text-green-800 font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark mb-4">Growth Areas</h2>
                <div className="space-y-3">
                  {mockResult.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-600">△</span>
                      <span className="text-orange-800 font-medium">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Recommended Career Paths</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mockResult.careerSuggestions.map((career, index) => (
                  <div key={index} className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">💼</div>
                    <h3 className="font-semibold text-primary-dark text-sm">{career}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="btn-primary flex-1">
                Download Results
              </button>
              <button className="flex-1 border border-[#1C3D6E] text-primary-dark py-3 px-6 rounded-lg font-medium hover:bg-[#1C3D6E] hover:text-white transition-colors">
                Share Results
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Take Another Test
              </button>
            </div>

            {/* Personality Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <div>
                  <p className="text-blue-800 font-medium">Understanding Your Results</p>
                  <p className="text-blue-700 text-sm">
                    Remember that personality is just one factor in career success. Use these insights as a guide while considering your interests, values, and life circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}