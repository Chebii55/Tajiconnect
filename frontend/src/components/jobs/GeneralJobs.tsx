import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Smartphone, Globe, Search } from 'lucide-react'

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
  postedDate: string
  applicationDeadline: string
  remote: boolean
  urgent: boolean
  companyLogo: React.ReactNode
  category: string
  featured: boolean
}

interface FilterOptions {
  category: string
  location: string
  jobType: string
  salaryRange: string
  remote: boolean
  experienceLevel: string
}

const GeneralJobs = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    location: '',
    jobType: '',
    salaryRange: '',
    remote: false,
    experienceLevel: ''
  })
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery)
  const [sortBy, setSortBy] = useState<'date' | 'salary' | 'relevance'>('date')
  const [showFilters, setShowFilters] = useState(false)

  // Sample job data for demonstration purposes
  const mockJobs: Job[] = [
    {
      id: 101,
      title: "Senior Software Engineer",
      company: "Safaricom PLC",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 200,000 - 300,000",
      description: "Lead software development initiatives for M-Pesa and other digital products. Work with cutting-edge technologies and mentor junior developers.",
      requirements: ["5+ years software development", "Leadership experience", "Mobile money platform knowledge"],
      skills: ["Java", "Spring Boot", "Microservices", "AWS", "Kubernetes"],
      postedDate: "2024-01-16",
      applicationDeadline: "2024-02-16",
      remote: false,
      urgent: false,
      companyLogo: <Smartphone className="w-8 h-8 text-primary" />,
      category: "Technology",
      featured: true
    },
    {
      id: 102,
      title: "Marketing Manager",
      company: "Equity Bank",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 150,000 - 200,000",
      description: "Develop and execute marketing strategies for digital banking products. Lead campaigns across multiple channels.",
      requirements: ["Bachelor's in Marketing", "5+ years marketing experience", "Digital marketing expertise"],
      skills: ["Digital Marketing", "Campaign Management", "Analytics", "Brand Management"],
      postedDate: "2024-01-15",
      applicationDeadline: "2024-02-15",
      remote: false,
      urgent: true,
      companyLogo: "🏦",
      category: "Marketing",
      featured: true
    },
    {
      id: 103,
      title: "Data Analyst",
      company: "Kenya Airways",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 120,000 - 180,000",
      description: "Analyze operational data to improve efficiency and passenger experience. Work with large datasets and create insights.",
      requirements: ["Statistics or Data Science background", "SQL proficiency", "Business intelligence experience"],
      skills: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
      postedDate: "2024-01-14",
      applicationDeadline: "2024-02-14",
      remote: true,
      urgent: false,
      companyLogo: "✈️",
      category: "Data Science",
      featured: false
    },
    {
      id: 104,
      title: "Graphic Designer",
      company: "Nation Media Group",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 80,000 - 120,000",
      description: "Create compelling visual content for digital and print media. Work on diverse projects from newspapers to digital campaigns.",
      requirements: ["Graphic Design degree or portfolio", "Adobe Creative Suite mastery", "3+ years experience"],
      skills: ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Branding", "Typography"],
      postedDate: "2024-01-13",
      applicationDeadline: "2024-02-20",
      remote: false,
      urgent: false,
      companyLogo: "📰",
      category: "Design",
      featured: false
    },
    {
      id: 105,
      title: "Financial Analyst",
      company: "KCB Group",
      location: "Mombasa, Kenya",
      type: "Full-time",
      salary: "KSh 100,000 - 150,000",
      description: "Analyze financial data and prepare reports for senior management. Support strategic decision-making with data insights.",
      requirements: ["Finance or Accounting degree", "CPA qualification preferred", "2+ years experience"],
      skills: ["Financial Modeling", "Excel", "SQL", "Risk Analysis", "Reporting"],
      postedDate: "2024-01-12",
      applicationDeadline: "2024-02-12",
      remote: false,
      urgent: true,
      companyLogo: "💰",
      category: "Finance",
      featured: false
    },
    {
      id: 106,
      title: "DevOps Engineer",
      company: "Twiga Foods",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 180,000 - 250,000",
      description: "Build and maintain CI/CD pipelines for agricultural technology platform. Ensure scalability and reliability.",
      requirements: ["DevOps experience", "Cloud platforms knowledge", "Container orchestration"],
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
      postedDate: "2024-01-11",
      applicationDeadline: "2024-02-11",
      remote: true,
      urgent: false,
      companyLogo: "🥬",
      category: "Technology",
      featured: false
    },
    {
      id: 107,
      title: "Product Manager",
      company: "Flutterwave",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KSh 200,000 - 280,000",
      description: "Lead product development for fintech solutions across African markets. Work with cross-functional teams.",
      requirements: ["Product management experience", "Fintech background", "Agile methodology knowledge"],
      skills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Stakeholder Management"],
      postedDate: "2024-01-10",
      applicationDeadline: "2024-02-10",
      remote: true,
      urgent: true,
      companyLogo: "💳",
      category: "Product",
      featured: true
    },
    {
      id: 108,
      title: "Content Writer",
      company: "Standard Group",
      location: "Nairobi, Kenya",
      type: "Contract",
      salary: "KSh 60,000 - 100,000",
      description: "Create engaging content for digital platforms and print media. Cover business and technology topics.",
      requirements: ["Journalism or Communications degree", "Writing portfolio", "SEO knowledge"],
      skills: ["Writing", "SEO", "Research", "Content Strategy", "Social Media"],
      postedDate: "2024-01-09",
      applicationDeadline: "2024-02-09",
      remote: true,
      urgent: false,
      companyLogo: "📝",
      category: "Content",
      featured: false
    },
    {
      id: 109,
      title: "Sales Representative",
      company: "Coca-Cola Kenya",
      location: "Kisumu, Kenya",
      type: "Full-time",
      salary: "KSh 70,000 - 120,000",
      description: "Drive sales growth in western Kenya region. Build relationships with retailers and distributors.",
      requirements: ["Sales experience", "Valid driving license", "Customer service skills"],
      skills: ["Sales", "Customer Relationship Management", "Negotiation", "Territory Management"],
      postedDate: "2024-01-08",
      applicationDeadline: "2024-02-08",
      remote: false,
      urgent: false,
      companyLogo: "🥤",
      category: "Sales",
      featured: false
    },
    {
      id: 110,
      title: "UX/UI Designer",
      company: "iHub",
      location: "Nairobi, Kenya",
      type: "Contract",
      salary: "KSh 100,000 - 160,000",
      description: "6-month contract to redesign startup incubation platform. Work with multiple startups on design challenges.",
      requirements: ["UX/UI design portfolio", "Design thinking methodology", "Startup experience preferred"],
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
      postedDate: "2024-01-07",
      applicationDeadline: "2024-02-07",
      remote: true,
      urgent: true,
      companyLogo: "🎨",
      category: "Design",
      featured: false
    }
  ]

  const jobCategories = [
    "Accounts and Finance",
    "Agriculture, Food and Nutrition",
    "Artificial Intelligence",
    "Education",
    "Energy",
    "Environment and Climate Change",
    "Healthcare",
    "Innovation",
    "Manufacturing",
    "Media",
    "Research Activities",
    "Startups and Early-Stage",
    "Sustainable Development",
    "Technology",
    "Travel and Tourism"
  ]

  useEffect(() => {
    // Simulate loading jobs
    setTimeout(() => {
      setJobs(mockJobs)
      setFilteredJobs(mockJobs)
    }, 500)
  }, [mockJobs])

  useEffect(() => {
    applyFilters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentSearchQuery, sortBy, jobs])

  const applyFilters = () => {
    const filtered = jobs.filter(job => {
      const matchesSearch = !currentSearchQuery ||
                           job.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                           job.skills.some(skill => skill.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
                           job.category.toLowerCase().includes(currentSearchQuery.toLowerCase())

      const matchesCategory = !filters.category || job.category === filters.category
      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesType = !filters.jobType || job.type === filters.jobType
      const matchesRemote = !filters.remote || job.remote

      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesRemote
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        case 'salary': {
          const aSalary = parseInt(a.salary.split(' - ')[1].replace(/[^\d]/g, ''))
          const bSalary = parseInt(b.salary.split(' - ')[1].replace(/[^\d]/g, ''))
          return bSalary - aSalary
        }
        case 'relevance':
          // Sort by featured first, then by date
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
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
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            General Job Board
          </h1>
          <p className="text-gray-600 dark:text-darkMode-textSecondary text-xl max-w-3xl mx-auto">
            Browse all available job opportunities from top companies in Kenya
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
                  value={currentSearchQuery}
                  onChange={(e) => setCurrentSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkMode-bg dark:text-darkMode-text dark:placeholder-darkMode-textSecondary transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'salary' | 'relevance')}
              className="px-4 py-3 border border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-darkMode-bg dark:text-darkMode-text"
            >
              <option value="relevance">Most Relevant</option>
              <option value="date">Latest First</option>
              <option value="salary">Highest Salary</option>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-darkMode-text mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-darkMode-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-darkMode-bg dark:text-darkMode-text"
                  >
                    <option value="">All Categories</option>
                    {jobCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
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
                    <option value="0-100000">Under KSh 100K</option>
                    <option value="100000-150000">KSh 100K - 150K</option>
                    <option value="150000-200000">KSh 150K - 200K</option>
                    <option value="200000+">KSh 200K+</option>
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
            Showing <span className="font-semibold text-primary-dark dark:text-darkMode-text">{filteredJobs.length}</span> jobs
            {currentSearchQuery && <span> for "{currentSearchQuery}"</span>}
          </p>
        </div>

        {/* Job Categories Quick Filter */}
        <div className="mb-8 bg-white dark:bg-darkMode-surface rounded-2xl shadow-lg border-0 dark:border dark:border-darkMode-border p-6">
          <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                !filters.category
                  ? 'bg-primary-dark dark:bg-primary text-white'
                  : 'bg-gray-100 dark:bg-darkMode-bg text-gray-600 dark:text-darkMode-textSecondary hover:bg-gray-200 dark:hover:bg-darkMode-border'
              }`}
            >
              All Jobs
            </button>
            {jobCategories.slice(0, 8).map(category => (
              <button
                key={category}
                onClick={() => setFilters(prev => ({ ...prev, category }))}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  filters.category === category
                    ? 'bg-secondary dark:bg-darkMode-success text-white'
                    : 'bg-gray-100 dark:bg-darkMode-bg text-gray-600 dark:text-darkMode-textSecondary hover:bg-gray-200 dark:hover:bg-darkMode-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className={`bg-white dark:bg-darkMode-surface rounded-2xl shadow-lg border hover:shadow-2xl hover:border-primary dark:hover:border-primary transition-all duration-300 p-6 ${
                job.featured ? 'border-secondary dark:border-darkMode-success bg-secondary/5 dark:bg-darkMode-success/10' : 'border-gray-100 dark:border-darkMode-border'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-dark dark:bg-primary rounded-full flex items-center justify-center mr-4 text-2xl">
                        {job.companyLogo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text hover:text-primary dark:hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <span className="px-2 py-1 bg-primary-dark dark:bg-primary text-white text-xs font-bold rounded-full">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-darkMode-textSecondary font-medium">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {job.urgent && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-error/20 text-red-600 dark:text-error text-xs font-semibold rounded-full">
                          Urgent
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 dark:bg-darkMode-bg text-gray-600 dark:text-darkMode-textSecondary text-xs font-semibold rounded-full">
                        {job.category}
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
                      {job.skills.slice(0, 6).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary-dark/20 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary-light/30 dark:border-primary/30 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 6 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-darkMode-bg text-gray-500 dark:text-darkMode-textSecondary rounded-full text-sm font-medium">
                          +{job.skills.length - 6} more
                        </span>
                      )}
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
            <p className="text-gray-500 dark:text-darkMode-textSecondary mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  location: '',
                  jobType: '',
                  salaryRange: '',
                  remote: false,
                  experienceLevel: ''
                })
                setCurrentSearchQuery('')
              }}
              className="btn-primary"
            >
              Clear All Filters
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

export default GeneralJobs
