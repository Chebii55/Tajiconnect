/**
 * Video Store Unit Tests
 *
 * Comprehensive tests for the video store including playback state,
 * progress tracking, bookmarks, and resume functionality.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useVideoStore } from './videoStore'
import { eventBus } from '../lib/eventBus'

// Mock the eventBus
vi.mock('../lib/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(() => vi.fn()),
    off: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}))

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
})

describe('videoStore', () => {
  const initialState = {
    currentVideo: {
      videoId: null,
      currentTime: 0,
      isPlaying: false,
      volume: 1,
      playbackRate: 1,
    },
    progressMap: {},
    bookmarks: {},
  }

  beforeEach(() => {
    // Reset store to initial state
    useVideoStore.setState(initialState)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have null video ID initially', () => {
      const state = useVideoStore.getState()
      expect(state.currentVideo.videoId).toBeNull()
    })

    it('should have default playback settings', () => {
      const state = useVideoStore.getState()
      expect(state.currentVideo.currentTime).toBe(0)
      expect(state.currentVideo.isPlaying).toBe(false)
      expect(state.currentVideo.volume).toBe(1)
      expect(state.currentVideo.playbackRate).toBe(1)
    })

    it('should have empty progress map', () => {
      const state = useVideoStore.getState()
      expect(state.progressMap).toEqual({})
    })

    it('should have empty bookmarks', () => {
      const state = useVideoStore.getState()
      expect(state.bookmarks).toEqual({})
    })
  })

  describe('setCurrentVideo', () => {
    it('should set the current video ID', () => {
      const { setCurrentVideo } = useVideoStore.getState()
      setCurrentVideo('video-123')

      const state = useVideoStore.getState()
      expect(state.currentVideo.videoId).toBe('video-123')
    })

    it('should reset currentTime to 0 for new video without progress', () => {
      const { setCurrentVideo } = useVideoStore.getState()
      setCurrentVideo('new-video')

      const state = useVideoStore.getState()
      expect(state.currentVideo.currentTime).toBe(0)
    })

    it('should resume from saved progress when available', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-123': {
            videoId: 'video-123',
            currentTime: 120,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 120 }],
          },
        },
      })

      const { setCurrentVideo } = useVideoStore.getState()
      setCurrentVideo('video-123')

      const state = useVideoStore.getState()
      expect(state.currentVideo.currentTime).toBe(120)
    })

    it('should preserve volume and playback rate settings', () => {
      useVideoStore.setState({
        ...initialState,
        currentVideo: {
          ...initialState.currentVideo,
          volume: 0.5,
          playbackRate: 1.5,
        },
      })

      const { setCurrentVideo } = useVideoStore.getState()
      setCurrentVideo('new-video')

      const state = useVideoStore.getState()
      expect(state.currentVideo.volume).toBe(0.5)
      expect(state.currentVideo.playbackRate).toBe(1.5)
    })

    it('should set isPlaying to false when switching videos', () => {
      useVideoStore.setState({
        ...initialState,
        currentVideo: {
          ...initialState.currentVideo,
          videoId: 'old-video',
          isPlaying: true,
        },
      })

      const { setCurrentVideo } = useVideoStore.getState()
      setCurrentVideo('new-video')

      const state = useVideoStore.getState()
      expect(state.currentVideo.isPlaying).toBe(false)
    })
  })

  describe('updateProgress', () => {
    it('should create progress entry for new video', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 30, 300)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1']).toBeDefined()
      expect(state.progressMap['video-1'].currentTime).toBe(30)
      expect(state.progressMap['video-1'].duration).toBe(300)
    })

    it('should update existing progress', () => {
      useVideoStore.setState({
        ...initialState,
        currentVideo: {
          ...initialState.currentVideo,
          videoId: 'video-1',
        },
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 30,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-01T10:00:00Z',
            watchedRanges: [{ start: 0, end: 30 }],
          },
        },
      })

      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 60, 300)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].currentTime).toBe(60)
    })

    it('should update current video time', () => {
      useVideoStore.setState({
        ...initialState,
        currentVideo: {
          ...initialState.currentVideo,
          videoId: 'video-1',
          currentTime: 0,
        },
      })

      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 45, 300)

      const state = useVideoStore.getState()
      expect(state.currentVideo.currentTime).toBe(45)
    })

    it('should track watched ranges', () => {
      const { updateProgress } = useVideoStore.getState()

      // Watch from 0-10
      for (let t = 0; t <= 10; t++) {
        updateProgress('video-1', t, 100)
      }

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].watchedRanges.length).toBeGreaterThan(0)
    })

    it('should merge adjacent watched ranges', () => {
      const { updateProgress } = useVideoStore.getState()

      // Watch continuously
      updateProgress('video-1', 10, 100)
      updateProgress('video-1', 11, 100)
      updateProgress('video-1', 12, 100)

      const state = useVideoStore.getState()
      // Should be merged into a single range
      expect(state.progressMap['video-1'].watchedRanges.length).toBeLessThanOrEqual(3)
    })

    it('should emit video:progress event', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 50, 100)

      expect(eventBus.emit).toHaveBeenCalledWith('video:progress', expect.objectContaining({
        videoId: 'video-1',
        currentTime: 50,
        duration: 100,
      }))
    })

    it('should update lastWatched timestamp', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 30, 300)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].lastWatched).toBeDefined()
      // Should be a valid ISO date string
      expect(() => new Date(state.progressMap['video-1'].lastWatched)).not.toThrow()
    })

    it('should preserve completed status', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 300,
            duration: 300,
            completed: true,
            lastWatched: '2026-02-01T10:00:00Z',
            watchedRanges: [{ start: 0, end: 300 }],
          },
        },
      })

      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 50, 300) // Re-watching

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].completed).toBe(true)
    })
  })

  describe('markCompleted', () => {
    it('should mark video as completed', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 295,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 295 }],
          },
        },
      })

      const { markCompleted } = useVideoStore.getState()
      markCompleted('video-1')

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].completed).toBe(true)
    })

    it('should emit video:completed event', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 295,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 295 }],
          },
        },
      })

      const { markCompleted } = useVideoStore.getState()
      markCompleted('video-1')

      expect(eventBus.emit).toHaveBeenCalledWith('video:completed', expect.objectContaining({
        videoId: 'video-1',
        duration: 300,
      }))
    })

    it('should not throw if video progress does not exist', () => {
      const { markCompleted } = useVideoStore.getState()

      // Should not throw
      expect(() => markCompleted('non-existent-video')).not.toThrow()
    })

    it('should include watched percentage in completed event', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 300,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 250 }], // 83% watched
          },
        },
      })

      const { markCompleted } = useVideoStore.getState()
      markCompleted('video-1')

      expect(eventBus.emit).toHaveBeenCalledWith('video:completed', expect.objectContaining({
        watchedPercent: expect.any(Number),
      }))
    })
  })

  describe('addBookmark', () => {
    it('should add a bookmark at the specified timestamp', () => {
      const { addBookmark } = useVideoStore.getState()
      const bookmark = addBookmark('video-1', 120)

      const state = useVideoStore.getState()
      expect(state.bookmarks['video-1']).toHaveLength(1)
      expect(state.bookmarks['video-1'][0].timestamp).toBe(120)
    })

    it('should return the created bookmark', () => {
      const { addBookmark } = useVideoStore.getState()
      const bookmark = addBookmark('video-1', 60, 'Important part')

      expect(bookmark).toBeDefined()
      expect(bookmark.id).toBeDefined()
      expect(bookmark.timestamp).toBe(60)
      expect(bookmark.label).toBe('Important part')
      expect(bookmark.createdAt).toBeDefined()
    })

    it('should use default label if none provided', () => {
      const { addBookmark } = useVideoStore.getState()
      const bookmark = addBookmark('video-1', 90)

      expect(bookmark.label).toContain('Bookmark at')
      expect(bookmark.label).toContain('1:30') // 90 seconds = 1:30
    })

    it('should sort bookmarks by timestamp', () => {
      const { addBookmark } = useVideoStore.getState()

      addBookmark('video-1', 120)
      addBookmark('video-1', 60)
      addBookmark('video-1', 180)

      const state = useVideoStore.getState()
      const timestamps = state.bookmarks['video-1'].map(b => b.timestamp)

      expect(timestamps).toEqual([60, 120, 180])
    })

    it('should emit video:bookmark:added event', () => {
      const { addBookmark } = useVideoStore.getState()
      addBookmark('video-1', 120, 'Test bookmark')

      expect(eventBus.emit).toHaveBeenCalledWith('video:bookmark:added', expect.objectContaining({
        videoId: 'video-1',
        timestamp: 120,
        label: 'Test bookmark',
      }))
    })

    it('should allow multiple bookmarks per video', () => {
      const { addBookmark } = useVideoStore.getState()

      addBookmark('video-1', 30)
      addBookmark('video-1', 60)
      addBookmark('video-1', 90)

      const state = useVideoStore.getState()
      expect(state.bookmarks['video-1']).toHaveLength(3)
    })

    it('should handle bookmarks for different videos', () => {
      const { addBookmark } = useVideoStore.getState()

      addBookmark('video-1', 30)
      addBookmark('video-2', 60)

      const state = useVideoStore.getState()
      expect(state.bookmarks['video-1']).toHaveLength(1)
      expect(state.bookmarks['video-2']).toHaveLength(1)
    })
  })

  describe('removeBookmark', () => {
    it('should remove a bookmark by ID', () => {
      const { addBookmark, removeBookmark } = useVideoStore.getState()

      const bookmark = addBookmark('video-1', 120)
      removeBookmark('video-1', bookmark.id)

      const state = useVideoStore.getState()
      expect(state.bookmarks['video-1']).toHaveLength(0)
    })

    it('should emit video:bookmark:removed event', () => {
      const { addBookmark, removeBookmark } = useVideoStore.getState()

      const bookmark = addBookmark('video-1', 120)
      vi.clearAllMocks() // Clear the addBookmark emit

      removeBookmark('video-1', bookmark.id)

      expect(eventBus.emit).toHaveBeenCalledWith('video:bookmark:removed', {
        videoId: 'video-1',
        bookmarkId: bookmark.id,
      })
    })

    it('should only remove the specified bookmark', () => {
      const { addBookmark, removeBookmark } = useVideoStore.getState()

      const bookmark1 = addBookmark('video-1', 30)
      const bookmark2 = addBookmark('video-1', 60)
      const bookmark3 = addBookmark('video-1', 90)

      removeBookmark('video-1', bookmark2.id)

      const state = useVideoStore.getState()
      expect(state.bookmarks['video-1']).toHaveLength(2)
      expect(state.bookmarks['video-1'].find(b => b.id === bookmark2.id)).toBeUndefined()
    })

    it('should handle removing non-existent bookmark gracefully', () => {
      const { addBookmark, removeBookmark } = useVideoStore.getState()

      addBookmark('video-1', 30)

      // Should not throw
      expect(() => removeBookmark('video-1', 'non-existent-id')).not.toThrow()
    })

    it('should handle removing bookmark from non-existent video', () => {
      const { removeBookmark } = useVideoStore.getState()

      // Should not throw
      expect(() => removeBookmark('non-existent-video', 'some-id')).not.toThrow()
    })
  })

  describe('updateBookmarkLabel', () => {
    it('should update the label of a bookmark', () => {
      const { addBookmark, updateBookmarkLabel } = useVideoStore.getState()

      const bookmark = addBookmark('video-1', 120, 'Original label')
      updateBookmarkLabel('video-1', bookmark.id, 'Updated label')

      const state = useVideoStore.getState()
      const updatedBookmark = state.bookmarks['video-1'].find(b => b.id === bookmark.id)

      expect(updatedBookmark?.label).toBe('Updated label')
    })

    it('should not affect other bookmarks', () => {
      const { addBookmark, updateBookmarkLabel } = useVideoStore.getState()

      const bookmark1 = addBookmark('video-1', 30, 'Label 1')
      const bookmark2 = addBookmark('video-1', 60, 'Label 2')

      updateBookmarkLabel('video-1', bookmark1.id, 'New Label 1')

      const state = useVideoStore.getState()
      const unchangedBookmark = state.bookmarks['video-1'].find(b => b.id === bookmark2.id)

      expect(unchangedBookmark?.label).toBe('Label 2')
    })
  })

  describe('getProgress', () => {
    it('should return progress for existing video', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 150,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 150 }],
          },
        },
      })

      const { getProgress } = useVideoStore.getState()
      const progress = getProgress('video-1')

      expect(progress).not.toBeNull()
      expect(progress?.currentTime).toBe(150)
      expect(progress?.duration).toBe(300)
    })

    it('should return null for non-existent video', () => {
      const { getProgress } = useVideoStore.getState()
      const progress = getProgress('non-existent-video')

      expect(progress).toBeNull()
    })
  })

  describe('getResumeTime', () => {
    it('should return resume time minus 3 seconds for context', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 120,
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 120 }],
          },
        },
      })

      const { getResumeTime } = useVideoStore.getState()
      const resumeTime = getResumeTime('video-1')

      expect(resumeTime).toBe(117) // 120 - 3
    })

    it('should return 0 for completed video', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 300,
            duration: 300,
            completed: true,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 300 }],
          },
        },
      })

      const { getResumeTime } = useVideoStore.getState()
      const resumeTime = getResumeTime('video-1')

      expect(resumeTime).toBe(0) // Start from beginning
    })

    it('should return 0 for non-existent video', () => {
      const { getResumeTime } = useVideoStore.getState()
      const resumeTime = getResumeTime('non-existent-video')

      expect(resumeTime).toBe(0)
    })

    it('should not return negative resume time', () => {
      useVideoStore.setState({
        ...initialState,
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 2, // Less than 3 seconds
            duration: 300,
            completed: false,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 2 }],
          },
        },
      })

      const { getResumeTime } = useVideoStore.getState()
      const resumeTime = getResumeTime('video-1')

      expect(resumeTime).toBe(0) // Should be 0, not negative
    })
  })

  describe('getBookmarks', () => {
    it('should return bookmarks for a video', () => {
      const { addBookmark, getBookmarks } = useVideoStore.getState()

      addBookmark('video-1', 30, 'Bookmark 1')
      addBookmark('video-1', 60, 'Bookmark 2')

      const bookmarks = getBookmarks('video-1')

      expect(bookmarks).toHaveLength(2)
    })

    it('should return empty array for video without bookmarks', () => {
      const { getBookmarks } = useVideoStore.getState()
      const bookmarks = getBookmarks('video-without-bookmarks')

      expect(bookmarks).toEqual([])
    })
  })

  describe('playback control state', () => {
    describe('setPlaying', () => {
      it('should set playing state to true', () => {
        const { setPlaying } = useVideoStore.getState()
        setPlaying(true)

        const state = useVideoStore.getState()
        expect(state.currentVideo.isPlaying).toBe(true)
      })

      it('should set playing state to false', () => {
        useVideoStore.setState({
          ...initialState,
          currentVideo: {
            ...initialState.currentVideo,
            isPlaying: true,
          },
        })

        const { setPlaying } = useVideoStore.getState()
        setPlaying(false)

        const state = useVideoStore.getState()
        expect(state.currentVideo.isPlaying).toBe(false)
      })
    })

    describe('setVolume', () => {
      it('should set volume within valid range', () => {
        const { setVolume } = useVideoStore.getState()
        setVolume(0.5)

        const state = useVideoStore.getState()
        expect(state.currentVideo.volume).toBe(0.5)
      })

      it('should clamp volume to minimum 0', () => {
        const { setVolume } = useVideoStore.getState()
        setVolume(-0.5)

        const state = useVideoStore.getState()
        expect(state.currentVideo.volume).toBe(0)
      })

      it('should clamp volume to maximum 1', () => {
        const { setVolume } = useVideoStore.getState()
        setVolume(1.5)

        const state = useVideoStore.getState()
        expect(state.currentVideo.volume).toBe(1)
      })
    })

    describe('setPlaybackRate', () => {
      it('should set playback rate', () => {
        const { setPlaybackRate } = useVideoStore.getState()
        setPlaybackRate(1.5)

        const state = useVideoStore.getState()
        expect(state.currentVideo.playbackRate).toBe(1.5)
      })

      it('should handle common playback rates', () => {
        const { setPlaybackRate } = useVideoStore.getState()
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]

        rates.forEach(rate => {
          setPlaybackRate(rate)
          const state = useVideoStore.getState()
          expect(state.currentVideo.playbackRate).toBe(rate)
        })
      })
    })

    describe('setCurrentTime', () => {
      it('should set current playback time', () => {
        const { setCurrentTime } = useVideoStore.getState()
        setCurrentTime(120)

        const state = useVideoStore.getState()
        expect(state.currentVideo.currentTime).toBe(120)
      })
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      useVideoStore.setState({
        currentVideo: {
          videoId: 'video-1',
          currentTime: 120,
          isPlaying: true,
          volume: 0.5,
          playbackRate: 1.5,
        },
        progressMap: {
          'video-1': {
            videoId: 'video-1',
            currentTime: 120,
            duration: 300,
            completed: true,
            lastWatched: '2026-02-02T10:00:00Z',
            watchedRanges: [{ start: 0, end: 120 }],
          },
        },
        bookmarks: {
          'video-1': [{ id: 'b1', timestamp: 60, label: 'Test', createdAt: '2026-02-02T10:00:00Z' }],
        },
      })

      const { reset } = useVideoStore.getState()
      reset()

      const state = useVideoStore.getState()
      expect(state.currentVideo.videoId).toBeNull()
      expect(state.currentVideo.isPlaying).toBe(false)
      expect(state.progressMap).toEqual({})
      expect(state.bookmarks).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('should handle progress update at time 0', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 0, 300)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].currentTime).toBe(0)
    })

    it('should handle progress update at end of video', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 300, 300)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].currentTime).toBe(300)
    })

    it('should handle video with duration 0', () => {
      const { updateProgress } = useVideoStore.getState()
      updateProgress('video-1', 0, 0)

      // Should not throw
      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].duration).toBe(0)
    })

    it('should handle bookmark at timestamp 0', () => {
      const { addBookmark } = useVideoStore.getState()
      const bookmark = addBookmark('video-1', 0, 'Start')

      expect(bookmark.timestamp).toBe(0)
      expect(bookmark.label).toBe('Start')
    })

    it('should handle very long video durations', () => {
      const { updateProgress } = useVideoStore.getState()
      const longDuration = 10 * 60 * 60 // 10 hours in seconds

      updateProgress('video-1', 5000, longDuration)

      const state = useVideoStore.getState()
      expect(state.progressMap['video-1'].duration).toBe(longDuration)
    })
  })
})
