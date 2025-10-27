import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Circle,
  Play,
  Award,
  TrendingUp,
  BarChart3,
  Globe,
  Heart,
  Lightbulb,
  Brain
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'not-started' | 'in-progress' | 'completed' | 'locked';
  progress: number;
  rating: number;
  enrolledStudents: number;
  skills: string[];
  prerequisites?: string[];
}

interface PathModule {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  estimatedHours: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
}

interface PathDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  estimatedHours: number;
  rating: number;
  enrolledStudents: number;
  completionRate: number;
  skills: string[];
  learningOutcomes: string[];
  careerPaths: string[];
  modules: PathModule[];
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

const LearningPath: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'progress' | 'community'>('overview');

  const mockPath: PathDetails = {
    id: '1',
    title: 'Global Citizenship & Social-Emotional Learning Path',
    description: 'Develop as an empowered global citizen through GCED principles, SEL competencies, and human rights-based approaches. Build skills for positive community impact and sustainable development.',
    category: 'GCED Core',
    difficulty: 'Intermediate',
    duration: '6-9 months',
    estimatedHours: 180,
    rating: 4.9,
    enrolledStudents: 8420,
    completionRate: 85,
    skills: ['Global Citizenship', 'Human Rights', 'Emotional Intelligence', 'Critical Thinking', 'Advocacy', 'Cultural Competence', 'Community Organizing', 'Sustainable Development'],
    learningOutcomes: [
      'Understand human rights principles and apply them in daily life',
      'Develop emotional intelligence and resilience skills',
      'Practice inclusive leadership and cultural competence',
      'Create advocacy campaigns for social justice issues',
      'Build community organizing and collaboration skills',
      'Apply HRBA principles in personal and professional contexts'
    ],
    careerPaths: [
      'Community Development Officer',
      'Human Rights Advocate',
      'Social Impact Coordinator',
      'Nonprofit Program Manager',
      'Inclusive Education Specialist',
      'Policy Research Analyst'
    ],
    progress: 75,
    status: 'in-progress',
    modules: [
      {
        id: '1',
        title: 'GCED Foundations',
        description: 'Human rights, global citizenship, and social justice fundamentals',
        estimatedHours: 45,
        status: 'completed',
        progress: 100,
        courses: [
          {
            id: '1',
            title: 'Global Citizenship & Human Rights Foundations',
            description: 'Understanding human rights principles and global citizenship',
            duration: '24 hours',
            difficulty: 'Beginner',
            status: 'completed',
            progress: 100,
            rating: 4.9,
            enrolledStudents: 45000,
            skills: ['Human Rights', 'Global Citizenship', 'Social Justice']
          },
          {
            id: '2',
            title: 'Cultural Competence & Diversity',
            description: 'Build skills for cross-cultural understanding and inclusion',
            duration: '21 hours',
            difficulty: 'Beginner',
            status: 'completed',
            progress: 100,
            rating: 4.8,
            enrolledStudents: 38000,
            skills: ['Cultural Awareness', 'Inclusion', 'Bias Recognition']
          }
        ]
      },
      {
        id: '2',
        title: 'Social-Emotional Learning',
        description: 'Develop emotional intelligence, resilience, and relationship skills',
        estimatedHours: 50,
        status: 'in-progress',
        progress: 80,
        courses: [
          {
            id: '3',
            title: 'SEL Essentials: Self-Awareness & Management',
            description: 'Build emotional self-awareness and self-regulation skills',
            duration: '18 hours',
            difficulty: 'Beginner',
            status: 'completed',
            progress: 100,
            rating: 4.8,
            enrolledStudents: 38000,
            skills: ['Self-Awareness', 'Emotional Regulation', 'Mindfulness'],
            prerequisites: ['GCED Foundations']
          },
          {
            id: '4',
            title: 'Empathy & Relationship Building',
            description: 'Develop empathy, communication, and healthy relationship skills',
            duration: '20 hours',
            difficulty: 'Intermediate',
            status: 'in-progress',
            progress: 70,
            rating: 4.9,
            enrolledStudents: 32000,
            skills: ['Empathy', 'Communication', 'Conflict Resolution'],
            prerequisites: ['SEL Essentials']
          },
          {
            id: '5',
            title: 'Resilience & Stress Management',
            description: 'Build resilience and learn healthy coping strategies',
            duration: '12 hours',
            difficulty: 'Intermediate',
            status: 'not-started',
            progress: 0,
            rating: 4.7,
            enrolledStudents: 28000,
            skills: ['Resilience', 'Stress Management', 'Problem Solving'],
            prerequisites: ['SEL Essentials']
          }
        ]
      },
      {
        id: '3',
        title: 'Community Impact & Advocacy',
        description: 'Learn organizing, advocacy, and community development skills',
        estimatedHours: 85,
        status: 'not-started',
        progress: 0,
        courses: [
          {
            id: '6',
            title: 'Community Organizing Fundamentals',
            description: 'Learn grassroots organizing and community mobilization',
            duration: '25 hours',
            difficulty: 'Intermediate',
            status: 'locked',
            progress: 0,
            rating: 4.8,
            enrolledStudents: 15000,
            skills: ['Community Organizing', 'Mobilization', 'Campaign Planning'],
            prerequisites: ['GCED Foundations', 'SEL Essentials']
          },
          {
            id: '7',
            title: 'Advocacy & Policy Change',
            description: 'Develop advocacy skills and understand policy processes',
            duration: '30 hours',
            difficulty: 'Advanced',
            status: 'locked',
            progress: 0,
            rating: 4.7,
            enrolledStudents: 12000,
            skills: ['Advocacy', 'Policy Analysis', 'Strategic Communication'],
            prerequisites: ['Community Organizing']
          },
          {
            id: '8',
            title: 'Sustainable Development Projects',
            description: 'Design and implement community development projects',
            duration: '30 hours',
            difficulty: 'Advanced',
            status: 'locked',
            progress: 0,
            rating: 4.9,
            enrolledStudents: 10000,
            skills: ['Project Management', 'Sustainable Development', 'Impact Measurement'],
            prerequisites: ['Community Organizing']
          }
        ]
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'locked': return <Circle className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'locked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1C3D6E] rounded-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#1C3D6E] mb-2">{mockPath.title}</h1>
                <p className="text-gray-600 mb-2">{mockPath.description}</p>
                <p className="text-sm text-[#4A9E3D] font-medium mb-4">
                  🌍 TFDN Certified • CBC Aligned • HRBA Framework
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {mockPath.rating} ({mockPath.enrolledStudents.toLocaleString()} students)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {mockPath.estimatedHours} hours
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(mockPath.difficulty)}`}>
                    {mockPath.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Your Progress</div>
                <div className="text-2xl font-bold text-[#1C3D6E]">{mockPath.progress}%</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[#4A9E3D] h-2 rounded-full"
                    style={{ width: `${mockPath.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="px-6 py-3 bg-[#4A9E3D] text-white rounded-lg hover:bg-[#3A7B30] transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'curriculum', label: 'Curriculum', icon: BookOpen },
              { key: 'progress', label: 'Progress', icon: TrendingUp },
              { key: 'community', label: 'Community', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'overview' | 'curriculum' | 'progress' | 'community')}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-[#3DAEDB] text-[#1C3D6E] bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-[#1C3D6E] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* What You'll Learn */}
                <div>
                  <h3 className="text-xl font-bold text-[#1C3D6E] mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPath.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4A9E3D] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills You'll Gain */}
                <div>
                  <h3 className="text-xl font-bold text-[#1C3D6E] mb-4">Skills You'll Gain</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockPath.skills.map((skill) => (
                      <span key={skill} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Paths */}
                <div>
                  <h3 className="text-xl font-bold text-[#1C3D6E] mb-4">Career Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockPath.careerPaths.map((career) => (
                      <div key={career} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Award className="w-6 h-6 text-[#3DAEDB]" />
                        <span className="font-medium text-gray-900">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Path Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary-dark rounded-xl p-6 text-white">
                    <h4 className="font-bold mb-2">Completion Rate</h4>
                    <div className="text-3xl font-bold">{mockPath.completionRate}%</div>
                    <p className="text-green-100 text-sm">of students complete this path</p>
                  </div>

                  <div className="bg-primary rounded-xl p-6 text-white">
                    <h4 className="font-bold mb-2">Average Duration</h4>
                    <div className="text-3xl font-bold">{mockPath.duration}</div>
                    <p className="text-blue-100 text-sm">to complete the full path</p>
                  </div>

                  <div className="bg-accent-teal rounded-xl p-6 text-white">
                    <h4 className="font-bold mb-2">Student Rating</h4>
                    <div className="text-3xl font-bold">{mockPath.rating}/5</div>
                    <p className="text-teal-100 text-sm">based on {mockPath.enrolledStudents.toLocaleString()} reviews</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1C3D6E]">Learning Modules</h3>

                {mockPath.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-[#1C3D6E] text-white rounded-full font-bold">
                            {moduleIndex + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#1C3D6E]">{module.title}</h4>
                            <p className="text-gray-600">{module.description}</p>
                            <p className="text-sm text-gray-500 mt-1">{module.estimatedHours} hours</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                            {module.status.replace('-', ' ')}
                          </span>
                          <div className="mt-2">
                            <div className="text-sm text-gray-600">Progress: {module.progress}%</div>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-[#4A9E3D] h-1.5 rounded-full"
                                style={{ width: `${module.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {module.courses.map((course) => (
                          <div key={course.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(course.status)}
                              <div className="flex-grow">
                                <h5 className="font-semibold text-gray-900">{course.title}</h5>
                                <p className="text-gray-600 text-sm">{course.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                  <span>{course.duration}</span>
                                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                                    {course.difficulty}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {course.rating}
                                  </span>
                                </div>
                                {course.prerequisites && (
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-500">Prerequisites: {course.prerequisites.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {course.status === 'in-progress' && (
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">{course.progress}%</div>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-[#3DAEDB] h-1.5 rounded-full"
                                      style={{ width: `${course.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              {course.status !== 'locked' && (
                                <Link
                                  to={`/student/courses/${course.id}`}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    course.status === 'completed'
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : course.status === 'in-progress'
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-[#1C3D6E] text-white hover:bg-[#2A4F7C]'
                                  }`}
                                >
                                  {course.status === 'completed' ? 'Review' :
                                   course.status === 'in-progress' ? 'Continue' : 'Start'}
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1C3D6E]">Your GCED Development Journey</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">Learning Progress</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#4A9E3D] mb-2">{mockPath.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#4A9E3D] to-[#2C857A] h-3 rounded-full"
                          style={{ width: `${mockPath.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">2 of 3 modules completed</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">HRBA Impact Score</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#3DAEDB] mb-2">85%</div>
                      <p className="text-gray-600 text-sm">Community engagement & advocacy</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-[#3DAEDB] h-2 rounded-full"
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">SEL Development</h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#2C857A] mb-2">Advanced</div>
                      <p className="text-gray-600 text-sm">Emotional intelligence level</p>
                      <div className="flex items-center justify-center gap-1 mt-3">
                        <Heart className="w-4 h-4 text-[#2C857A]" />
                        <span className="text-sm text-gray-600">Resilience: 92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Psychometric Assessment Results */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-[#1C3D6E] mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-[#3DAEDB]" />
                    Psychometric Development Tracker
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#4A9E3D] mb-1">92%</div>
                      <p className="text-sm text-gray-600">Empathy Index</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#3DAEDB] mb-1">88%</div>
                      <p className="text-sm text-gray-600">Critical Thinking</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#2C857A] mb-1">85%</div>
                      <p className="text-sm text-gray-600">Cultural Competence</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">90%</div>
                      <p className="text-sm text-gray-600">Leadership Potential</p>
                    </div>
                  </div>
                </div>

                {/* Module Progress */}
                <div>
                  <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">Module Progress</h4>
                  <div className="space-y-4">
                    {mockPath.modules.map((module) => (
                      <div key={module.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-900">{module.title}</h5>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                            {module.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#4A9E3D] h-2 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {module.courses.filter(c => c.status === 'completed').length} of {module.courses.length} courses completed
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1C3D6E]">Community Impact Hub</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">Learning Circles</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-8 h-8 text-[#4A9E3D]" />
                        <div>
                          <h5 className="font-semibold">Global Citizens Unite</h5>
                          <p className="text-sm text-gray-600">142 active members • Climate Action Focus</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Heart className="w-8 h-8 text-[#3DAEDB]" />
                        <div>
                          <h5 className="font-semibold">Empathy Circle - Nairobi</h5>
                          <p className="text-sm text-gray-600">68 active members • SEL Peer Support</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Lightbulb className="w-8 h-8 text-[#2C857A]" />
                        <div>
                          <h5 className="font-semibold">Young Innovators Kenya</h5>
                          <p className="text-sm text-gray-600">95 active members • STEM for Change</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-[#1C3D6E] text-white rounded-lg hover:bg-[#2A4F7C] transition-colors">
                      Join Learning Circle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1C3D6E] mb-4">Community Discussions</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-sm">How can youth lead climate action in Kenya?</h5>
                        <p className="text-xs text-gray-600">28 replies • 1 hour ago</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-sm">Strategies for inclusive community organizing</h5>
                        <p className="text-xs text-gray-600">15 replies • 3 hours ago</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-sm">GCED project ideas for local communities</h5>
                        <p className="text-xs text-gray-600">42 replies • 6 hours ago</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 border border-[#1C3D6E] text-[#1C3D6E] rounded-lg hover:bg-[#1C3D6E] hover:text-white transition-colors">
                      Join Discussion
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-[#4A9E3D] to-[#2C857A] rounded-xl p-6 text-white">
                    <h4 className="text-lg font-bold mb-4">Mentor Network</h4>
                    <p className="mb-4">Connect with TFDN alumni and community leaders for guidance on your GCED journey.</p>
                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-white text-[#4A9E3D] rounded-lg hover:bg-gray-100 transition-colors">
                        Find Mentor
                      </button>
                      <button className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                        Become Mentor
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#1C3D6E] to-[#3DAEDB] rounded-xl p-6 text-white">
                    <h4 className="text-lg font-bold mb-4">Community Projects</h4>
                    <p className="mb-4">Join ongoing community impact projects and create positive change in your area.</p>
                    <div className="flex gap-4">
                      <button className="px-6 py-2 bg-white text-[#1C3D6E] rounded-lg hover:bg-gray-100 transition-colors">
                        Browse Projects
                      </button>
                      <button className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                        Start Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;