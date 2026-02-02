/**
 * Test Utilities Index
 *
 * Central export point for all test utilities.
 * Import from '@/test' in your test files.
 *
 * @example
 * ```tsx
 * import { render, screen, createMockUser, createUserEvent } from '@/test'
 * ```
 */

// Re-export render utilities
export {
  render,
  customRender,
  renderWithRouter,
  renderWithProviders,
  MockThemeProvider,
  MockAuthProvider,
  useTestTheme,
  useTestAuth,
  // Re-exports from @testing-library/react
  screen,
  fireEvent,
  waitFor,
  within,
  act,
  cleanup,
  prettyDOM,
} from './utils/render'

// Re-export test utilities
export {
  // User event
  createUserEvent,
  // Wait helpers
  wait,
  waitForNextTick,
  waitForCondition,
  // Mock data generators
  generateId,
  generateEmail,
  createMockUser,
  createMockUserProfile,
  createMockCourse,
  createMockCourses,
  createMockGamificationData,
  createMockXPEvent,
  createMockBadge,
  // Mock function helpers
  createAsyncMock,
  createAsyncErrorMock,
  createMock,
  // Storage helpers
  setupLocalStorage,
  clearLocalStorageKeys,
  setupAuthStorage,
  clearAuthStorage,
  // Form helpers
  fillForm,
  // Assertion helpers
  expectStyles,
  expectCalledWith,
  expectCalledTimes,
  // Date helpers
  createISODate,
  createRelativeDate,
  // Error helpers
  createApiError,
} from './utils/test-utils'

// Re-export MSW server and handlers
export { server } from './mocks/server'
export {
  handlers,
  errorHandlers,
  mockUser,
  mockUserProfile,
  mockCourses,
  mockGamificationData,
  mockXPHistory,
  mockTokens,
} from './mocks/handlers'

// Re-export types
export type {
  CustomRenderOptions,
  RouterOnlyOptions,
  ProvidersOnlyOptions,
  MockUser as RenderMockUser,
} from './utils/render'

export type {
  MockUser,
  MockUserProfile,
  MockCourse,
  MockGamificationData,
  MockXPEvent,
  MockBadge,
} from './utils/test-utils'
