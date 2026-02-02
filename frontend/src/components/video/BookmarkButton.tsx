/**
 * BookmarkButton Component
 *
 * Button to add a bookmark at the current video position.
 * Shows brief feedback when bookmark is added.
 */

import { useState, useCallback } from 'react'
import { BookmarkPlus, Check } from 'lucide-react'
import { useVideoStore } from '../../stores/videoStore'
import { formatTimestamp } from '../../types/video'

interface BookmarkButtonProps {
  videoId: string
  currentTime: number
  onBookmarkAdded?: () => void
  className?: string
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  videoId,
  currentTime,
  onBookmarkAdded,
  className = '',
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const addBookmark = useVideoStore((state) => state.addBookmark)

  const handleAddBookmark = useCallback(() => {
    // Add bookmark with auto-generated label
    const label = `Bookmark at ${formatTimestamp(currentTime)}`
    addBookmark(videoId, currentTime, label)

    // Show confirmation briefly
    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
    }, 1500)

    // Notify parent
    onBookmarkAdded?.()
  }, [videoId, currentTime, addBookmark, onBookmarkAdded])

  return (
    <button
      type="button"
      onClick={handleAddBookmark}
      disabled={showConfirmation}
      className={`
        group relative p-2 rounded-lg
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700
        hover:text-blue-600 dark:hover:text-blue-400
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${className}
      `}
      title={showConfirmation ? 'Bookmark added!' : 'Add bookmark'}
      aria-label={showConfirmation ? 'Bookmark added' : `Add bookmark at ${formatTimestamp(currentTime)}`}
    >
      {showConfirmation ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <BookmarkPlus className="w-5 h-5" />
      )}

      {/* Tooltip */}
      <span
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-2 py-1 text-xs font-medium text-white
          bg-gray-900 dark:bg-gray-700 rounded
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-opacity duration-150
          whitespace-nowrap
          ${showConfirmation ? 'opacity-100' : ''}
        `}
      >
        {showConfirmation ? 'Bookmark added!' : 'Add bookmark'}
      </span>
    </button>
  )
}

export default BookmarkButton
