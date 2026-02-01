# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
Tajiconnect/
├── backend/                    # Mock API server (JSON Server)
│   ├── services/               # Backend business logic services
│   ├── db.json                 # JSON Server database
│   ├── server.js               # Server entry point with custom routes
│   ├── career-algorithm.js     # AI career matching logic
│   └── routes.json             # JSON Server route rewrites
├── frontend/                   # React SPA application
│   ├── src/                    # Application source code
│   │   ├── components/         # React components by feature
│   │   ├── contexts/           # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services and client
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   ├── data/               # Static data (course content JSON)
│   │   ├── constants/          # Application constants
│   │   ├── assets/             # Static assets (images, etc.)
│   │   ├── App.tsx             # Root component with providers
│   │   ├── router.tsx          # Route definitions
│   │   └── main.tsx            # Application entry point
│   ├── tests/                  # Test files
│   └── public/                 # Static public assets
├── .planning/                  # Planning documentation
│   └── codebase/               # Codebase analysis docs
└── *.md                        # Project documentation
```

## Directory Purposes

**`backend/`:**
- Purpose: Mock API server for development
- Contains: JSON Server setup, custom route handlers, business logic services
- Key files: `server.js` (entry), `db.json` (data), `career-algorithm.js` (AI logic)

**`backend/services/`:**
- Purpose: Backend service modules for complex operations
- Contains: Career generation and onboarding integration services
- Key files: `careerGenerationService.js`, `onboardingIntegrationService.js`

**`frontend/src/components/`:**
- Purpose: React UI components organized by feature/domain
- Contains: All presentational and container components
- Key files: `Layout.tsx`, `Navbar.tsx`, `MainSidebar.tsx`

**`frontend/src/components/auth/`:**
- Purpose: Authentication-related components
- Contains: Login, Register, ProtectedRoute, GoogleCallback
- Key files: `Login.tsx`, `Register.tsx`, `ProtectedRoute.tsx`

**`frontend/src/components/student/`:**
- Purpose: Student role-specific components
- Contains: Dashboard, Profile, Settings for students
- Key files: `StudentDashboard.tsx`, `StudentProfile.tsx`, `StudentSettings.tsx`

**`frontend/src/components/trainer/`:**
- Purpose: Trainer/instructor role-specific components
- Contains: Dashboard, course management, analytics, messaging
- Key files: `TrainerLayout.tsx`, `TrainerDashboard.tsx`, `CourseManagement.tsx`

**`frontend/src/components/learning/`:**
- Purpose: Learning and course-related components
- Contains: Course browsing, roadmaps, course player
- Key files: `Courses.tsx`, `StudentRoadmap.tsx`, `course-player/CourseLearning.tsx`

**`frontend/src/components/onboarding/`:**
- Purpose: User onboarding flow components
- Contains: Multi-step onboarding process
- Key files: `BriefOnboarding.tsx`, `PsychometricTest.tsx`, `PathGeneration.tsx`

**`frontend/src/components/ui/`:**
- Purpose: Reusable UI primitives and shared components
- Contains: Loading spinners, progress trackers, notifications
- Key files: `LoadingSpinner.tsx`, `Sidebar.tsx`, `ProgressTracker.tsx`

**`frontend/src/contexts/`:**
- Purpose: React Context providers for global state
- Contains: Theme, Onboarding, Trainer, Recommendations, LearningPath, RealTime contexts
- Key files: `ThemeContext.tsx`, `OnboardingContext.tsx`, `TrainerContext.tsx`

**`frontend/src/services/api/`:**
- Purpose: API communication layer
- Contains: HTTP client, endpoint definitions, service modules
- Key files: `client.ts`, `endpoints.ts`, `auth.ts`, `courses.ts`, `user.ts`

**`frontend/src/hooks/`:**
- Purpose: Reusable React hooks
- Contains: Custom hooks for courses, progress, WebSocket, etc.
- Key files: `useCourses.ts`, `useCourseProgress.ts`, `useWebSocket.ts`

**`frontend/src/types/`:**
- Purpose: TypeScript type definitions
- Contains: Domain-specific type definitions
- Key files: `course.ts` (Course, Module, Lesson, Quiz types)

**`frontend/src/utils/`:**
- Purpose: Utility functions and helpers
- Contains: Auth helpers, validation, caching, error handling
- Key files: `auth.ts`, `validation.ts`, `errorHandler.ts`, `cache.ts`

**`frontend/src/data/`:**
- Purpose: Static data and course content
- Contains: JSON files with course content
- Key files: `courses/sel-essentials.json`

## Key File Locations

**Entry Points:**
- `frontend/src/main.tsx`: React app mount point
- `frontend/src/App.tsx`: Root component with providers
- `backend/server.js`: Backend server entry

**Configuration:**
- `frontend/vite.config.ts`: Vite build configuration
- `frontend/tailwind.config.js`: Tailwind CSS configuration
- `frontend/tsconfig.json`: TypeScript configuration
- `frontend/.env`: Environment variables
- `backend/.env`: Backend environment variables

**Routing:**
- `frontend/src/router.tsx`: All route definitions (public, student, trainer)

**API Layer:**
- `frontend/src/services/api/client.ts`: Axios client with interceptors
- `frontend/src/services/api/endpoints.ts`: All API endpoint definitions
- `frontend/src/services/api/index.ts`: Service exports

**State Management:**
- `frontend/src/contexts/ThemeContext.tsx`: Theme state
- `frontend/src/contexts/OnboardingContext.tsx`: Onboarding flow state
- `frontend/src/contexts/TrainerContext.tsx`: Trainer-specific state
- `frontend/src/contexts/RecommendationsContext.tsx`: AI recommendations
- `frontend/src/contexts/LearningPathContext.tsx`: Learning path state
- `frontend/src/contexts/RealTimeContext.tsx`: Real-time updates

**Authentication:**
- `frontend/src/utils/auth.ts`: Auth utility functions
- `frontend/src/services/api/auth.ts`: Auth API service
- `frontend/src/components/auth/ProtectedRoute.tsx`: Route protection

**Testing:**
- `frontend/tests/e2e/`: End-to-end tests
- `frontend/tests/api/`: API tests
- `frontend/tests/fixtures/`: Test fixtures

## Naming Conventions

**Files:**
- Components: PascalCase (`StudentDashboard.tsx`, `ProtectedRoute.tsx`)
- Hooks: camelCase with `use` prefix (`useCourses.ts`, `useWebSocket.ts`)
- Services: camelCase (`auth.ts`, `courses.ts`, `client.ts`)
- Contexts: PascalCase with `Context` suffix (`ThemeContext.tsx`)
- Utils: camelCase (`auth.ts`, `validation.ts`)
- Types: camelCase (`course.ts`)

**Directories:**
- Feature directories: lowercase (`student`, `trainer`, `learning`)
- Subdirectories: lowercase with hyphens if needed (`course-player`)

**Variables/Functions:**
- Components: PascalCase (`StudentDashboard`, `ProtectedRoute`)
- Functions: camelCase (`loginUser`, `getUserRole`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`, `PUBLIC_ROUTES`)
- Types/Interfaces: PascalCase (`User`, `Course`, `OnboardingData`)

## Where to Add New Code

**New Student Feature:**
- Primary code: `frontend/src/components/student/`
- Route: Add to `frontend/src/router.tsx` under student routes
- Tests: `frontend/tests/e2e/`

**New Trainer Feature:**
- Primary code: `frontend/src/components/trainer/`
- Route: Add to `frontend/src/router.tsx` under trainer routes
- Navigation: Update `frontend/src/components/trainer/TrainerLayout.tsx`

**New API Service:**
- Service file: `frontend/src/services/api/{service-name}.ts`
- Endpoints: Add to `frontend/src/services/api/endpoints.ts`
- Export: Add to `frontend/src/services/api/index.ts`

**New Hook:**
- Hook file: `frontend/src/hooks/use{HookName}.ts`
- Pattern: Follow `useCourses.ts` as template

**New Context:**
- Context file: `frontend/src/contexts/{Name}Context.tsx`
- Pattern: Follow `ThemeContext.tsx` as template
- Register: Add provider to `frontend/src/App.tsx`

**New Shared Component:**
- UI primitives: `frontend/src/components/ui/`
- Pattern: Follow existing components in directory

**New Backend Endpoint:**
- Route handler: Add to `backend/server.js` as middleware
- Services: Add to `backend/services/` if complex logic needed
- Data: Update `backend/db.json` if needed

**New Type Definition:**
- Types: `frontend/src/types/{domain}.ts`
- Service types: Co-located in service file or `frontend/src/services/api/types.ts`

**New Utility:**
- Utilities: `frontend/src/utils/{name}.ts`

## Special Directories

**`frontend/dist/`:**
- Purpose: Build output
- Generated: Yes (via `npm run build`)
- Committed: No (in `.gitignore`)

**`frontend/node_modules/`:**
- Purpose: NPM dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in `.gitignore`)

**`backend/node_modules/`:**
- Purpose: NPM dependencies for backend
- Generated: Yes (via `npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning documents and codebase analysis
- Generated: No (manual/automated analysis)
- Committed: Yes

**`.netlify/`:**
- Purpose: Netlify deployment configuration
- Generated: Partially
- Committed: Some config files

**`frontend/public/`:**
- Purpose: Static assets copied directly to build
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-02-02*
