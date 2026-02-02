// Video System Type Definitions

/**
 * Video chapter for navigation
 */
export interface VideoChapter {
  id: string
  title: string
  startTime: number // in seconds
  endTime: number // in seconds
  thumbnail?: string
}

/**
 * User-created bookmark in a video
 */
export interface VideoBookmark {
  id: string
  timestamp: number // in seconds
  label: string
  createdAt: string // ISO date string
}

/**
 * Quiz trigger point in video
 */
export interface VideoQuizTrigger {
  id: string
  timestamp: number // in seconds
  quizId: string
  required: boolean // must answer to continue
}

/**
 * Range of watched video content
 */
export interface WatchedRange {
  start: number
  end: number
}

/**
 * Video playback progress tracking
 */
export interface VideoProgress {
  videoId: string
  currentTime: number
  duration: number
  completed: boolean
  lastWatched: string // ISO date string
  watchedRanges: WatchedRange[]
}

/**
 * Full interactive video definition
 */
export interface InteractiveVideo {
  id: string
  url: string
  title: string
  chapters: VideoChapter[]
  bookmarks: VideoBookmark[]
  quizTriggers: VideoQuizTrigger[]
  duration: number
}

/**
 * Current video playback state
 */
export interface CurrentVideoState {
  videoId: string | null
  currentTime: number
  isPlaying: boolean
  volume: number
  playbackRate: number
}

/**
 * Video store state structure
 */
export interface VideoStoreState {
  currentVideo: CurrentVideoState
  progressMap: Record<string, VideoProgress>
  bookmarks: Record<string, VideoBookmark[]>
}

/**
 * Utility function to format seconds as mm:ss
 */
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Utility function to generate unique ID
 */
export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Video player props interface
 */
export interface InteractiveVideoPlayerProps {
  videoUrl: string
  title: string
  videoId: string
  chapters?: VideoChapter[]
  onComplete?: () => void
  className?: string
}

/**
 * Video chapters props interface
 */
export interface VideoChaptersProps {
  chapters: VideoChapter[]
  currentTime: number
  duration: number
  onChapterClick: (startTime: number) => void
  className?: string
}

/**
 * Video controls props interface
 */
export interface VideoControlsProps {
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  isMuted: boolean
  isFullscreen: boolean
  onPlay: () => void
  onPause: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
  onRateChange: (rate: number) => void
  onFullscreenToggle: () => void
}

/**
 * Video progress event payload for event bus
 */
export interface VideoProgressEventPayload {
  videoId: string
  currentTime: number
  duration: number
  played: number // 0-1 percentage
}

/**
 * Video completed event payload for event bus
 */
export interface VideoCompletedEventPayload {
  videoId: string
  duration: number
  watchedRanges: WatchedRange[]
}
