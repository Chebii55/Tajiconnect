/**
 * Custom Render Function for Testing
 *
 * Provides a custom render function that wraps components with all necessary providers.
 * This ensures components have access to routing, theme, and other contexts during tests.
 */

import React, { type ReactElement, type ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, type MemoryRouterProps } from 'react-router-dom'

// ============================================
// PROVIDER TYPES
// ============================================

interface AllProvidersProps {
  children: ReactNode
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial route for the router
   */
  route?: string
  /**
   * Initial entries for memory router (for testing navigation)
   */
  initialEntries?: MemoryRouterProps['initialEntries']
  /**
   * Use memory router instead of browser router
   */
  useMemoryRouter?: boolean
  /**
   * Initial theme setting
   */
  initialTheme?: 'light' | 'dark'
  /**
   * Whether user is authenticated
   */
  isAuthenticated?: boolean
  /**
   * Mock user data
   */
  user?: MockUser | null
}

interface MockUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'instructor' | 'student' | 'moderator'
  is_verified: boolean
}

// ============================================
// MOCK CONTEXT PROVIDERS
// ============================================

/**
 * Mock Theme Context Provider
 */
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function MockThemeProvider({
  children,
  initialTheme = 'light',
}: {
  children: ReactNode
  initialTheme?: 'light' | 'dark'
}) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(initialTheme)

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  React.useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to use mock theme context in tests
 */
export function useTestTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTestTheme must be used within MockThemeProvider')
  }
  return context
}

/**
 * Mock Auth Context Provider
 */
interface AuthContextValue {
  isAuthenticated: boolean
  user: MockUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function MockAuthProvider({
  children,
  isAuthenticated = false,
  user = null,
}: {
  children: ReactNode
  isAuthenticated?: boolean
  user?: MockUser | null
}) {
  const [authState, setAuthState] = React.useState({
    isAuthenticated,
    user,
  })

  const login = React.useCallback(async () => {
    setAuthState({
      isAuthenticated: true,
      user: user || {
        id: 'user-123',
        email: 'test@tajiconnect.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'student' as const,
        is_verified: true,
      },
    })
  }, [user])

  const logout = React.useCallback(async () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use mock auth context in tests
 */
export function useTestAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useTestAuth must be used within MockAuthProvider')
  }
  return context
}

// ============================================
// ALL PROVIDERS WRAPPER
// ============================================

/**
 * Creates an AllProviders component with the given options
 */
function createAllProviders(options: CustomRenderOptions = {}) {
  const {
    route = '/',
    initialEntries,
    useMemoryRouter = false,
    initialTheme = 'light',
    isAuthenticated = false,
    user = null,
  } = options

  function AllProviders({ children }: AllProvidersProps) {
    // Set initial route for browser router
    if (!useMemoryRouter && route !== '/') {
      window.history.pushState({}, 'Test page', route)
    }

    const Router = useMemoryRouter ? MemoryRouter : BrowserRouter
    const routerProps = useMemoryRouter
      ? { initialEntries: initialEntries || [route] }
      : {}

    return (
      <MockThemeProvider initialTheme={initialTheme}>
        <MockAuthProvider isAuthenticated={isAuthenticated} user={user}>
          <Router {...routerProps}>{children}</Router>
        </MockAuthProvider>
      </MockThemeProvider>
    )
  }

  return AllProviders
}

// ============================================
// CUSTOM RENDER FUNCTION
// ============================================

/**
 * Custom render function that wraps components with all providers
 *
 * @example
 * ```tsx
 * // Basic render
 * const { getByText } = customRender(<MyComponent />)
 *
 * // With initial route
 * customRender(<MyComponent />, { route: '/dashboard' })
 *
 * // With memory router for navigation testing
 * customRender(<MyComponent />, {
 *   useMemoryRouter: true,
 *   initialEntries: ['/dashboard', '/profile'],
 * })
 *
 * // With authenticated user
 * customRender(<MyComponent />, {
 *   isAuthenticated: true,
 *   user: { id: 'user-1', email: 'test@test.com', ... }
 * })
 *
 * // With dark theme
 * customRender(<MyComponent />, { initialTheme: 'dark' })
 * ```
 */
function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { route, initialEntries, useMemoryRouter, initialTheme, isAuthenticated, user, ...renderOptions } = options

  const AllProviders = createAllProviders({
    route,
    initialEntries,
    useMemoryRouter,
    initialTheme,
    isAuthenticated,
    user,
  })

  return render(ui, { wrapper: AllProviders, ...renderOptions })
}

// ============================================
// RENDER WITH ROUTER ONLY
// ============================================

interface RouterOnlyOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  initialEntries?: MemoryRouterProps['initialEntries']
  useMemoryRouter?: boolean
}

/**
 * Render with only router wrapper (minimal setup)
 */
function renderWithRouter(
  ui: ReactElement,
  options: RouterOnlyOptions = {}
): RenderResult {
  const { route = '/', initialEntries, useMemoryRouter = false, ...renderOptions } = options

  function RouterWrapper({ children }: { children: ReactNode }) {
    if (useMemoryRouter) {
      return (
        <MemoryRouter initialEntries={initialEntries || [route]}>
          {children}
        </MemoryRouter>
      )
    }

    if (route !== '/') {
      window.history.pushState({}, 'Test page', route)
    }

    return <BrowserRouter>{children}</BrowserRouter>
  }

  return render(ui, { wrapper: RouterWrapper, ...renderOptions })
}

// ============================================
// RENDER WITH PROVIDERS
// ============================================

interface ProvidersOnlyOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark'
  isAuthenticated?: boolean
  user?: MockUser | null
}

/**
 * Render with providers but no router (for non-routed components)
 */
function renderWithProviders(
  ui: ReactElement,
  options: ProvidersOnlyOptions = {}
): RenderResult {
  const { initialTheme = 'light', isAuthenticated = false, user = null, ...renderOptions } = options

  function ProvidersWrapper({ children }: { children: ReactNode }) {
    return (
      <MockThemeProvider initialTheme={initialTheme}>
        <MockAuthProvider isAuthenticated={isAuthenticated} user={user}>
          {children}
        </MockAuthProvider>
      </MockThemeProvider>
    )
  }

  return render(ui, { wrapper: ProvidersWrapper, ...renderOptions })
}

// ============================================
// EXPORTS
// ============================================

// Re-export everything from testing-library
export * from '@testing-library/react'

// Export custom render as default
export { customRender as render }

// Export other render utilities
export { customRender, renderWithRouter, renderWithProviders }

// Export provider components for direct use
export { MockThemeProvider, MockAuthProvider }

// Export types
export type { CustomRenderOptions, RouterOnlyOptions, ProvidersOnlyOptions, MockUser }
