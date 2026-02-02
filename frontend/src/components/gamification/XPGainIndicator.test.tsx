/**
 * XPGainIndicator Component Tests
 *
 * Tests for the floating XP gain animation component covering:
 * - XP amount display
 * - Animation class application
 * - Position handling
 * - onComplete callback timing
 * - Container component rendering
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '../../test/utils/render'
import { XPGainIndicator, XPGainIndicatorContainer } from './XPGainIndicator'

// Mock the formatXP utility
vi.mock('../../utils/xpCalculator', () => ({
  formatXP: vi.fn((xp: number) => {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`
    return xp.toString()
  }),
}))

describe('XPGainIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('XP amount display', () => {
    it('displays the XP amount', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('displays + prefix for XP amount', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={100}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(screen.getByText('+')).toBeInTheDocument()
    })

    it('displays XP suffix', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={25}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(screen.getByText('XP')).toBeInTheDocument()
    })

    it('formats large XP amounts correctly', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={1500}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(screen.getByText('1.5K')).toBeInTheDocument()
    })

    it('displays small amounts as-is', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={5}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('Animation class application', () => {
    it('applies initial opacity class', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toBeInTheDocument()
      // Initially should have opacity-100
      expect(indicator?.className).toContain('opacity-100')
    })

    it('applies animation classes after mount', async () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      // requestAnimationFrame is mocked to use setTimeout(callback, 0)
      // Advance timers to trigger the animation state change
      await act(async () => {
        vi.advanceTimersByTime(16) // One frame (~16ms)
      })

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      // After animation starts, should have opacity-0 and translate-y
      expect(indicator?.className).toContain('opacity-0')
      expect(indicator?.className).toContain('-translate-y-[50px]')
    })

    it('has fixed position class', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('fixed')
    })

    it('has pointer-events-none class', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('pointer-events-none')
    })

    it('applies transition duration class', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('duration-[1500ms]')
    })

    it('applies ease-out timing function', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('ease-out')
    })
  })

  describe('Position handling', () => {
    it('applies correct left position', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 150, y: 200 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ left: '150px' })
    })

    it('applies correct top position', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 150, y: 200 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ top: '200px' })
    })

    it('handles position at origin (0, 0)', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 0, y: 0 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ left: '0px', top: '0px' })
    })

    it('handles large position values', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 1920, y: 1080 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ left: '1920px', top: '1080px' })
    })
  })

  describe('onComplete callback timing', () => {
    it('calls onComplete after 1500ms', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      expect(onComplete).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('does not call onComplete before 1500ms', () => {
      const onComplete = vi.fn()
      render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(onComplete).not.toHaveBeenCalled()
    })

    it('cleans up timeout on unmount', () => {
      const onComplete = vi.fn()
      const { unmount } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      unmount()

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // onComplete should not be called after unmount
      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('applies gold color for text', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ color: '#FFD700' })
    })

    it('applies text shadow style', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator).toHaveStyle({ textShadow: expect.stringContaining('rgba') })
    })

    it('has high z-index for visibility', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('z-[200]')
    })

    it('has bold font weight', () => {
      const onComplete = vi.fn()
      const { container } = render(
        <XPGainIndicator
          id="test-1"
          amount={50}
          position={{ x: 100, y: 100 }}
          onComplete={onComplete}
        />
      )

      const indicator = container.querySelector('[data-xp-indicator="test-1"]')
      expect(indicator?.className).toContain('font-bold')
    })
  })
})

describe('XPGainIndicatorContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering multiple indicators', () => {
    it('renders all provided indicators', () => {
      const onRemove = vi.fn()
      const indicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'xp-2', amount: 25, position: { x: 200, y: 200 } },
        { id: 'xp-3', amount: 100, position: { x: 300, y: 300 } },
      ]

      const { container } = render(
        <XPGainIndicatorContainer indicators={indicators} onRemove={onRemove} />
      )

      expect(container.querySelector('[data-xp-indicator="xp-1"]')).toBeInTheDocument()
      expect(container.querySelector('[data-xp-indicator="xp-2"]')).toBeInTheDocument()
      expect(container.querySelector('[data-xp-indicator="xp-3"]')).toBeInTheDocument()
    })

    it('displays correct amounts for each indicator', () => {
      const onRemove = vi.fn()
      const indicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'xp-2', amount: 75, position: { x: 200, y: 200 } },
      ]

      render(
        <XPGainIndicatorContainer indicators={indicators} onRemove={onRemove} />
      )

      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('handles empty indicators array', () => {
      const onRemove = vi.fn()
      const { container } = render(
        <XPGainIndicatorContainer indicators={[]} onRemove={onRemove} />
      )

      // Should render nothing
      expect(container.firstChild).toBeNull()
    })
  })

  describe('onRemove callback', () => {
    it('calls onRemove with correct id when indicator completes', () => {
      const onRemove = vi.fn()
      const indicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
      ]

      render(
        <XPGainIndicatorContainer indicators={indicators} onRemove={onRemove} />
      )

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(onRemove).toHaveBeenCalledWith('xp-1')
    })

    it('calls onRemove for each indicator that completes', () => {
      const onRemove = vi.fn()
      const indicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'xp-2', amount: 25, position: { x: 200, y: 200 } },
      ]

      render(
        <XPGainIndicatorContainer indicators={indicators} onRemove={onRemove} />
      )

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(onRemove).toHaveBeenCalledTimes(2)
      expect(onRemove).toHaveBeenCalledWith('xp-1')
      expect(onRemove).toHaveBeenCalledWith('xp-2')
    })
  })

  describe('Key prop handling', () => {
    it('uses unique keys for each indicator', () => {
      const onRemove = vi.fn()
      const indicators = [
        { id: 'unique-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'unique-2', amount: 25, position: { x: 200, y: 200 } },
      ]

      const { container } = render(
        <XPGainIndicatorContainer indicators={indicators} onRemove={onRemove} />
      )

      // Each indicator should have its data-xp-indicator attribute
      expect(container.querySelector('[data-xp-indicator="unique-1"]')).toBeInTheDocument()
      expect(container.querySelector('[data-xp-indicator="unique-2"]')).toBeInTheDocument()
    })
  })

  describe('Dynamic updates', () => {
    it('renders new indicators when added', () => {
      const onRemove = vi.fn()
      const initialIndicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
      ]

      const { rerender, container } = render(
        <XPGainIndicatorContainer indicators={initialIndicators} onRemove={onRemove} />
      )

      expect(container.querySelector('[data-xp-indicator="xp-1"]')).toBeInTheDocument()
      expect(container.querySelector('[data-xp-indicator="xp-2"]')).not.toBeInTheDocument()

      const updatedIndicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'xp-2', amount: 25, position: { x: 200, y: 200 } },
      ]

      rerender(
        <XPGainIndicatorContainer indicators={updatedIndicators} onRemove={onRemove} />
      )

      expect(container.querySelector('[data-xp-indicator="xp-1"]')).toBeInTheDocument()
      expect(container.querySelector('[data-xp-indicator="xp-2"]')).toBeInTheDocument()
    })

    it('removes indicators when filtered out', () => {
      const onRemove = vi.fn()
      const initialIndicators = [
        { id: 'xp-1', amount: 50, position: { x: 100, y: 100 } },
        { id: 'xp-2', amount: 25, position: { x: 200, y: 200 } },
      ]

      const { rerender, container } = render(
        <XPGainIndicatorContainer indicators={initialIndicators} onRemove={onRemove} />
      )

      expect(container.querySelectorAll('[data-xp-indicator]')).toHaveLength(2)

      const filteredIndicators = [
        { id: 'xp-2', amount: 25, position: { x: 200, y: 200 } },
      ]

      rerender(
        <XPGainIndicatorContainer indicators={filteredIndicators} onRemove={onRemove} />
      )

      expect(container.querySelectorAll('[data-xp-indicator]')).toHaveLength(1)
      expect(container.querySelector('[data-xp-indicator="xp-2"]')).toBeInTheDocument()
    })
  })
})
