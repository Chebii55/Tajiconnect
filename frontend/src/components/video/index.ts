/**
 * Video Components
 *
 * Barrel export for video-related components.
 */

// Main video player
export { default as InteractiveVideoPlayer } from './InteractiveVideoPlayer'

// Video navigation
export { default as VideoChapters } from './VideoChapters'

// Video controls
export { default as VideoControls } from './VideoControls'

// Bookmark components
export { default as BookmarkButton } from './BookmarkButton'
export { default as VideoBookmarks } from './VideoBookmarks'

// In-video quiz components
export { default as VideoQuizOverlay } from './VideoQuizOverlay'

// Video hooks
export { useVideoQuiz } from '../../hooks/useVideoQuiz'
