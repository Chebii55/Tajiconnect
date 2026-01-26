import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Lightbulb, Target, Search } from 'lucide-react'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  salary: string
  description: string
  requirements: string[]
  skills: string[]
  matchPercentage: number
  postedDate: string
  applicationDeadline: string
  remote: boolean
  urgent: boolean
  companyLogo: React.ReactNode
  category: string
}

interface FilterOptions {
  location: string
  jobType: string
  salaryRange: string
  remote: boolean
  skills: string[]
}

const PersonalizedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    jobType: '',
    salaryRange: '',
    remote: false,
    skills: []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'date'>('match')
  const [showFilters, setShowFilters] = useState(false)

  // Sample personalized job recommendations
  const mockJobs: Job[] = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Kenya",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 120,000 - 180,000",
      description: "We're looking for a passionate Frontend Developer to join our growing team. You'll work on exciting projects using React, TypeScript, and modern development tools.",
      requirements: ["Bachelor's degree in Computer Science or related field", "2+ years React experience", "Strong JavaScript fundamentals"],
      skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Git"],
      matchPercentage: 92,
      postedDate: "2024-01-15",
      applicationDeadline: "2024-02-15",
      remote: true,
      urgent: false,
      companyLogo: "🏢",
      category: "Technology"
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "InnovateLab",
      location: "Mombasa, Kenya",
      type: "Full-time",
      salary: "KSh 150,000 - 220,000",
      description: "Join our dynamic team as a Full Stack Developer. Work with cutting-edge technologies including Node.js, React, and cloud platforms.",
      requirements: ["3+ years full-stack development", "Experience with Node.js and React", "Database design knowledge"],
      skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      matchPercentage: 89,
      postedDate: "2024-01-12",
      applicationDeadline: "2024-02-12",
      remote: false,
      urgent: true,
      companyLogo: <Rocket className="w-8 h-8 text-primary" />,
      category: "Technology"
    },
    {
      id: 3,
      title: "Junior Software Developer",
      company: "StartupTech",
      location: "Kisumu, Kenya",
      type: "Full-time",
      salary: "KSh 80,000 - 120,000",
      description: "Perfect opportunity for a junior developer to grow their career. We offer mentorship, training, and exciting projects.",
      requirements: ["Computer Science degree or bootcamp graduate", "Basic programming knowledge", "Eagerness to learn"],
      skills: ["JavaScript", "Python", "Git", "HTML/CSS"],
      matchPercentage: 87,
      postedDate: "2024-01-10",
      applicationDeadline: "2024-02-20",
      remote: true,
      urgent: false,
      companyLogo: <Lightbulb className="w-8 h-8 text-accent-gold" />,
      category: "Technology"
    },
    {
      id: 4,
      title: "React Developer",
      company: "WebSolutions",
      location: "Nairobi, Kenya",
      type: "Contract",
      salary: "KSh 100,000 - 150,000",
      description: "6-month contract position working on a large-scale e-commerce platform. Opportunity for extension based on performance.",
      requirements: ["Strong React experience", "Redux knowledge", "API integration experience"],
      skills: ["React", "Redux", "JavaScript", "REST APIs", "Webpack"],
      matchPercentage: 85,
      postedDate: "2024-01-08",
      applicationDeadline: "2024-02-08",
      remote: true,
      urgent: true,
      companyLogo: "🛒",
      category: "Technology"
    },
    {
      id: 5,
      title: "Software Engineer Intern",
      company: "TechGiants",
      location: "Nairobi, Kenya",
      type: "Internship",
      salary: "KSh 40,000 - 60,000",
      description: "3-month internship program with possibility of full-time offer. Work alongside senior developers on real projects.",
      requirements: ["Currently pursuing CS degree", "Basic programming skills", "Strong problem-solving abilities"],
      skills: ["Programming fundamentals", "Git", "Problem solving"],
      matchPercentage: 82,
      postedDate: "2024-01-05",
      applicationDeadline: "2024-02-25",
      remote: false,
      urgent: false,
      companyLogo: "🎓",
      category: "Technology"
    },
    {
      id: 6,
      title: "Frontend Developer (Remote)",
      company: "RemoteFirst",
      location: "Remote, Kenya",
      type: "Full-time",
      salary: "KSh 130,000 - 190,000",
      description: "100% remote position working with international clients. Flexible hours and modern tech stack.",
      requirements: ["3+ years frontend experience", "Strong communication skills", "Self-motivated"],
      skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS"],
      matchPercentage: 90,
      postedDate: "2024-01-14",
      applicationDeadline: "2024-02-14",
      remote: true,
      urgent: false,
      companyLogo: "🌍",
      category: "Technology"
    }
  ]

  useEffect(() => {
    // Simulate loading personalized jobs
    setTimeout(() => {
      const sortedJobs = mockJobs.sort((a, b) => b.matchPercentage - a.matchPercentage)
      setJobs(sortedJobs)
      setFilteredJobs(sortedJobs)
    }, 500)
  }, [mockJobs])

  useEffect(() => {
    applyFilters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery, sortBy, jobs])

  const applyFilters = () => {
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesType = !filters.jobType || job.type === filters.jobType
      const matchesRemote = !filters.remote || job.remote
      const matchesSkills = filters.skills.length === 0 ||
                           filters.skills.some(skill => job.skills.includes(skill))

      return matchesSearch && matchesLocation && matchesType && matchesRemote && matchesSkills
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchPercentage - a.matchPercentage
        case 'salary': {
          const aSalary = parseInt(a.salary.split(' - ')[1].replace(/[^\d]/g, ''))
          const bSalary = parseInt(b.salary.split(' - ')[1].replace(/[^\d]/g, ''))
          return bSalary - aSalary
        }
        case 'date':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-secondary bg-secondary/20 dark:text-darkMode-success dark:bg-darkMode-success/20'
    if (percentage >= 80) return 'text-forest-sage bg-forest-sage/20 dark:text-darkMode-accent dark:bg-darkMode-accent/20'
    if (percentage >= 70) return 'text-primary bg-primary/20 dark:text-info dark:bg-info/20'
    return 'text-orange-600 bg-orange-100 dark:text-warning dark:bg-warning/20'
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'text-primary-dark bg-primary-dark/20 dark:text-darkMode-text dark:bg-primary-dark/30'
      case 'Part-time': return 'text-forest-sage bg-forest-sage/20 dark:text-darkMode-accent dark:bg-forest-sage/30'
      case 'Contract': return 'text-primary bg-primary/20 dark:text-info dark:bg-info/30'
      case 'Internship': return 'text-secondary bg-secondary/20 dark:text-darkMode-success dark:bg-darkMode-success/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-darkMode-textSecondary dark:bg-darkMode-surface'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-dark dark:bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Personalized Job Recommendations
          </h1>
          <p className="text-gray-600 dark:text-darkMode-textSecondary text-xl max-w-3xl mx-auto">
            Jobs matched to your skills, preferences, and career goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-darkMode-textSecondary w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkMode-bg dark:text-darkMode-text dark:placeholder-darkMode-textSecondary transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'match' | 'salary' | 'date')}
              className="px-4 py-3 border border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-darkMode-bg dark:text-darkMode-text"
            >
              <option value="match">Sort by Match</option>
              <option value="salary">Sort by Salary</option>
              <option value="date">Sort by Date</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-primary-dark dark:border-primary text-primary-dark dark:text-primary hover:bg-primary-dark hover:text-white dark:hover:bg-primary dark:hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-darkMode-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-darkMode-text mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, County"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-darkMode-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text dark:placeholder-darkMode-textSecondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-darkMode-text mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-darkMode-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-darkMode-bg dark:text-darkMode-text"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-darkMode-text mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-darkMode-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-darkMode-bg dark:text-darkMode-text"
                  >
                    <option value="">Any Salary</option>
                    <option value="0-50000">Under KSh 50K</option>
                    <option value="50000-100000">KSh 50K - 100K</option>
                    <option value="100000-150000">KSh 100K - 150K</option>
                    <option value="150000+">KSh 150K+</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-darkMode-border rounded mr-2"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-darkMode-text">Remote Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-darkMode-textSecondary">
            Showing <span className="font-semibold text-primary-dark dark:text-darkMode-text">{filteredJobs.length}</span> personalized job matches
          </p>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-lg border border-gray-100 dark:border-darkMode-border hover:shadow-2xl hover:border-primary dark:hover:border-primary transition-all duration-300 p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-dark dark:bg-primary rounded-full flex items-center justify-center mr-4 text-2xl">
                        {job.companyLogo}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text hover:text-primary dark:hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 dark:text-darkMode-textSecondary font-medium">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {job.urgent && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-error/20 text-red-600 dark:text-error text-xs font-semibold rounded-full">
                          Urgent
                        </span>
                      )}
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getMatchColor(job.matchPercentage)}`}>
                        {job.matchPercentage}% Match
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-darkMode-textSecondary">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                      {job.remote && <span className="ml-1 text-secondary dark:text-darkMode-success font-semibold">(Remote)</span>}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {job.salary}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job.type)}`}>
                      {job.type}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4 leading-relaxed">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-darkMode-text mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary-dark/20 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary-light/30 dark:border-primary/30 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-darkMode-textSecondary">
                    <div className="flex items-center space-x-4">
                      <span>Posted {formatDate(job.postedDate)}</span>
                      <span>Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col space-y-3">
                  <Link
                    to={`/student/jobs/${job.id}`}
                    className="btn-primary text-center"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/student/jobs/${job.id}/apply`}
                    className="border-2 border-secondary dark:border-darkMode-success text-secondary dark:text-darkMode-success hover:bg-secondary hover:text-white dark:hover:bg-darkMode-success dark:hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center"
                  >
                    Apply Now
                  </Link>
                  <button className="text-forest-sage dark:text-darkMode-accent hover:text-forest-sage/80 dark:hover:text-darkMode-accent/80 font-medium py-2 px-4 rounded-lg hover:bg-forest-sage/10 dark:hover:bg-darkMode-accent/10 transition-all duration-200 text-center">
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-darkMode-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400 dark:text-darkMode-textSecondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 dark:text-darkMode-text mb-4">No jobs found</h3>
            <p className="text-gray-500 dark:text-darkMode-textSecondary mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setFilters({
                  location: '',
                  jobType: '',
                  salaryRange: '',
                  remote: false,
                  skills: []
                })
                setSearchQuery('')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-primary">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalizedJobs
