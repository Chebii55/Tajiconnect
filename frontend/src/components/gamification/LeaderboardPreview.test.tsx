/**
 * LeaderboardPreview Component Tests
 *
 * Tests for the leaderboard preview widget covering:
 * - User ranking display
 * - Leaderboard list rendering
 * - Empty state
 * - Loading state
 * - Personal mode (opted out) state
 * - Zone indicators
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '../../test/utils/render'
import { LeaderboardPreview } from './LeaderboardPreview'
import * as useLeaderboardModule from '../../hooks/useLeaderboard'

// Mock the useLeaderboard hook
vi.mock('../../hooks/useLeaderboard', () => ({
  useLeaderboard: vi.fn(),
}))

// Mock LeagueBadge components
vi.mock('./LeagueBadge', () => ({
  LeagueBadge: ({ league, size, showLabel }: { league: string; size?: string; showLabel?: boolean }) => (
    <div data-testid="league-badge" data-league={league} data-size={size} data-show-label={showLabel}>
      League: {league}
    </div>
  ),
  LeagueBadgeInline: ({ league }: { league: string }) => (
    <span data-testid="league-badge-inline">{league}</span>
  ),
  PersonalModeBadge: ({ size }: { size?: string }) => (
    <div data-testid="personal-mode-badge" data-size={size}>Personal Mode</div>
  ),
}))

const mockLeaderboardData = {
  league: 'bronze' as const,
  entries: [
    { rank: 1, userId: 'user-1', username: 'Alex K.', weeklyXP: 1000, league: 'bronze' as const, trend: 'up' as const, trendAmount: 2, isCurrentUser: false },
    { rank: 2, userId: 'user-2', username: 'Maria S.', weeklyXP: 950, league: 'bronze' as const, trend: 'same' as const, isCurrentUser: false },
    { rank: 3, userId: 'user-3', username: 'James L.', weeklyXP: 900, league: 'bronze' as const, trend: 'down' as const, trendAmount: 1, isCurrentUser: false },
    { rank: 4, userId: 'user-4', username: 'Sarah M.', weeklyXP: 850, league: 'bronze' as const, trend: 'up' as const, trendAmount: 3, isCurrentUser: false },
    { rank: 5, userId: 'current-user', username: 'You', weeklyXP: 800, league: 'bronze' as const, trend: 'up' as const, trendAmount: 1, isCurrentUser: true },
  ],
  userRank: 5,
  totalInLeague: 25,
  promotionZone: true,
  demotionZone: false,
  timeUntilReset: 259200,
  weekStartDate: new Date().toISOString(),
  weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
}

const mockUserStatus = {
  userId: 'current-user',
  league: 'bronze' as const,
  isOptedIn: true,
  weeklyXP: 800,
  currentRank: 5,
  promotionStreak: 0,
}

const createMockUseLeaderboard = (overrides = {}) => ({
  leaderboard: mockLeaderboardData,
  userStatus: mockUserStatus,
  isLoading: false,
  error: null,
  isOptedIn: true,
  fetchLeaderboard: vi.fn(),
  fetchUserStatus: vi.fn(),
  toggleOptOut: vi.fn(),
  fetchHistory: vi.fn().mockResolvedValue([]),
  refresh: vi.fn().mockResolvedValue(undefined),
  getUserContext: vi.fn((range = 2) => {
    const userIndex = mockLeaderboardData.entries.findIndex(e => e.isCurrentUser)
    const start = Math.max(0, userIndex - range)
    const end = Math.min(mockLeaderboardData.entries.length, userIndex + range + 1)
    return mockLeaderboardData.entries.slice(start, end)
  }),
  formatTimeUntilReset: vi.fn().mockReturnValue('3d 0h'),
  ...overrides,
})

describe('LeaderboardPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
    mockHook.mockReturnValue(createMockUseLeaderboard())
  })

  describe('User ranking display', () => {
    it('displays user rank', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('#5')).toBeInTheDocument()
    })

    it('displays total users in league', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText(/of 25 in/)).toBeInTheDocument()
    })

    it('displays user weekly XP', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText(/800.*XP this week/i)).toBeInTheDocument()
    })

    it('displays league badge', () => {
      render(<LeaderboardPreview userId="current-user" />)

      const badges = screen.getAllByTestId('league-badge')
      expect(badges.length).toBeGreaterThan(0)
      expect(badges[0]).toHaveAttribute('data-league', 'bronze')
    })

    it('shows time until reset', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText(/Resets in 3d 0h/)).toBeInTheDocument()
    })
  })

  describe('Leaderboard list rendering', () => {
    it('renders nearby competitors section', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('Nearby Competitors')).toBeInTheDocument()
    })

    it('displays competitor entries', () => {
      render(<LeaderboardPreview userId="current-user" />)

      // Should show nearby competitors around current user
      expect(screen.getByText('James L.')).toBeInTheDocument()
      expect(screen.getByText('Sarah M.')).toBeInTheDocument()
    })

    it('highlights current user entry', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Current user entry should have special styling
      const userEntry = container.querySelector('[class*="bg-primary"]')
      expect(userEntry).toBeInTheDocument()
    })

    it('displays "You" for current user', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('You')).toBeInTheDocument()
    })

    it('shows XP for each competitor', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText(/900.*XP/)).toBeInTheDocument()
      expect(screen.getByText(/850.*XP/)).toBeInTheDocument()
    })

    it('shows trend indicators', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should have trend icons (TrendingUp, TrendingDown, Minus)
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('XP to next rank', () => {
    it('displays XP needed to overtake next rank', () => {
      const mockWithXPToNext = createMockUseLeaderboard()
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(mockWithXPToNext)

      render(<LeaderboardPreview userId="current-user" />)

      // Should show XP needed to overtake rank #4 (850 - 800 + 1 = 51)
      expect(screen.getByText(/51.*XP/)).toBeInTheDocument()
      expect(screen.getByText(/to overtake #4/)).toBeInTheDocument()
    })

    it('does not show XP to next rank when user is #1', () => {
      const rank1Data = {
        ...mockLeaderboardData,
        userRank: 1,
        entries: [
          { rank: 1, userId: 'current-user', username: 'You', weeklyXP: 1000, league: 'bronze' as const, trend: 'up' as const, trendAmount: 2, isCurrentUser: true },
          ...mockLeaderboardData.entries.slice(1),
        ],
      }
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({ leaderboard: rank1Data }))

      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.queryByText(/to overtake/)).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('renders nothing when leaderboard is null', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        leaderboard: null,
        isLoading: false,
      }))

      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should not render the main content
      expect(container.querySelector('.rounded-xl')).toBeNull()
    })

    it('handles empty entries array gracefully', () => {
      const emptyData = { ...mockLeaderboardData, entries: [] }
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        leaderboard: emptyData,
        getUserContext: vi.fn().mockReturnValue([]),
      }))

      render(<LeaderboardPreview userId="current-user" />)

      // Should still render the component but with no competitors
      expect(screen.getByText('Weekly Leaderboard')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows loading skeleton when loading', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        isLoading: true,
        leaderboard: null,
      }))

      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should show skeleton loading elements
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('does not show loading when data exists', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        isLoading: true,
        leaderboard: mockLeaderboardData,
      }))

      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should show actual content, not loading state
      expect(screen.getByText('Weekly Leaderboard')).toBeInTheDocument()
    })
  })

  describe('Personal mode (opted out)', () => {
    it('shows personal mode view when not opted in', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        isOptedIn: false,
      }))

      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByTestId('personal-mode-badge')).toBeInTheDocument()
      expect(screen.getByText('Personal Mode Active')).toBeInTheDocument()
    })

    it('shows message about not competing', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        isOptedIn: false,
      }))

      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText(/not competing on leaderboards/i)).toBeInTheDocument()
    })

    it('shows link to update preferences', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        isOptedIn: false,
      }))

      render(<LeaderboardPreview userId="current-user" />)

      const link = screen.getByText('Update Preferences')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/student/settings')
    })
  })

  describe('Compact mode', () => {
    it('renders compact view when compact prop is true', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" compact={true} />)

      // Compact view should be a link
      const link = container.querySelector('a[href="/student/leaderboard"]')
      expect(link).toBeInTheDocument()
    })

    it('shows rank and total in compact mode', () => {
      render(<LeaderboardPreview userId="current-user" compact={true} />)

      expect(screen.getByText('#5')).toBeInTheDocument()
      expect(screen.getByText(/of 25/)).toBeInTheDocument()
    })

    it('shows league badge in compact mode', () => {
      render(<LeaderboardPreview userId="current-user" compact={true} />)

      expect(screen.getByTestId('league-badge')).toBeInTheDocument()
    })

    it('shows ChevronRight icon in compact mode', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" compact={true} />)

      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('calls onViewFull when clicked in compact mode', () => {
      const onViewFull = vi.fn()
      render(<LeaderboardPreview userId="current-user" compact={true} onViewFull={onViewFull} />)

      const link = screen.getByRole('link')
      fireEvent.click(link)

      expect(onViewFull).toHaveBeenCalledTimes(1)
    })
  })

  describe('Zone indicators', () => {
    it('shows promotion zone indicator when in promotion zone', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('Promotion Zone')).toBeInTheDocument()
    })

    it('shows demotion zone indicator when in demotion zone', () => {
      const demotionData = {
        ...mockLeaderboardData,
        promotionZone: false,
        demotionZone: true,
      }
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({ leaderboard: demotionData }))

      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('Demotion Zone')).toBeInTheDocument()
    })

    it('does not show zone indicator when not in any zone', () => {
      const noZoneData = {
        ...mockLeaderboardData,
        promotionZone: false,
        demotionZone: false,
      }
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({ leaderboard: noZoneData }))

      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.queryByText('Promotion Zone')).not.toBeInTheDocument()
      expect(screen.queryByText('Demotion Zone')).not.toBeInTheDocument()
    })
  })

  describe('View full leaderboard link', () => {
    it('shows link to full leaderboard', () => {
      render(<LeaderboardPreview userId="current-user" />)

      const link = screen.getByText('View Full Leaderboard')
      expect(link).toBeInTheDocument()
    })

    it('link navigates to leaderboard page', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" />)

      const link = container.querySelector('a[href="/student/leaderboard"]')
      expect(link).toBeInTheDocument()
    })

    it('calls onViewFull when provided', () => {
      const onViewFull = vi.fn()
      render(<LeaderboardPreview userId="current-user" onViewFull={onViewFull} />)

      const link = screen.getByText('View Full Leaderboard')
      fireEvent.click(link)

      expect(onViewFull).toHaveBeenCalledTimes(1)
    })
  })

  describe('Trend display', () => {
    it('shows up trend with amount', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should show green trend indicator
      const greenTrend = container.querySelector('.text-green-500')
      expect(greenTrend).toBeInTheDocument()
    })

    it('shows down trend with amount', () => {
      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should show red trend indicator for James L. who is down 1
      const redTrend = container.querySelector('.text-red-500')
      expect(redTrend).toBeInTheDocument()
    })

    it('shows neutral trend for same position', () => {
      // Create mock data with a 'same' trend user in the nearby context
      const dataWithSameTrend = {
        ...mockLeaderboardData,
        entries: [
          ...mockLeaderboardData.entries.slice(0, 3),
          { rank: 4, userId: 'user-same', username: 'Neutral N.', weeklyXP: 850, league: 'bronze' as const, trend: 'same' as const, isCurrentUser: false },
          mockLeaderboardData.entries[4], // current user at rank 5
        ],
      }
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      mockHook.mockReturnValue(createMockUseLeaderboard({
        leaderboard: dataWithSameTrend,
        getUserContext: vi.fn((range = 2) => {
          // Return entries around current user including the 'same' trend user
          return [
            dataWithSameTrend.entries[2], // James L. at rank 3
            { rank: 4, userId: 'user-same', username: 'Neutral N.', weeklyXP: 850, league: 'bronze' as const, trend: 'same' as const, isCurrentUser: false },
            dataWithSameTrend.entries[4], // current user at rank 5
          ]
        }),
      }))

      const { container } = render(<LeaderboardPreview userId="current-user" />)

      // Should have Minus icon for user with 'same' trend
      const grayTrend = container.querySelector('.text-gray-400')
      expect(grayTrend).toBeInTheDocument()
    })
  })

  describe('Props handling', () => {
    it('passes userId to useLeaderboard hook', () => {
      const mockHook = useLeaderboardModule.useLeaderboard as ReturnType<typeof vi.fn>
      render(<LeaderboardPreview userId="test-user-123" />)

      expect(mockHook).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'test-user-123',
      }))
    })

    it('applies custom className', () => {
      const { container } = render(
        <LeaderboardPreview userId="current-user" className="custom-class" />
      )

      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible links', () => {
      render(<LeaderboardPreview userId="current-user" />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })

    it('has proper heading structure', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('Weekly Leaderboard')).toBeInTheDocument()
    })

    it('competitor names are readable', () => {
      render(<LeaderboardPreview userId="current-user" />)

      expect(screen.getByText('James L.')).toBeInTheDocument()
      expect(screen.getByText('Sarah M.')).toBeInTheDocument()
      expect(screen.getByText('You')).toBeInTheDocument()
    })
  })
})
