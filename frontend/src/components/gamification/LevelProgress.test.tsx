/**
 * LevelProgress Component Tests
 *
 * Tests for the level and XP progress display component covering:
 * - XP bar rendering
 * - Level display
 * - Progress percentage calculation
 * - Animation triggers
 * - Compact vs expanded views
 * - Near level-up states
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '../../test/utils/render'
import { LevelProgress } from './LevelProgress'
import * as gamificationStore from '../../stores/gamificationStore'

// Mock the gamification store
vi.mock('../../stores/gamificationStore', () => ({
  useGamificationStore: vi.fn(),
}))

// Mock the utility functions
vi.mock('../../utils/levelSystem', () => ({
  getLevelTitle: vi.fn((level: number) => {
    const titles: Record<number, string> = {
      1: 'Newcomer',
      5: 'Apprentice',
      10: 'Learner',
      25: 'Practitioner',
    }
    // Find the highest milestone at or below current level
    const milestones = Object.keys(titles).map(Number).sort((a, b) => b - a)
    for (const milestone of milestones) {
      if (level >= milestone) {
        return titles[milestone]
      }
    }
    return 'Newcomer'
  }),
  formatLevel: vi.fn((level: number) => `Level ${level} - Learner`),
}))

vi.mock('../../utils/xpCalculator', () => ({
  formatXP: vi.fn((xp: number) => {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`
    return xp.toString()
  }),
}))

const mockStoreState = {
  level: 5,
  currentXP: 150,
  xpToNextLevel: 100,
  totalXP: 500,
  progressPercent: 60,
}

describe('LevelProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Setup default mock implementation using individual selectors
    const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
    mockUseGamificationStore.mockImplementation((selector: (state: typeof mockStoreState) => unknown) => {
      if (typeof selector === 'function') {
        return selector(mockStoreState)
      }
      return mockStoreState
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('XP bar rendering', () => {
    it('renders XP progress bar in expanded view', () => {
      render(<LevelProgress showDetails={true} />)

      // Should show XP values
      expect(screen.getByText(/150/)).toBeInTheDocument()
    })

    it('displays current XP out of total for level', () => {
      render(<LevelProgress showDetails={true} />)

      // The format should be "currentXP / (currentXP + xpToNextLevel) XP"
      expect(screen.getByText(/150 \/ 250 XP/)).toBeInTheDocument()
    })

    it('renders progress bar with correct width', () => {
      const { container } = render(<LevelProgress showDetails={true} />)

      // Find the progress bar fill element
      const progressFill = container.querySelector('[style*="width: 60%"]')
      expect(progressFill).toBeInTheDocument()
    })
  })

  describe('Level display', () => {
    it('displays current level number', () => {
      render(<LevelProgress showDetails={false} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('shows level title in expanded view', () => {
      render(<LevelProgress showDetails={true} />)

      // Should show the level title from getLevelTitle
      expect(screen.getByText('Apprentice')).toBeInTheDocument()
    })

    it('shows total XP in expanded view', () => {
      render(<LevelProgress showDetails={true} />)

      expect(screen.getByText(/Total: 500 XP/)).toBeInTheDocument()
    })
  })

  describe('Progress percentage calculation', () => {
    it('displays progress percentage in expanded view', () => {
      render(<LevelProgress showDetails={true} />)

      expect(screen.getByText('60%')).toBeInTheDocument()
    })

    it('shows correct progress in title for compact view', () => {
      render(<LevelProgress showDetails={false} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', expect.stringContaining('60%'))
    })
  })

  describe('Animation triggers', () => {
    it('shows pulsing animation when near level up (>= 90%)', () => {
      const nearLevelUpState = { ...mockStoreState, progressPercent: 95 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof nearLevelUpState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(nearLevelUpState)
        }
        return nearLevelUpState
      })

      const { container } = render(<LevelProgress showDetails={false} />)

      // Wait for useEffect to trigger
      act(() => {
        vi.advanceTimersByTime(100)
      })

      const button = container.querySelector('button')
      expect(button?.className).toContain('animate-pulse')
    })

    it('shows "Almost there!" indicator when near level up', () => {
      const nearLevelUpState = { ...mockStoreState, progressPercent: 92 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof nearLevelUpState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(nearLevelUpState)
        }
        return nearLevelUpState
      })

      render(<LevelProgress showDetails={true} />)

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('Almost there!')).toBeInTheDocument()
    })

    it('does not show pulse animation when below 90%', () => {
      const { container } = render(<LevelProgress showDetails={false} />)

      act(() => {
        vi.advanceTimersByTime(100)
      })

      const button = container.querySelector('button')
      // At 60% progress, should not have pulse animation
      expect(button?.className).not.toContain('animate-pulse')
    })

    it('shows ping animation indicator when near level up', () => {
      const nearLevelUpState = { ...mockStoreState, progressPercent: 95 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof nearLevelUpState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(nearLevelUpState)
        }
        return nearLevelUpState
      })

      const { container } = render(<LevelProgress showDetails={false} />)

      act(() => {
        vi.advanceTimersByTime(100)
      })

      const pingIndicator = container.querySelector('.animate-ping')
      expect(pingIndicator).toBeInTheDocument()
    })
  })

  describe('Compact view (showDetails=false)', () => {
    it('renders compact button view by default', () => {
      render(<LevelProgress />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('shows level number in compact view', () => {
      render(<LevelProgress showDetails={false} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('applies correct size class based on size prop', () => {
      const { container, rerender } = render(<LevelProgress size="sm" />)
      expect(container.querySelector('.w-8')).toBeInTheDocument()

      rerender(<LevelProgress size="md" />)
      expect(container.querySelector('.w-10')).toBeInTheDocument()

      rerender(<LevelProgress size="lg" />)
      expect(container.querySelector('.w-16')).toBeInTheDocument()
    })

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      render(<LevelProgress onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders SVG progress ring', () => {
      const { container } = render(<LevelProgress showDetails={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Expanded view (showDetails=true)', () => {
    it('renders expanded card view when showDetails is true', () => {
      const { container } = render(<LevelProgress showDetails={true} />)

      const card = container.querySelector('.rounded-xl')
      expect(card).toBeInTheDocument()
    })

    it('shows Star icon in expanded view', () => {
      const { container } = render(<LevelProgress showDetails={true} />)

      // Star icon should be present in expanded view
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('displays linear progress bar in expanded view', () => {
      const { container } = render(<LevelProgress showDetails={true} />)

      // Should have the horizontal progress bar
      const progressBar = container.querySelector('.h-2.bg-gray-200')
      expect(progressBar).toBeInTheDocument()
    })

    it('shows ChevronRight when onClick is provided', () => {
      const { container } = render(<LevelProgress showDetails={true} onClick={() => {}} />)

      // ChevronRight icon should be visible
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('applies cursor-pointer when clickable', () => {
      const { container } = render(<LevelProgress showDetails={true} onClick={() => {}} />)

      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Progress ring colors', () => {
    it('shows gold color when near level up', () => {
      const nearLevelUpState = { ...mockStoreState, progressPercent: 95 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof nearLevelUpState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(nearLevelUpState)
        }
        return nearLevelUpState
      })

      const { container } = render(<LevelProgress showDetails={false} />)

      act(() => {
        vi.advanceTimersByTime(100)
      })

      // Find the progress circle stroke color
      const circles = container.querySelectorAll('circle')
      const progressCircle = Array.from(circles).find(
        (c) => c.getAttribute('stroke') === '#FFD700'
      )
      expect(progressCircle).toBeInTheDocument()
    })

    it('shows green color when not near level up', () => {
      const { container } = render(<LevelProgress showDetails={false} />)

      const circles = container.querySelectorAll('circle')
      const progressCircle = Array.from(circles).find(
        (c) => c.getAttribute('stroke') === '#4CAF73'
      )
      expect(progressCircle).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles level 1 correctly', () => {
      const level1State = { ...mockStoreState, level: 1, progressPercent: 0 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof level1State) => unknown) => {
        if (typeof selector === 'function') {
          return selector(level1State)
        }
        return level1State
      })

      render(<LevelProgress showDetails={false} />)

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('handles 100% progress correctly', () => {
      const maxProgressState = { ...mockStoreState, progressPercent: 100 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof maxProgressState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(maxProgressState)
        }
        return maxProgressState
      })

      render(<LevelProgress showDetails={true} />)

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('handles 0% progress correctly', () => {
      const zeroProgressState = { ...mockStoreState, progressPercent: 0, currentXP: 0 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof zeroProgressState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(zeroProgressState)
        }
        return zeroProgressState
      })

      render(<LevelProgress showDetails={true} />)

      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('handles high level numbers correctly', () => {
      const highLevelState = { ...mockStoreState, level: 99, totalXP: 50000 }
      const mockUseGamificationStore = gamificationStore.useGamificationStore as unknown as ReturnType<typeof vi.fn>
      mockUseGamificationStore.mockImplementation((selector: (state: typeof highLevelState) => unknown) => {
        if (typeof selector === 'function') {
          return selector(highLevelState)
        }
        return highLevelState
      })

      render(<LevelProgress showDetails={false} />)

      expect(screen.getByText('99')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible title in compact view', () => {
      render(<LevelProgress showDetails={false} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title')
    })

    it('is keyboard navigable when clickable', () => {
      const handleClick = vi.fn()
      render(<LevelProgress onClick={handleClick} />)

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Responsive behavior', () => {
    it('applies hover scale transformation', () => {
      const { container } = render(<LevelProgress showDetails={false} />)

      const button = container.querySelector('button')
      expect(button?.className).toContain('hover:scale-105')
    })

    it('applies transition for smooth animations', () => {
      const { container } = render(<LevelProgress showDetails={false} />)

      const button = container.querySelector('button')
      expect(button?.className).toContain('transition')
    })
  })
})
