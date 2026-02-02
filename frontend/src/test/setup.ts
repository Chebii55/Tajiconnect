/**
 * Vitest Test Setup File
 *
 * This file runs before each test file and sets up the testing environment.
 * It includes global mocks, DOM API polyfills, and MSW server configuration.
 */

import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// ============================================
// MSW SERVER SETUP
// ============================================

/**
 * Start MSW server before all tests
 */
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  })
})

/**
 * Reset handlers after each test to ensure test isolation
 */
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

/**
 * Close server after all tests
 */
afterAll(() => {
  server.close()
})

// ============================================
// BROWSER API MOCKS
// ============================================

/**
 * Mock window.matchMedia
 * Required for components that use CSS media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

/**
 * Mock IntersectionObserver
 * Required for components using lazy loading or visibility detection
 */
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: () => [],
})
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver)

/**
 * Mock ResizeObserver
 * Required for components that respond to element size changes
 */
const mockResizeObserver = vi.fn()
mockResizeObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
vi.stubGlobal('ResizeObserver', mockResizeObserver)

/**
 * Mock MutationObserver
 * Required for components that observe DOM mutations
 */
const mockMutationObserver = vi.fn()
mockMutationObserver.mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: () => [],
})
vi.stubGlobal('MutationObserver', mockMutationObserver)

// ============================================
// LOCAL STORAGE MOCK
// ============================================

/**
 * Mock localStorage with full implementation
 */
const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

/**
 * Mock sessionStorage with full implementation
 */
const sessionStorageMock: Storage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// ============================================
// NAVIGATION MOCKS
// ============================================

/**
 * Mock window.scrollTo
 */
window.scrollTo = vi.fn()

/**
 * Mock window.scroll
 */
window.scroll = vi.fn()

/**
 * Mock Element.scrollIntoView
 */
Element.prototype.scrollIntoView = vi.fn()

/**
 * Mock window.location
 */
const mockLocation = {
  href: 'http://localhost:5173',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

// ============================================
// ANIMATION MOCKS
// ============================================

/**
 * Mock requestAnimationFrame
 */
vi.stubGlobal(
  'requestAnimationFrame',
  vi.fn((callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 0)
  })
)

/**
 * Mock cancelAnimationFrame
 */
vi.stubGlobal(
  'cancelAnimationFrame',
  vi.fn((id: number) => {
    clearTimeout(id)
  })
)

/**
 * Mock Web Animations API
 */
Element.prototype.animate = vi.fn().mockReturnValue({
  cancel: vi.fn(),
  finish: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  reverse: vi.fn(),
  updatePlaybackRate: vi.fn(),
  commitStyles: vi.fn(),
  persist: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  oncancel: null,
  onfinish: null,
  onremove: null,
  currentTime: 0,
  effect: null,
  finished: Promise.resolve(),
  id: '',
  pending: false,
  playState: 'idle',
  playbackRate: 1,
  ready: Promise.resolve(),
  replaceState: 'active',
  startTime: null,
  timeline: null,
})

// ============================================
// MEDIA MOCKS
// ============================================

/**
 * Mock HTMLMediaElement methods
 */
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
window.HTMLMediaElement.prototype.pause = vi.fn()
window.HTMLMediaElement.prototype.load = vi.fn()
window.HTMLMediaElement.prototype.addTextTrack = vi.fn()

// ============================================
// FETCH & NETWORK MOCKS
// ============================================

/**
 * Mock fetch is handled by MSW, but we provide a fallback
 */
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn()
}

/**
 * Mock URL.createObjectURL
 */
URL.createObjectURL = vi.fn(() => 'mock-object-url')
URL.revokeObjectURL = vi.fn()

// ============================================
// CLIPBOARD MOCK
// ============================================

/**
 * Mock Clipboard API
 */
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
    write: vi.fn().mockResolvedValue(undefined),
    read: vi.fn().mockResolvedValue([]),
  },
  writable: true,
})

// ============================================
// ENVIRONMENT VARIABLES MOCK
// ============================================

/**
 * Mock import.meta.env for Vite environment variables
 */
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000',
      VITE_TOKEN_STORAGE_KEY: 'access_token',
      VITE_REFRESH_TOKEN_KEY: 'refresh_token',
      VITE_USER_STORAGE_KEY: 'user',
      VITE_GOOGLE_CLIENT_ID: 'mock-google-client-id',
      MODE: 'test',
      DEV: false,
      PROD: false,
      SSR: false,
    },
  },
})

// ============================================
// CONSOLE SUPPRESSION (Optional)
// ============================================

/**
 * Suppress specific console warnings during tests
 * Uncomment if needed to reduce noise in test output
 */
// const originalWarn = console.warn
// console.warn = (...args: unknown[]) => {
//   const message = args[0]
//   if (
//     typeof message === 'string' &&
//     message.includes('Warning: ReactDOM.render')
//   ) {
//     return
//   }
//   originalWarn.apply(console, args)
// }

// ============================================
// GLOBAL TEST UTILITIES
// ============================================

/**
 * Clear all mocks between tests
 */
afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

/**
 * Export utilities for use in tests
 */
export { server }
