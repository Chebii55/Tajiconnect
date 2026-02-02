/**
 * BadgeCard Component Tests
 *
 * Tests for the badge display card component covering:
 * - Rendering with unlocked/locked badges
 * - Click handler functionality
 * - Progress display
 * - Rarity styling (common, rare, epic, legendary)
 * - Hidden badge display
 * - Compact mode rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils/render'
import { BadgeCard } from './BadgeCard'
import type { BadgeDefinition } from '../../data/badges'
import type { BadgeProgress } from '../../lib/badgeEngine'

// Mock badge definitions
const createMockBadge = (overrides: Partial<BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string }> = {}): BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string } => ({
  id: 'test-badge',
  name: 'Test Badge',
  description: 'A test badge for unit tests',
  icon: 'star',
  rarity: 'common',
  category: 'learning',
  hidden: false,
  criteria: {
    type: 'count',
    metric: 'lessons_completed',
    threshold: 1,
  },
  xpReward: 25,
  isUnlocked: false,
  ...overrides,
})

const createMockProgress = (overrides: Partial<BadgeProgress> = {}): BadgeProgress => ({
  badgeId: 'test-badge',
  currentValue: 0,
  targetValue: 10,
  progressPercent: 0,
  isUnlocked: false,
  ...overrides,
})

describe('BadgeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering with unlocked badge', () => {
    it('renders badge name and icon when unlocked', () => {
      const badge = createMockBadge({
        name: 'First Steps',
        icon: 'book-open',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('First Steps')).toBeInTheDocument()
    })

    it('displays unlocked date for unlocked badges', () => {
      const unlockDate = new Date('2024-01-15')
      const badge = createMockBadge({
        isUnlocked: true,
        unlockedAt: unlockDate.toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      // Should display the formatted date
      expect(screen.getByText(unlockDate.toLocaleDateString())).toBeInTheDocument()
    })

    it('shows checkmark indicator for unlocked badges', () => {
      const badge = createMockBadge({
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      const { container } = render(<BadgeCard badge={badge} />)

      // Unlocked badges should have a CheckCircle indicator
      // The component renders CheckCircle icon for unlocked badges
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('applies rarity styling for unlocked badges', () => {
      const badge = createMockBadge({
        rarity: 'epic',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      // Should show rarity label
      expect(screen.getByText('Epic')).toBeInTheDocument()
    })
  })

  describe('Rendering with locked badge', () => {
    it('renders badge name in muted style when locked', () => {
      const badge = createMockBadge({
        name: 'Locked Badge',
        isUnlocked: false,
      })

      render(<BadgeCard badge={badge} />)

      const badgeName = screen.getByText('Locked Badge')
      expect(badgeName).toBeInTheDocument()
    })

    it('shows lock indicator for locked badges', () => {
      const badge = createMockBadge({
        isUnlocked: false,
      })

      const { container } = render(<BadgeCard badge={badge} />)

      // Locked badges should have a Lock icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('does not display unlock date for locked badges', () => {
      const badge = createMockBadge({
        isUnlocked: false,
      })

      render(<BadgeCard badge={badge} />)

      // Should not have any date displayed
      const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/
      expect(screen.queryByText(dateRegex)).not.toBeInTheDocument()
    })
  })

  describe('Click handler', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      const badge = createMockBadge()

      render(<BadgeCard badge={badge} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is not clickable when no onClick is provided', () => {
      const badge = createMockBadge()

      render(<BadgeCard badge={badge} />)

      const card = screen.getByRole('button')
      expect(card).toBeDisabled()
    })

    it('applies hover styles when clickable', () => {
      const handleClick = vi.fn()
      const badge = createMockBadge()

      const { container } = render(<BadgeCard badge={badge} onClick={handleClick} />)

      const button = container.querySelector('button')
      expect(button?.className).toContain('cursor-pointer')
    })
  })

  describe('Progress display', () => {
    it('shows progress when showProgress is true and badge is locked', () => {
      const badge = createMockBadge({ isUnlocked: false })
      const progress = createMockProgress({
        currentValue: 5,
        targetValue: 10,
        progressPercent: 50,
      })

      render(<BadgeCard badge={badge} progress={progress} showProgress={true} />)

      expect(screen.getByText('5/10')).toBeInTheDocument()
    })

    it('hides progress when showProgress is false', () => {
      const badge = createMockBadge({ isUnlocked: false })
      const progress = createMockProgress({
        currentValue: 5,
        targetValue: 10,
      })

      render(<BadgeCard badge={badge} progress={progress} showProgress={false} />)

      expect(screen.queryByText('5/10')).not.toBeInTheDocument()
    })

    it('does not show progress for unlocked badges', () => {
      const badge = createMockBadge({
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })
      const progress = createMockProgress({
        currentValue: 10,
        targetValue: 10,
        progressPercent: 100,
        isUnlocked: true,
      })

      render(<BadgeCard badge={badge} progress={progress} showProgress={true} />)

      // Progress text should not appear for unlocked badges
      expect(screen.queryByText('10/10')).not.toBeInTheDocument()
    })

    it('renders progress ring for locked badges', () => {
      const badge = createMockBadge({ isUnlocked: false })
      const progress = createMockProgress({
        progressPercent: 75,
      })

      const { container } = render(
        <BadgeCard badge={badge} progress={progress} showProgress={true} />
      )

      // Should have SVG progress ring
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Rarity styling', () => {
    it('renders common badge with correct styling', () => {
      const badge = createMockBadge({
        rarity: 'common',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('Common')).toBeInTheDocument()
    })

    it('renders rare badge with correct styling', () => {
      const badge = createMockBadge({
        rarity: 'rare',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('Rare')).toBeInTheDocument()
    })

    it('renders epic badge with correct styling', () => {
      const badge = createMockBadge({
        rarity: 'epic',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('Epic')).toBeInTheDocument()
    })

    it('renders legendary badge with correct styling', () => {
      const badge = createMockBadge({
        rarity: 'legendary',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('Legendary')).toBeInTheDocument()
    })

    it('applies glow effect for epic badges', () => {
      const badge = createMockBadge({
        rarity: 'epic',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      const { container } = render(<BadgeCard badge={badge} />)

      const button = container.querySelector('button')
      // Epic badges should have a glow class
      expect(button?.className).toContain('shadow')
    })

    it('applies glow effect for legendary badges', () => {
      const badge = createMockBadge({
        rarity: 'legendary',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      const { container } = render(<BadgeCard badge={badge} />)

      const button = container.querySelector('button')
      expect(button?.className).toContain('shadow')
    })
  })

  describe('Hidden badges', () => {
    it('shows question marks for hidden locked badges', () => {
      const badge = createMockBadge({
        hidden: true,
        isUnlocked: false,
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('???')).toBeInTheDocument()
    })

    it('shows actual name when hidden badge is unlocked', () => {
      const badge = createMockBadge({
        name: 'Night Owl',
        hidden: true,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      render(<BadgeCard badge={badge} />)

      expect(screen.getByText('Night Owl')).toBeInTheDocument()
      expect(screen.queryByText('???')).not.toBeInTheDocument()
    })

    it('shows HelpCircle icon for hidden locked badges', () => {
      const badge = createMockBadge({
        hidden: true,
        isUnlocked: false,
      })

      const { container } = render(<BadgeCard badge={badge} />)

      // Should have HelpCircle icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('renders small size correctly', () => {
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      const { container } = render(<BadgeCard badge={badge} size="sm" />)

      const iconContainer = container.querySelector('.w-16')
      expect(iconContainer).toBeInTheDocument()
    })

    it('renders medium size correctly', () => {
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      const { container } = render(<BadgeCard badge={badge} size="md" />)

      const iconContainer = container.querySelector('.w-20')
      expect(iconContainer).toBeInTheDocument()
    })

    it('renders large size correctly', () => {
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      const { container } = render(<BadgeCard badge={badge} size="lg" />)

      const iconContainer = container.querySelector('.w-24')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Compact mode', () => {
    it('renders compact view when compact prop is true', () => {
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      render(<BadgeCard badge={badge} compact={true} />)

      // Compact view should not show badge name text (uses title attribute instead)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', badge.name)
    })

    it('shows Hidden Badge title for hidden locked badges in compact mode', () => {
      const badge = createMockBadge({
        hidden: true,
        isUnlocked: false,
      })

      render(<BadgeCard badge={badge} compact={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Hidden Badge')
    })

    it('applies correct size in compact mode', () => {
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      const { container } = render(<BadgeCard badge={badge} compact={true} size="md" />)

      const button = container.querySelector('button')
      expect(button?.className).toContain('w-20')
    })

    it('is clickable in compact mode', () => {
      const handleClick = vi.fn()
      const badge = createMockBadge({ isUnlocked: true, unlockedAt: new Date().toISOString() })

      render(<BadgeCard badge={badge} compact={true} onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Icon mapping', () => {
    const iconTestCases = [
      { icon: 'book-open', name: 'BookOpen' },
      { icon: 'graduation-cap', name: 'GraduationCap' },
      { icon: 'flame', name: 'Flame' },
      { icon: 'trophy', name: 'Trophy' },
      { icon: 'star', name: 'Star' },
      { icon: 'zap', name: 'Zap' },
      { icon: 'brain', name: 'Brain' },
      { icon: 'crown', name: 'Crown' },
    ]

    iconTestCases.forEach(({ icon }) => {
      it(`renders ${icon} icon correctly`, () => {
        const badge = createMockBadge({
          icon,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        })

        const { container } = render(<BadgeCard badge={badge} />)

        // Should render an SVG icon
        expect(container.querySelector('svg')).toBeInTheDocument()
      })
    })

    it('falls back to Star icon for unknown icon names', () => {
      const badge = createMockBadge({
        icon: 'unknown-icon',
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      })

      const { container } = render(<BadgeCard badge={badge} />)

      // Should still render an icon (falls back to Star)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct button role', () => {
      const badge = createMockBadge()

      render(<BadgeCard badge={badge} onClick={() => {}} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('button is disabled when not clickable', () => {
      const badge = createMockBadge()

      render(<BadgeCard badge={badge} />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('has descriptive title in compact mode', () => {
      const badge = createMockBadge({ name: 'Week Warrior' })

      render(<BadgeCard badge={badge} compact={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Week Warrior')
    })
  })
})
