# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** Monorepo with Client-Server Architecture (React SPA + Node.js Mock Backend)

**Key Characteristics:**
- React SPA frontend with React Router for client-side routing
- Context-based state management with multiple providers
- Layered service architecture (API services wrapping axios client)
- JSON Server mock backend with custom route handlers
- Role-based access control (student, instructor/trainer, admin)
- Feature-organized component structure

## Layers

**Presentation Layer (UI Components):**
- Purpose: Render UI and handle user interactions
- Location: `frontend/src/components/`
- Contains: React functional components with Tailwind CSS styling
- Depends on: Contexts, Hooks, Services
- Used by: Router (via route definitions)

**Context Layer (Global State):**
- Purpose: Manage application-wide state and cross-cutting concerns
- Location: `frontend/src/contexts/`
- Contains: React Context providers with custom hooks
- Depends on: Services (for data fetching), Utils
- Used by: Components, Hooks

**Service Layer (API Communication):**
- Purpose: Abstract API communication and data transformation
- Location: `frontend/src/services/api/`
- Contains: Service classes/objects wrapping API endpoints
- Depends on: API Client (`client.ts`), Endpoints configuration
- Used by: Contexts, Hooks, Components

**API Client Layer:**
- Purpose: Handle HTTP requests, authentication, error handling
- Location: `frontend/src/services/api/client.ts`
- Contains: Axios instance with interceptors for auth tokens
- Depends on: Axios, localStorage (for tokens)
- Used by: All service modules

**Hooks Layer (Reusable Logic):**
- Purpose: Encapsulate stateful logic for reuse across components
- Location: `frontend/src/hooks/`
- Contains: Custom React hooks for courses, progress, WebSocket, etc.
- Depends on: Services, Contexts
- Used by: Components

**Backend Layer (Mock Server):**
- Purpose: Provide API endpoints and mock data
- Location: `backend/`
- Contains: JSON Server with custom middleware and services
- Depends on: `db.json` for data, custom service modules
- Used by: Frontend via HTTP requests

## Data Flow

**Authentication Flow:**

1. User submits credentials via `Login.tsx` component
2. `authService.login()` called in `frontend/src/services/api/auth.ts`
3. `apiClient` sends POST to `/api/v1/auth/login`
4. Backend validates credentials against `db.json`
5. Backend returns user data + JWT token
6. Token stored in localStorage via `authService`
7. User redirected based on role via `getLoginRedirectPath()`

**Page Data Loading Flow:**

1. Component mounts (e.g., `StudentDashboard.tsx`)
2. `useEffect` triggers data loading
3. Multiple API calls via services (`courseService`, `apiClient`)
4. Responses stored in component local state
5. Component renders with loaded data

**Context-Driven Flow (e.g., Onboarding):**

1. User navigates through onboarding steps
2. Each step updates `OnboardingContext` via `updateData()`
3. Context state persists across route changes
4. Final step calls `onboardingService.processOnboardingData()`
5. Backend processes and generates career recommendations

**State Management:**
- Global state via React Context (Theme, Onboarding, Trainer, Recommendations, LearningPath, RealTime)
- Local component state via `useState` for UI-specific state
- Server state cached in contexts or component state (no dedicated caching library)
- Auth state in localStorage with utilities in `frontend/src/utils/auth.ts`

## Key Abstractions

**API Service Pattern:**
- Purpose: Encapsulate endpoint-specific logic and typing
- Examples: `frontend/src/services/api/auth.ts`, `frontend/src/services/api/courses.ts`, `frontend/src/services/api/user.ts`
- Pattern: Singleton service objects with typed methods wrapping `apiClient` calls

**Context Provider Pattern:**
- Purpose: Share state across component trees without prop drilling
- Examples: `frontend/src/contexts/ThemeContext.tsx`, `frontend/src/contexts/OnboardingContext.tsx`
- Pattern: Context + Provider component + custom `useX()` hook for access

**Protected Route Pattern:**
- Purpose: Guard routes based on authentication and role
- Examples: `frontend/src/components/auth/ProtectedRoute.tsx`
- Pattern: Wrapper component checking auth state, redirecting if unauthorized

**Layout Pattern:**
- Purpose: Provide consistent page structure with shared elements
- Examples: `frontend/src/components/Layout.tsx`, `frontend/src/components/trainer/TrainerLayout.tsx`
- Pattern: Layout component with `<Outlet />` for nested routes

## Entry Points

**Frontend Entry:**
- Location: `frontend/src/main.tsx`
- Triggers: Browser loads `index.html`
- Responsibilities: Mount React app to DOM with StrictMode

**App Root:**
- Location: `frontend/src/App.tsx`
- Triggers: Rendered by `main.tsx`
- Responsibilities: Wrap RouterProvider with all Context providers

**Router Configuration:**
- Location: `frontend/src/router.tsx`
- Triggers: Navigation events
- Responsibilities: Define all routes, map paths to components, apply protection

**Backend Entry:**
- Location: `backend/server.js`
- Triggers: `npm start` or `node server.js`
- Responsibilities: Initialize JSON Server, register custom routes, start listening

## Error Handling

**Strategy:** Multi-level error handling with UI feedback

**Patterns:**
- API Client level: Interceptor transforms errors to standard `ApiError` format in `frontend/src/services/api/client.ts`
- Service level: Services catch and may transform errors before throwing
- Component level: `try/catch` with local error state for UI display
- Auth errors: Automatic redirect to login on 401 with token refresh attempt
- Global error utility: `frontend/src/utils/errorHandler.ts` for consistent error formatting

## Cross-Cutting Concerns

**Logging:** Console-based logging throughout (`console.log`, `console.error`), server-side logging to `backend/server.log`

**Validation:**
- Frontend: `frontend/src/utils/validation.ts` for form validation
- Backend: Inline validation in route handlers

**Authentication:**
- JWT token-based auth stored in localStorage
- Token attached via axios interceptor
- Automatic token refresh on 401 responses
- Role-based route protection via `ProtectedRoute` component

**Theming:**
- Dark mode support via `ThemeContext`
- Tailwind CSS `dark:` variant classes
- Theme preference persisted to localStorage

**Real-Time Features:**
- `RealTimeContext` for WebSocket-like functionality
- `useWebSocket` hook for real-time data updates

---

*Architecture analysis: 2026-02-02*
