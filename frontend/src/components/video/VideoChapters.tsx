/**
 * VideoChapters Component
 *
 * Displays a list of video chapters with timestamps.
 * Highlights the current chapter and allows navigation via click.
 */

import { useMemo } from 'react'
import { PlayCircle, Clock } from 'lucide-react'
import type { VideoChaptersProps, VideoChapter } from '../../types/video'
import { formatTimestamp } from '../../types/video'

/**
 * Get the current chapter based on playback time
 */
function getCurrentChapter(
  chapters: VideoChapter[],
  currentTime: number
): VideoChapter | null {
  if (!chapters.length) return null

  // Find the chapter that contains the current time
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (currentTime >= chapters[i].startTime) {
      return chapters[i]
    }
  }

  return chapters[0]
}

const VideoChapters: React.FC<VideoChaptersProps> = ({
  chapters,
  currentTime,
  duration,
  onChapterClick,
  className = '',
}) => {
  // Determine current chapter
  const currentChapter = useMemo(
    () => getCurrentChapter(chapters, currentTime),
    [chapters, currentTime]
  )

  // Calculate chapter progress
  const chapterProgress = useMemo(() => {
    if (!currentChapter) return 0
    const chapterDuration = currentChapter.endTime - currentChapter.startTime
    const elapsed = currentTime - currentChapter.startTime
    return chapterDuration > 0 ? Math.min(100, (elapsed / chapterDuration) * 100) : 0
  }, [currentChapter, currentTime])

  if (!chapters.length) {
    return (
      <div className={`p-4 text-center text-gray-500 dark:text-gray-400 ${className}`}>
        No chapters available
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Chapters
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {chapters.length} chapters
        </p>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {chapters.map((chapter, index) => {
            const isActive = currentChapter?.id === chapter.id
            const isPast = currentTime >= chapter.endTime
            const chapterDuration = chapter.endTime - chapter.startTime

            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => onChapterClick(chapter.startTime)}
                  className={`
                    w-full px-4 py-3 flex items-start gap-3 text-left
                    transition-colors duration-150
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800
                    ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''}
                  `}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  {/* Chapter number/icon */}
                  <div
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${isActive
                        ? 'bg-blue-500 text-white'
                        : isPast
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {isActive ? (
                      <PlayCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`
                        text-sm font-medium truncate
                        ${isActive
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-900 dark:text-white'
                        }
                      `}
                    >
                      {chapter.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(chapter.startTime)} - {formatTimestamp(chapter.endTime)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({formatTimestamp(chapterDuration)})
                      </span>
                    </div>

                    {/* Progress bar for active chapter */}
                    {isActive && (
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${chapterProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail if available */}
                  {chapter.thumbnail && (
                    <img
                      src={chapter.thumbnail}
                      alt={`Thumbnail for ${chapter.title}`}
                      className="w-16 h-10 object-cover rounded flex-shrink-0"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer - current chapter info */}
      {currentChapter && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Currently watching
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {currentChapter.title}
          </p>
        </div>
      )}
    </div>
  )
}

export default VideoChapters
