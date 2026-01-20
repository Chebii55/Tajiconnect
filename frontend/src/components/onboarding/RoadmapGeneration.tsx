import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Map, CheckCircle, ArrowRight, Info } from 'lucide-react'

interface RoadmapItem {
  id: number
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
}

const RoadmapGeneration = () => {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [, setRoadmapGenerated] = useState(false)

  const sampleRoadmap: RoadmapItem[] = [
    {
      id: 1,
      title: "Programming Fundamentals",
      description: "Learn basic programming concepts, variables, and data types",
      duration: "2 weeks",
      difficulty: "Beginner",
      category: "Foundation"
    },
    {
      id: 2,
      title: "Web Development Basics",
      description: "Introduction to HTML, CSS, and basic web structure",
      duration: "3 weeks",
      difficulty: "Beginner",
      category: "Web Development"
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      description: "Master JavaScript programming and DOM manipulation",
      duration: "4 weeks",
      difficulty: "Intermediate",
      category: "Programming"
    },
    {
      id: 4,
      title: "React Framework",
      description: "Build dynamic user interfaces with React",
      duration: "4 weeks",
      difficulty: "Intermediate",
      category: "Frontend"
    },
    {
      id: 5,
      title: "Project Portfolio",
      description: "Create a professional portfolio showcasing your skills",
      duration: "2 weeks",
      difficulty: "Advanced",
      category: "Project"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsGenerating(false)
          setRoadmapGenerated(true)
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleContinue = () => {
    // Mark onboarding as complete
    const storedData = sessionStorage.getItem('onboardingData')
    const existingData = storedData ? JSON.parse(storedData) : {}
    const updatedData = {
      ...existingData,
      onboardingComplete: true,
      roadmapGenerated: true
    }
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))

    // Navigate to welcome page which will then redirect to dashboard
    navigate('/onboarding/welcome')
  }

  const handleCustomize = () => {
    // In a real app, this would open a customization modal
    alert('Customization feature coming soon!')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-secondary/20 dark:bg-darkMode-success/20 text-secondary dark:text-darkMode-success border border-secondary/30 dark:border-darkMode-success/30'
      case 'Intermediate':
        return 'bg-primary-light/20 dark:bg-darkMode-accent/20 text-primary-light dark:text-darkMode-accent border border-primary-light/30 dark:border-darkMode-accent/30'
      case 'Advanced':
        return 'bg-primary-dark/20 dark:bg-darkMode-progress/20 text-primary-dark dark:text-darkMode-progress border border-primary-dark/30 dark:border-darkMode-progress/30'
      default:
        return 'bg-neutral-gray dark:bg-darkMode-border text-neutral-dark dark:text-darkMode-textMuted'
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
              Generating Your Roadmap
            </h2>
            <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-lg max-w-2xl mx-auto">
              We're analyzing your assessment results to create a personalized learning path
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-gray dark:border-darkMode-border border-t-forest-sage dark:border-t-darkMode-success shadow-lg"></div>
            </div>

            <div>
              <div className="w-full bg-neutral-gray dark:bg-darkMode-border rounded-full h-3 shadow-inner">
                <div
                  className="bg-primary-dark dark:bg-darkMode-progress h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-forest-sage dark:text-darkMode-accent mt-3">
                {progress}% Complete
              </p>
            </div>

            <div className="text-center space-y-3">
              {progress >= 20 && (
                <p className="text-sm text-neutral-dark dark:text-darkMode-textSecondary font-medium animate-fade-in flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-secondary dark:text-darkMode-success mr-2" /> Analyzing your interests...
                </p>
              )}
              {progress >= 40 && (
                <p className="text-sm text-neutral-dark dark:text-darkMode-textSecondary font-medium animate-fade-in flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-secondary dark:text-darkMode-success mr-2" /> Matching learning styles...
                </p>
              )}
              {progress >= 60 && (
                <p className="text-sm text-neutral-dark dark:text-darkMode-textSecondary font-medium animate-fade-in flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-secondary dark:text-darkMode-success mr-2" /> Selecting optimal courses...
                </p>
              )}
              {progress >= 80 && (
                <p className="text-sm text-neutral-dark dark:text-darkMode-textSecondary font-medium animate-fade-in flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-secondary dark:text-darkMode-success mr-2" /> Creating timeline...
                </p>
              )}
              {progress >= 100 && (
                <p className="text-sm text-secondary dark:text-darkMode-success font-semibold animate-fade-in flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Roadmap generated successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl dark:shadow-dark-lg">
            <Map className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Your Personalized Learning Roadmap
          </h2>
          <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-xl max-w-3xl mx-auto">
            Based on your assessment results, here's your customized learning journey
          </p>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text flex items-center">
              <Map className="w-8 h-8 mr-3 text-primary-dark dark:text-darkMode-accent" />
              Learning Path Overview
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={handleCustomize}
                className="py-3 px-6 border-2 border-primary-dark dark:border-darkMode-border text-primary-dark dark:text-darkMode-text hover:bg-primary-dark dark:hover:bg-darkMode-surfaceHover hover:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Customize
              </button>
            </div>
          </div>

          {/* Animated Duolingo-style Path */}
          <div className="relative max-w-2xl mx-auto">
            {/* SVG Path Background */}
            <div className="absolute inset-0 flex justify-center">
              <svg width="4" height="100%" className="overflow-visible">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3A7D44" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#729B79" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1E4F2A" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#01200F" stopOpacity="1">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#3A7D44" stopOpacity="0.8">
                      <animate attributeName="stop-opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite" begin="1s" />
                    </stop>
                    <stop offset="100%" stopColor="#1E4F2A" stopOpacity="1">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="2s" />
                    </stop>
                  </linearGradient>
                </defs>
                <line x1="2" y1="0" x2="2" y2="100%" stroke="url(#pathGradient)" strokeWidth="4" strokeLinecap="round" />
                <line x1="2" y1="0" x2="2" y2="100%" stroke="url(#animatedGradient)" strokeWidth="2" strokeLinecap="round" />
                {/* Animated dots traveling along the path */}
                <circle r="3" fill="#01200F" opacity="0.8">
                  <animate attributeName="cy" values="0%;100%;0%" dur="6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#3A7D44" opacity="0.6">
                  <animate attributeName="cy" values="100%;0%;100%" dur="8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.8;0" dur="8s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* Roadmap Items with Staggered Animation */}
            <div className="space-y-12 relative z-10">
              {sampleRoadmap.map((item, index) => {
                const isEven = index % 2 === 0;
                const animationDelay = index * 200;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
                    style={{ animationDelay: `${animationDelay}ms` }}
                  >
                    <div className={`flex items-center space-x-4 ${!isEven ? 'flex-row-reverse space-x-reverse' : ''} animate-fade-in`}>
                      {/* Animated Node */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center shadow-2xl dark:shadow-dark-lg transform hover:scale-110 transition-all duration-500 animate-pulse-subtle">
                          <span className="text-white text-lg font-bold">{index + 1}</span>
                          {/* Glowing ring animation */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light to-forest-sage dark:from-darkMode-success dark:to-darkMode-accent opacity-30 animate-ping"></div>
                        </div>
                        {/* Connection indicator */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-primary dark:bg-darkMode-progress ${isEven ? 'left-full' : 'right-full'}`}></div>
                      </div>

                      {/* Content Card */}
                      <div className={`max-w-sm ${isEven ? 'ml-4' : 'mr-4'}`}>
                        <div className="bg-white dark:bg-darkMode-surfaceHover rounded-2xl p-6 shadow-xl dark:shadow-dark border border-neutral-gray/50 dark:border-darkMode-border hover:shadow-2xl hover:border-primary-light dark:hover:border-darkMode-progress transition-all duration-300 transform hover:-translate-y-1 group">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold text-primary-dark dark:text-darkMode-text group-hover:text-primary dark:group-hover:text-darkMode-accent transition-colors">
                              {item.title}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                          </div>
                          <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-sm mb-3 leading-relaxed">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-dark/20 dark:bg-darkMode-progress/20 text-primary-dark dark:text-darkMode-progress border border-primary-dark/30 dark:border-darkMode-progress/30">
                              {item.category}
                            </span>
                            <span className="text-xs font-medium text-secondary dark:text-darkMode-success">
                              {item.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 bg-primary/10 dark:bg-darkMode-progress/10 rounded-2xl p-6 border border-primary/30 dark:border-darkMode-progress/30">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary dark:bg-darkMode-progress rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-2">
                  Estimated completion time: 15 weeks
                </h4>
                <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary leading-relaxed">
                  This roadmap is tailored to your learning style and goals. You can adjust the pace as needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="py-4 px-8 text-lg bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white rounded-xl hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Start My Learning Journey
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoadmapGeneration
