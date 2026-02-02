/**
 * VideoBookmarks Component
 *
 * Displays a list of bookmarks for a video with navigation and deletion.
 * Shows timestamp, label, and delete button for each bookmark.
 */

import { useCallback, useMemo } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'
import { useVideoStore } from '../../stores/videoStore'
import { formatTimestamp } from '../../types/video'

interface VideoBookmarksProps {
  videoId: string
  onBookmarkClick: (timestamp: number) => void
  currentTime?: number
  className?: string
}

const VideoBookmarks: React.FC<VideoBookmarksProps> = ({
  videoId,
  onBookmarkClick,
  currentTime = 0,
  className = '',
}) => {
  // Select state and actions individually to prevent infinite loops with persist middleware
  const bookmarksMap = useVideoStore((state) => state.bookmarks)
  const removeBookmark = useVideoStore((state) => state.removeBookmark)

  // Derive bookmarks for this video from the bookmarks map
  const bookmarks = useMemo(
    () => bookmarksMap[videoId] || [],
    [bookmarksMap, videoId]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent, bookmarkId: string) => {
      e.stopPropagation() // Prevent triggering the click-to-seek
      removeBookmark(videoId, bookmarkId)
    },
    [videoId, removeBookmark]
  )

  const isCurrentBookmark = useCallback(
    (timestamp: number): boolean => {
      // Highlight if currentTime is within 2 seconds of bookmark
      return Math.abs(currentTime - timestamp) <= 2
    },
    [currentTime]
  )

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center
          p-6 text-center
          bg-gray-50 dark:bg-gray-800/50
          rounded-lg border border-dashed border-gray-300 dark:border-gray-600
          ${className}
        `}
      >
        <Bookmark className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          No bookmarks yet. Click the bookmark icon while watching to save important moments.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`
        flex flex-col
        bg-white dark:bg-gray-800
        rounded-lg border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div
        className="
          flex items-center gap-2
          px-4 py-3
          bg-gray-50 dark:bg-gray-800
          border-b border-gray-200 dark:border-gray-700
        "
      >
        <Bookmark className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bookmarks ({bookmarks.length})
        </span>
      </div>

      {/* Bookmark list */}
      <ul
        className="
          flex flex-col
          max-h-64 overflow-y-auto
          divide-y divide-gray-100 dark:divide-gray-700
        "
        role="list"
        aria-label="Video bookmarks"
      >
        {bookmarks.map((bookmark) => {
          const isCurrent = isCurrentBookmark(bookmark.timestamp)

          return (
            <li
              key={bookmark.id}
              className={`
                group relative
                flex items-center gap-3
                px-4 py-3
                cursor-pointer
                transition-colors duration-150
                ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'
                }
              `}
              onClick={() => onBookmarkClick(bookmark.timestamp)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onBookmarkClick(bookmark.timestamp)
                }
              }}
              aria-label={`Jump to ${bookmark.label} at ${formatTimestamp(bookmark.timestamp)}`}
            >
              {/* Timestamp badge */}
              <span
                className={`
                  flex-shrink-0
                  px-2 py-1
                  text-xs font-mono font-medium
                  rounded
                  ${
                    isCurrent
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                {formatTimestamp(bookmark.timestamp)}
              </span>

              {/* Label */}
              <span
                className={`
                  flex-1 min-w-0
                  text-sm truncate
                  ${
                    isCurrent
                      ? 'text-blue-700 dark:text-blue-200 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                `}
                title={bookmark.label}
              >
                {bookmark.label}
              </span>

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => handleDelete(e, bookmark.id)}
                className={`
                  flex-shrink-0
                  p-1.5 rounded
                  text-gray-400 dark:text-gray-500
                  opacity-0 group-hover:opacity-100
                  hover:bg-red-100 dark:hover:bg-red-900/30
                  hover:text-red-600 dark:hover:text-red-400
                  focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500
                  transition-all duration-150
                `}
                title="Delete bookmark"
                aria-label={`Delete bookmark at ${formatTimestamp(bookmark.timestamp)}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VideoBookmarks
