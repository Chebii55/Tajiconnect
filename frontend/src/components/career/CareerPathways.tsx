import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import CareerSidebar from '../CareerSidebar'

interface CareerPath {
  id: number
  title: string
  description: string
  averageSalary: string
  growthRate: string
  requirements: string[]
  skills: string[]
  industries: string[]
  education: string
  experience: string
  roadmap: {
    step: number
    title: string
    duration: string
    description: string
  }[]
  relatedJobs: string[]
  color: string
}

const CareerPathways = () => {
  const [searchParams] = useSearchParams()
  const selectedCareer = searchParams.get('career')
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)

  const careerPaths: CareerPath[] = [
    {
      id: 1,
      title: "Software Developer",
      description: "Design, develop, and maintain software applications and systems using various programming languages and frameworks.",
      averageSalary: "KSh 100,000 - 200,000",
      growthRate: "+22%",
      requirements: ["Bachelor's in Computer Science or related field", "Programming skills", "Problem-solving abilities"],
      skills: ["JavaScript", "Python", "React", "Node.js", "Git", "SQL"],
      industries: ["Technology", "Accounts and Finance", "Healthcare", "Innovation"],
      education: "Bachelor's Degree",
      experience: "0-2 years entry level",
      roadmap: [
        {
          step: 1,
          title: "Learn Programming Fundamentals",
          duration: "3-6 months",
          description: "Master basic programming concepts, data structures, and algorithms"
        },
        {
          step: 2,
          title: "Build Portfolio Projects",
          duration: "2-4 months",
          description: "Create 3-5 projects showcasing your skills and problem-solving abilities"
        }
      ],
      relatedJobs: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      color: "bg-blue-600"
    }
  ]

  const handleSelectPath = (path: CareerPath) => {
    setSelectedPath(path)
  }

  const handleBackToOverview = () => {
    setSelectedPath(null)
  }

  const filteredPaths = selectedCareer
    ? careerPaths.filter(path =>
        path.title.toLowerCase().includes(selectedCareer.toLowerCase()) ||
        path.skills.some(skill => skill.toLowerCase().includes(selectedCareer.toLowerCase()))
      )
    : careerPaths

  if (selectedPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <CareerSidebar />
          <div className="flex-1 ml-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <button
                  onClick={handleBackToOverview}
                  className="flex items-center text-[#1C3D6E] dark:text-[#3DAEDB] hover:text-[#0f2844] mb-4 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Career Pathways
                </button>
                
                <div className="flex items-center mb-4">
                  <div className={`w-16 h-16 ${selectedPath.color} rounded-full flex items-center justify-center mr-6 shadow-lg`}>
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">{selectedPath.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedPath.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <CareerSidebar />
        <div className="flex-1 ml-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">
                Career Pathways
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                Explore detailed career paths and roadmaps to achieve your professional goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPaths.map((path) => (
                <div key={path.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                     onClick={() => handleSelectPath(path)}>
                  <div className={`w-12 h-12 ${path.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">{path.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{path.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#4A9E3D] font-semibold">{path.averageSalary}</span>
                    <span className="text-[#2C857A] font-semibold">{path.growthRate}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredPaths.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No career paths found matching "{selectedCareer}"</p>
                <Link
                  to="/student/career/pathways"
                  className="inline-block mt-4 text-[#1C3D6E] dark:text-[#3DAEDB] hover:text-[#0f2844] font-semibold"
                >
                  View all career paths
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerPathways