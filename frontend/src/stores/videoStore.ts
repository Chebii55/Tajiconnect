/**
 * Video Store
 *
 * Zustand store managing video playback state, progress tracking, and bookmarks.
 * Integrates with event bus for cross-feature communication (gamification).
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { eventBus } from '../lib/eventBus'
import type {
  VideoProgress,
  VideoBookmark,
  CurrentVideoState,
  WatchedRange,
} from '../types/video'
import { formatTimestamp, generateId } from '../types/video'

interface VideoState {
  // Current playback state
  currentVideo: CurrentVideoState

  // Progress tracking per video
  progressMap: Record<string, VideoProgress>

  // Bookmarks per video
  bookmarks: Record<string, VideoBookmark[]>

  // Actions
  setCurrentVideo: (videoId: string) => void
  updateProgress: (videoId: string, time: number, duration: number) => void
  markCompleted: (videoId: string) => void
  addBookmark: (videoId: string, timestamp: number, label?: string) => VideoBookmark
  removeBookmark: (videoId: string, bookmarkId: string) => void
  updateBookmarkLabel: (videoId: string, bookmarkId: string, newLabel: string) => void
  getProgress: (videoId: string) => VideoProgress | null
  getResumeTime: (videoId: string) => number
  getBookmarks: (videoId: string) => VideoBookmark[]

  // Playback control state
  setPlaying: (isPlaying: boolean) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  setCurrentTime: (time: number) => void

  // Reset
  reset: () => void
}

const initialCurrentVideo: CurrentVideoState = {
  videoId: null,
  currentTime: 0,
  isPlaying: false,
  volume: 1,
  playbackRate: 1,
}

const initialState = {
  currentVideo: initialCurrentVideo,
  progressMap: {},
  bookmarks: {},
}

/**
 * Merge watched ranges to avoid overlaps
 */
function mergeWatchedRanges(ranges: WatchedRange[], newRange: WatchedRange): WatchedRange[] {
  const allRanges = [...ranges, newRange].sort((a, b) => a.start - b.start)
  const merged: WatchedRange[] = []

  for (const range of allRanges) {
    if (merged.length === 0) {
      merged.push(range)
    } else {
      const last = merged[merged.length - 1]
      // If ranges overlap or are adjacent (within 2 seconds), merge them
      if (range.start <= last.end + 2) {
        last.end = Math.max(last.end, range.end)
      } else {
        merged.push(range)
      }
    }
  }

  return merged
}

/**
 * Calculate total watched time from ranges
 */
function calculateWatchedTime(ranges: WatchedRange[]): number {
  return ranges.reduce((total, range) => total + (range.end - range.start), 0)
}

export const useVideoStore = create<VideoState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Set the currently active video
         */
        setCurrentVideo: (videoId) => {
          const progress = get().progressMap[videoId]
          const resumeTime = progress?.currentTime ?? 0

          set({
            currentVideo: {
              videoId,
              currentTime: resumeTime,
              isPlaying: false,
              volume: get().currentVideo.volume,
              playbackRate: get().currentVideo.playbackRate,
            },
          })
        },

        /**
         * Update video progress (called on timeupdate)
         */
        updateProgress: (videoId, time, duration) => {
          const state = get()
          const existing = state.progressMap[videoId]
          const now = new Date().toISOString()

          // Create or update watched range
          const newRange: WatchedRange = {
            start: Math.max(0, time - 1),
            end: time,
          }

          const watchedRanges = existing?.watchedRanges
            ? mergeWatchedRanges(existing.watchedRanges, newRange)
            : [newRange]

          const updatedProgress: VideoProgress = {
            videoId,
            currentTime: time,
            duration,
            completed: existing?.completed ?? false,
            lastWatched: now,
            watchedRanges,
          }

          set({
            progressMap: {
              ...state.progressMap,
              [videoId]: updatedProgress,
            },
            currentVideo: {
              ...state.currentVideo,
              currentTime: time,
            },
          })

          // Calculate percent complete
          const watchedTime = calculateWatchedTime(watchedRanges)
          const percentComplete = duration > 0 ? Math.round((watchedTime / duration) * 100) : 0

          // Emit progress event
          eventBus.emit('video:progress', {
            videoId,
            currentTime: time,
            duration,
            percentComplete,
          })
        },

        /**
         * Mark video as completed
         */
        markCompleted: (videoId) => {
          const state = get()
          const progress = state.progressMap[videoId]

          if (!progress) return

          const updatedProgress: VideoProgress = {
            ...progress,
            completed: true,
          }

          set({
            progressMap: {
              ...state.progressMap,
              [videoId]: updatedProgress,
            },
          })

          // Calculate watched percent
          const watchedTime = calculateWatchedTime(progress.watchedRanges)
          const watchedPercent = progress.duration > 0
            ? Math.round((watchedTime / progress.duration) * 100)
            : 100

          // Emit completed event
          eventBus.emit('video:completed', {
            videoId,
            duration: progress.duration,
            watchedPercent,
          })
        },

        /**
         * Add a bookmark at the specified timestamp
         */
        addBookmark: (videoId, timestamp, label?) => {
          const state = get()
          const defaultLabel = `Bookmark at ${formatTimestamp(timestamp)}`

          const newBookmark: VideoBookmark = {
            id: generateId(),
            timestamp,
            label: label || defaultLabel,
            createdAt: new Date().toISOString(),
          }

          const existingBookmarks = state.bookmarks[videoId] || []
          const updatedBookmarks = [...existingBookmarks, newBookmark].sort(
            (a, b) => a.timestamp - b.timestamp
          )

          set({
            bookmarks: {
              ...state.bookmarks,
              [videoId]: updatedBookmarks,
            },
          })

          // Emit bookmark added event
          eventBus.emit('video:bookmark:added', {
            videoId,
            bookmarkId: newBookmark.id,
            timestamp,
            label: newBookmark.label,
          })

          return newBookmark
        },

        /**
         * Remove a bookmark
         */
        removeBookmark: (videoId, bookmarkId) => {
          const state = get()
          const existingBookmarks = state.bookmarks[videoId] || []
          const updatedBookmarks = existingBookmarks.filter((b) => b.id !== bookmarkId)

          set({
            bookmarks: {
              ...state.bookmarks,
              [videoId]: updatedBookmarks,
            },
          })

          // Emit bookmark removed event
          eventBus.emit('video:bookmark:removed', {
            videoId,
            bookmarkId,
          })
        },

        /**
         * Update a bookmark's label
         */
        updateBookmarkLabel: (videoId, bookmarkId, newLabel) => {
          const state = get()
          const existingBookmarks = state.bookmarks[videoId] || []
          const updatedBookmarks = existingBookmarks.map((b) =>
            b.id === bookmarkId ? { ...b, label: newLabel } : b
          )

          set({
            bookmarks: {
              ...state.bookmarks,
              [videoId]: updatedBookmarks,
            },
          })
        },

        /**
         * Get progress for a video
         */
        getProgress: (videoId) => {
          return get().progressMap[videoId] || null
        },

        /**
         * Get resume time for a video
         */
        getResumeTime: (videoId) => {
          const progress = get().progressMap[videoId]
          if (!progress) return 0

          // If completed, start from beginning
          if (progress.completed) return 0

          // Otherwise resume from last position (minus a few seconds for context)
          return Math.max(0, progress.currentTime - 3)
        },

        /**
         * Get bookmarks for a video
         */
        getBookmarks: (videoId) => {
          return get().bookmarks[videoId] || []
        },

        /**
         * Set playing state
         */
        setPlaying: (isPlaying) => {
          set((state) => ({
            currentVideo: {
              ...state.currentVideo,
              isPlaying,
            },
          }))
        },

        /**
         * Set volume (0-1)
         */
        setVolume: (volume) => {
          set((state) => ({
            currentVideo: {
              ...state.currentVideo,
              volume: Math.max(0, Math.min(1, volume)),
            },
          }))
        },

        /**
         * Set playback rate
         */
        setPlaybackRate: (rate) => {
          set((state) => ({
            currentVideo: {
              ...state.currentVideo,
              playbackRate: rate,
            },
          }))
        },

        /**
         * Set current playback time
         */
        setCurrentTime: (time) => {
          set((state) => ({
            currentVideo: {
              ...state.currentVideo,
              currentTime: time,
            },
          }))
        },

        /**
         * Reset store to initial state
         */
        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'video-progress',
        partialize: (state) => ({
          progressMap: state.progressMap,
          bookmarks: state.bookmarks,
          currentVideo: {
            volume: state.currentVideo.volume,
            playbackRate: state.currentVideo.playbackRate,
          },
        }),
      }
    ),
    { name: 'VideoStore' }
  )
)

export default useVideoStore
