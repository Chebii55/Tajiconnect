# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `LoadingSpinner.tsx`, `ProtectedRoute.tsx`)
- Services: camelCase with `.ts` extension (e.g., `auth.ts`, `client.ts`)
- Hooks: camelCase prefixed with `use` (e.g., `useCourses.ts`, `useCareerAssessment.ts`)
- Contexts: PascalCase with `Context` suffix (e.g., `ThemeContext.tsx`, `OnboardingContext.tsx`)
- Types: camelCase with `.ts` extension in types directory (e.g., `course.ts`)
- Test files: `.spec.ts` suffix for Playwright tests

**Functions:**
- React components: PascalCase (e.g., `LoadingSpinner`, `ProtectedRoute`)
- Hooks: camelCase prefixed with `use` (e.g., `useTheme`, `useCourses`)
- Event handlers: camelCase prefixed with `handle` (e.g., `handleInputChange`, `handleSubmit`, `handleNext`)
- Helper/utility functions: camelCase (e.g., `validateStep`, `transformError`)
- Async functions: camelCase, often suffixed with action (e.g., `loadCourses`, `searchCourses`)

**Variables:**
- Local state: camelCase (e.g., `isSubmitting`, `currentStep`, `authToken`)
- Constants: UPPER_SNAKE_CASE for config values (e.g., `API_VERSION`, `TOKEN_KEY`)
- Boolean variables: prefixed with `is`, `has`, or `should` (e.g., `isAuthenticated`, `hasRole`, `isRefreshing`)

**Types/Interfaces:**
- Interfaces: PascalCase (e.g., `UserProfile`, `LoadingSpinnerProps`, `UseCoursesReturn`)
- Type aliases: PascalCase (e.g., `UserRole`, `LearnerArchetype`, `CourseView`)
- Props interfaces: PascalCase with `Props` suffix (e.g., `LoadingSpinnerProps`, `ProtectedRouteProps`)
- Return type interfaces: PascalCase with `Return` suffix (e.g., `UseCoursesReturn`)

## Code Style

**Formatting:**
- No Prettier config detected in project root
- Indentation: 2 spaces
- Quotes: Single quotes for strings
- Semicolons: Not used (optional semicolons style)
- Trailing commas: Used in multiline objects/arrays

**Linting:**
- ESLint 9.x with flat config (`frontend/eslint.config.js`)
- TypeScript-ESLint for type-aware linting
- React Hooks plugin for hook rules enforcement
- React Refresh plugin for Vite HMR compatibility

**Key ESLint Rules:**
```javascript
// frontend/eslint.config.js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

## TypeScript Configuration

**Strictness:**
- `"strict": true` enabled
- `"noUnusedLocals": false` (warnings disabled)
- `"noUnusedParameters": false` (warnings disabled)
- `"noFallthroughCasesInSwitch": true`
- Target: ES2022
- JSX: react-jsx (automatic runtime)

## Import Organization

**Order:**
1. React and react-dom imports
2. Third-party library imports (react-router-dom, axios, lucide-react)
3. Local components/modules (relative paths)
4. CSS/styles imports

**Path Aliases:**
- No path aliases configured; use relative imports throughout
- Components import from relative paths: `../../contexts/ThemeContext`

**Example pattern from `frontend/src/App.tsx`:**
```typescript
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import './App.css'
```

## Error Handling

**API Errors:**
- Transform axios errors to standardized `ApiError` interface
- Handle FastAPI `detail` field specifically
- Pattern in `frontend/src/services/api/client.ts`:
```typescript
private transformError(error: AxiosError): ApiError {
  const responseData = error.response?.data as Record<string, unknown> | undefined;

  // Handle FastAPI error format (detail field)
  if (responseData?.detail) {
    return {
      code: `HTTP_${error.response?.status || 'UNKNOWN'}`,
      message: typeof responseData.detail === 'string'
        ? responseData.detail
        : JSON.stringify(responseData.detail),
      details: responseData,
    };
  }
  // ... fallback handling
}
```

**Component Error Handling:**
- Use try/catch in async functions
- Set error state for UI display
- Log errors with `console.error`
- Pattern from hooks:
```typescript
try {
  setLoading(true);
  setError(null);
  const response = await courseService.getCourses(0, 100);
  setCourses(response);
} catch (err) {
  console.error('Failed to load courses:', err);
  setError('Failed to load courses');
  setCourses([]);
} finally {
  setLoading(false);
}
```

**Authentication Errors:**
- 401 triggers automatic token refresh
- Failed refresh clears auth and redirects to `/login`

## Logging

**Framework:** `console` (native browser console)

**Patterns:**
- `console.error` for errors: `console.error('Failed to load courses:', err)`
- `console.warn` for warnings: `console.warn('Logout API call failed, clearing local storage anyway')`
- No structured logging framework in frontend

## Comments

**When to Comment:**
- File/module purpose at top using JSDoc-style
- Complex business logic explanations
- TODO markers for incomplete features

**JSDoc/TSDoc:**
- Services use JSDoc for public methods:
```typescript
/**
 * Login user with email and password
 */
async login(credentials: LoginRequest): Promise<LoginResponse> {
```

- Interface documentation with inline comments for complex types

**TODO Pattern:**
- Format: `// TODO: Description`
- Found in: `MilestoneTracker.tsx`, `TrainerContext.tsx`, `ChatView.tsx`

## Function Design

**Size:**
- Keep functions focused; most are under 30 lines
- Complex render functions split using `renderStep()` pattern

**Parameters:**
- Use TypeScript interfaces for props
- Destructure props with defaults:
```typescript
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  className = ''
}) => {
```

**Return Values:**
- Components return JSX or null
- Hooks return objects with named properties
- Service methods return typed Promises

## Component Design

**Component Structure:**
1. Imports
2. Type definitions (interfaces)
3. Component function
4. Hooks at top of function
5. Event handlers and helper functions
6. useEffect hooks
7. JSX return
8. Default export

**Example pattern:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  className = ''
}) => {
  // Component logic
  return (
    <div className={...}>
      {/* JSX */}
    </div>
  );
};

export default LoadingSpinner;
```

**State Management:**
- Local state with `useState`
- Context for global state (Theme, Onboarding, Trainer)
- No Redux or similar state library

## Module Design

**Exports:**
- Components: default export
- Services: named singleton export + default export
- Hooks: named export + default export
- Types: named exports only
- Constants: named exports from `endpoints.ts`

**Service Pattern (Singleton):**
```typescript
class AuthService {
  // ... implementation
}

export const authService = new AuthService();
export default authService;
```

**Context Pattern:**
```typescript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // ...
};
```

## Styling

**Framework:** Tailwind CSS 3.x

**Patterns:**
- Utility-first classes inline on elements
- Dark mode support via `dark:` prefix classes
- Responsive design with breakpoint prefixes: `sm:`, `md:`, `lg:`
- Common class groupings:
  - Layout: `flex`, `grid`, `items-center`, `justify-between`
  - Spacing: `p-4`, `mb-8`, `gap-4`
  - Colors: `bg-blue-600`, `text-gray-900`, `dark:bg-gray-800`
  - Effects: `hover:bg-blue-700`, `transition-colors`, `shadow-lg`

**Example:**
```tsx
<div className="flex flex-col items-center justify-center p-4">
  <div className="animate-spin rounded-full border-2 border-gray-300 border-t-primary w-8 h-8" />
  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
</div>
```

## API Integration

**Client Pattern:**
- Centralized axios client in `frontend/src/services/api/client.ts`
- Automatic token attachment via request interceptor
- Automatic 401 handling with token refresh
- Generic methods: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`

**Endpoint Organization:**
- All endpoints defined in `frontend/src/services/api/endpoints.ts`
- Grouped by service: AUTH, USERS, COURSES, AI, etc.
- Dynamic endpoints use functions: `BY_ID: (courseId: string) => \`...\``

**Service Layer Pattern:**
```typescript
// Service class wrapping API client
class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, credentials);
    this.setTokens(response.access_token, response.refresh_token);
    return response;
  }
}
```

## React Patterns

**Provider Composition:**
- Nested providers in `App.tsx` for global state
- Order matters for dependencies

**Protected Routes:**
- Use `ProtectedRoute` wrapper component
- Supports role-based access with `requiredRole` prop
- Redirects based on user role on access denial

**Hooks for Data Fetching:**
- Custom hooks encapsulate loading/error state
- Return objects with data, loading, error, and action functions

---

*Convention analysis: 2026-02-02*
