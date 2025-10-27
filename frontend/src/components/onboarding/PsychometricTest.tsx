import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PsychometricQuestion {
  id: number
  question: string
  scale: string[]
  category: 'personality' | 'cognitive' | 'interests' | 'values'
}

const PsychometricTest = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const questions: PsychometricQuestion[] = [
    {
      id: 1,
      question: "I enjoy working in teams and collaborating with others",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 2,
      question: "I prefer to plan ahead rather than be spontaneous",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 3,
      question: "I can easily focus on tasks for long periods",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 4,
      question: "I enjoy solving complex problems",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 5,
      question: "I am interested in creative and artistic activities",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'interests'
    },
    {
      id: 6,
      question: "I am motivated by helping others succeed",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'values'
    },
    {
      id: 7,
      question: "I adapt quickly to new situations and changes",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 8,
      question: "I prefer learning through hands-on experience",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 9,
      question: "I am interested in how things work mechanically or technically",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'interests'
    },
    {
      id: 10,
      question: "I value financial security and stability",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'values'
    }
  ]

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: score }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleContinue = () => {
    navigate('/onboarding/roadmap-generation')
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const getResults = () => {
    const categories = {
      personality: 0,
      cognitive: 0,
      interests: 0,
      values: 0
    }

    const counts = {
      personality: 0,
      cognitive: 0,
      interests: 0,
      values: 0
    }

    questions.forEach((question) => {
      const score = answers[question.id]
      if (score !== undefined) {
        categories[question.category] += score
        counts[question.category]++
      }
    })

    // Calculate averages
    Object.keys(categories).forEach((key) => {
      const categoryKey = key as keyof typeof categories
      if (counts[categoryKey] > 0) {
        categories[categoryKey] = categories[categoryKey] / counts[categoryKey]
      }
    })

    return categories
  }

  const getPersonalityTraits = (results: ReturnType<typeof getResults>) => {
    const traits: string[] = []

    if (results.personality >= 4) traits.push("Highly collaborative")
    if (results.personality >= 3.5) traits.push("Well-organized")
    if (results.cognitive >= 4) traits.push("Strong problem solver")
    if (results.cognitive >= 3.5) traits.push("Detail-oriented")
    if (results.interests >= 4) traits.push("Creative thinker")
    if (results.interests >= 3.5) traits.push("Technically inclined")
    if (results.values >= 4) traits.push("Service-oriented")
    if (results.values >= 3.5) traits.push("Security-focused")

    return traits.length > 0 ? traits : ["Well-rounded individual"]
  }

  if (showResults) {
    const results = getResults()
    const traits = getPersonalityTraits(results)

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1C3D6E] mb-4">
              Psychometric Assessment Complete!
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Here's your comprehensive personality and learning profile
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Strengths */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#1C3D6E] mb-6 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                Your Profile Strengths
              </h3>
              <div className="flex flex-wrap gap-3">
                {traits.map((trait, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 text-primary border border-primary/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Category Scores */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#1C3D6E] mb-6 flex items-center">
                <span className="text-3xl mr-3">📊</span>
                Category Scores
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#1C3D6E]">Personality & Social</span>
                    <span className="font-bold text-[#333333]">{results.personality.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div
                      className="bg-primary-dark h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(results.personality / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#4A9E3D]">Cognitive & Learning</span>
                    <span className="font-bold text-[#333333]">{results.cognitive.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div
                      className="bg-primary-dark h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(results.cognitive / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#2C857A]">Interests & Creativity</span>
                    <span className="font-bold text-[#333333]">{results.interests.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div
                      className="bg-primary-dark h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(results.interests / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#3DAEDB]">Values & Motivation</span>
                    <span className="font-bold text-[#333333]">{results.values.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(results.values / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetTest}
              className="flex-1 py-3 px-6 border-2 border-[#1C3D6E] text-[#1C3D6E] hover:bg-[#1C3D6E] hover:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              Retake Test
            </button>
            <button
              onClick={handleContinue}
              className="btn-primary flex-1"
            >
              Generate My Roadmap
              <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">🧠</span>
          </div>
          <h2 className="text-4xl font-bold text-[#1C3D6E] mb-3">
            Psychometric Assessment
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us understand your personality and learning preferences to optimize your experience
          </p>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
              <div
                className="bg-primary-dark h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm font-medium text-[#2C857A] mt-3">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border-0 p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-[#1C3D6E] mb-8 text-center leading-relaxed">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].scale.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className="w-full text-center p-6 border-2 border-gray-200 rounded-xl hover:border-[#2C857A] hover:bg-[#2C857A]/5 focus:outline-none focus:ring-2 focus:ring-[#2C857A] focus:border-[#2C857A] transition-all duration-300 group"
              >
                <span className="text-base font-medium text-[#333333] group-hover:text-[#1C3D6E] transition-colors">
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PsychometricTest