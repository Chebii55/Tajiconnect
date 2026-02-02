import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Onboarding - All exist
import AgeVerification from './components/onboarding/AgeVerification'
import ProfileSettings from './components/settings/ProfileSettings'
import BriefOnboarding from './components/onboarding/BriefOnboarding'
import ParentalConsent from './components/onboarding/ParentalConsent'
import InitialAssessment from './components/onboarding/InitialAssessment'
import PsychometricTest from './components/onboarding/PsychometricTest'
import PathGeneration from './components/onboarding/PathGeneration'
import RoadmapGeneration from './components/onboarding/RoadmapGeneration'
import WelcomePage from './components/onboarding/WelcomePage'

// Psychometric Onboarding (New 90-second flow)
import { PsychometricFlow } from './components/onboarding/psychometric'

// Student Core - All exist
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import StudentSettings from './components/student/StudentSettings';

// Learning - All exist
import StudentRoadmap from './components/learning/StudentRoadmap';
import Courses from './components/learning/Courses';
import MyCourses from './components/learning/MyCourses';
import Recommendations from './components/learning/Recommendations';
import CourseSearch from './components/learning/CourseSearch';
import LearningPath from './components/learning/LearningPath';
import MilestoneTracker from './components/learning/MilestoneTracker';
import CourseLearning from './components/learning/course-player/CourseLearning';

// Assessments
import SkillsAssessment from './components/assessments/SkillsAssessment';
import PsychometricDashboard from './components/assessments/PsychometricDashboard';
import PersonalityTest from './components/assessments/PersonalityTest';
import AssessmentResults from './components/assessments/AssessmentResults';

// Progress
import Analytics from './components/progress/Analytics';
import GoalTracking from './components/progress/GoalTracking';
import TimeSpentAnalytics from './components/progress/TimeSpentAnalytics';

// Career - All exist
import CareerDashboard from './components/career/CareerDashboard';
import CareerAssessment from './components/career/CareerAssessment';
import CareerPathways from './components/career/CareerPathways';
import SkillsGapAnalysis from './components/career/SkillsGapAnalysis';
import PersonalizedRoadmap from './components/career/PersonalizedRoadmap';

// Jobs
import PersonalizedJobs from './components/jobs/PersonalizedJobs';
import GeneralJobs from './components/jobs/GeneralJobs';
import JobMatchingQuiz from './components/jobs/JobMatchingQuiz';
import SalaryInsights from './components/jobs/SalaryInsights';
import ApplicationsTracker from './components/jobs/ApplicationsTracker';

// Achievements
import Achievements from './components/achievements/Achievements';
import Badges from './components/achievements/Badges';
import Certificates from './components/achievements/Certificates';

// Legal - All exist
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookiePolicy from './components/legal/CookiePolicy';
import Support from './components/legal/Support';

// Authentication - All exist
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TrainerLogin from './components/auth/TrainerLogin';
import GoogleCallback from './components/auth/GoogleCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Trainer Components
import TrainerLayout from './components/trainer/TrainerLayout';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import LearnerProgress from './components/trainer/LearnerProgress';
import CourseManagement from './components/trainer/CourseManagement';
import TrainerAnalytics from './components/trainer/TrainerAnalytics';
import TrainerMessages from './components/trainer/TrainerMessages';
import TrainerSettings from './components/trainer/TrainerSettings';

// Note: Additional trainer components can be added as they are created

// Settings
import Settings from './components/settings/Settings';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      // Authentication routes (public)
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/auth/google/callback', element: <GoogleCallback /> },
      { path: '/trainer/login', element: <TrainerLogin /> },
      { path: '/auth/google/callback', element: <GoogleCallback /> },

      // Onboarding - Streamlined single flow
      { path: '/onboarding', element: <BriefOnboarding /> },
      { path: '/onboarding/psychometric', element: <PsychometricTest /> },
      { path: '/onboarding/psychometric-flow', element: <PsychometricFlow /> },
      { path: '/onboarding/path-generation', element: <PathGeneration /> },
      { path: '/onboarding/roadmap-generation', element: <RoadmapGeneration /> },

      // Student Core (Protected)
      { 
        path: '/student/dashboard', 
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/profile', 
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/settings', 
        element: (
          <ProtectedRoute requiredRole="student">
            <ProfileSettings />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/settings', 
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentSettings />
          </ProtectedRoute>
        ) 
      },

      // Learning (Protected)
      { 
        path: '/student/roadmap', 
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentRoadmap />
          </ProtectedRoute>
        ) 
      },
      {
        path: '/student/courses',
        element: (
          <ProtectedRoute requiredRole="student">
            <Courses />
          </ProtectedRoute>
        )
      },
      {
        path: '/student/courses/:courseId',
        element: (
          <ProtectedRoute requiredRole="student">
            <CourseLearning />
          </ProtectedRoute>
        )
      },
      {
        path: '/student/courses/my-courses', 
        element: (
          <ProtectedRoute requiredRole="student">
            <MyCourses />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/courses/recommendations', 
        element: (
          <ProtectedRoute requiredRole="student">
            <Recommendations />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/courses/search', 
        element: (
          <ProtectedRoute requiredRole="student">
            <CourseSearch />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/learning-path', 
        element: (
          <ProtectedRoute requiredRole="student">
            <LearningPath />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/milestones', 
        element: (
          <ProtectedRoute requiredRole="student">
            <MilestoneTracker />
          </ProtectedRoute>
        ) 
      },

      // Assessments (Protected)
      {
        path: '/student/assessments',
        element: <Navigate to="/student/assessments/skills" replace />
      },
      {
        path: '/student/assessments/skills', 
        element: (
          <ProtectedRoute requiredRole="student">
            <SkillsAssessment />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/assessments/psychometric', 
        element: (
          <ProtectedRoute requiredRole="student">
            <PsychometricDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/assessments/personality', 
        element: (
          <ProtectedRoute requiredRole="student">
            <PersonalityTest />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/assessments/results', 
        element: (
          <ProtectedRoute requiredRole="student">
            <AssessmentResults />
          </ProtectedRoute>
        ) 
      },

      // Progress (Protected)
      {
        path: '/student/progress/analytics',
        element: (
          <ProtectedRoute requiredRole="student">
            <Analytics />
          </ProtectedRoute>
        )
      },
      {
        path: '/student/progress/goals', 
        element: (
          <ProtectedRoute requiredRole="student">
            <GoalTracking />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/progress/time-tracking', 
        element: (
          <ProtectedRoute requiredRole="student">
            <TimeSpentAnalytics />
          </ProtectedRoute>
        ) 
      },

      // Career (Protected)
      { 
        path: '/student/career', 
        element: (
          <ProtectedRoute requiredRole="student">
            <CareerDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/career/assessment', 
        element: (
          <ProtectedRoute requiredRole="student">
            <CareerAssessment />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/career/pathways', 
        element: (
          <ProtectedRoute requiredRole="student">
            <CareerPathways />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/career/skills-gap', 
        element: (
          <ProtectedRoute requiredRole="student">
            <SkillsGapAnalysis />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/roadmap/:careerPath', 
        element: (
          <ProtectedRoute requiredRole="student">
            <PersonalizedRoadmap />
          </ProtectedRoute>
        ) 
      },

      // Jobs (Protected)
      {
        path: '/student/jobs',
        element: <Navigate to="/student/jobs/personalized" replace />
      },
      {
        path: '/student/jobs/personalized', 
        element: (
          <ProtectedRoute requiredRole="student">
            <PersonalizedJobs />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/jobs/general', 
        element: (
          <ProtectedRoute requiredRole="student">
            <GeneralJobs />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/jobs/matching-quiz', 
        element: (
          <ProtectedRoute requiredRole="student">
            <JobMatchingQuiz />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/jobs/salary-insights', 
        element: (
          <ProtectedRoute requiredRole="student">
            <SalaryInsights />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/jobs/applications', 
        element: (
          <ProtectedRoute requiredRole="student">
            <ApplicationsTracker />
          </ProtectedRoute>
        ) 
      },

      // Achievements (Protected)
      { 
        path: '/student/achievements', 
        element: (
          <ProtectedRoute requiredRole="student">
            <Achievements />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/student/achievements/badges', 
        element: (
          <ProtectedRoute requiredRole="student">
            <Badges />
          </ProtectedRoute>
        ) 
      },
      {
        path: '/student/certificates',
        element: (
          <ProtectedRoute requiredRole="student">
            <Certificates />
          </ProtectedRoute>
        )
      },

      // Legal
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <TermsOfService /> },
      { path: '/cookies', element: <CookiePolicy /> },
      { path: '/support', element: <Support /> },
      { path: '/contact', element: <Support /> },

      // Settings (Protected)
      { 
        path: '/settings', 
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ) 
      },

    ]
  },
  
  // Trainer Routes (Protected)
  {
    path: '/trainer',
    element: (
      <ProtectedRoute requiredRole="trainer">
        <TrainerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TrainerDashboard /> },
      { path: 'dashboard', element: <TrainerDashboard /> },
      
      // Course Management
      { path: 'courses', element: <CourseManagement /> },
      
      // Learner Management
      { path: 'learners', element: <LearnerProgress /> },
      
      // Analytics
      { path: 'analytics', element: <TrainerAnalytics /> },
      
      // Communication
      { path: 'messages', element: <TrainerMessages /> },
      
      // Settings
      { path: 'settings', element: <TrainerSettings /> },
    ]
  }
]);
