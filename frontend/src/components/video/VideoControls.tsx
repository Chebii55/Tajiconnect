/**
 * VideoControls Component
 *
 * Custom video player controls with progress bar, volume, playback speed,
 * and fullscreen toggle. Styled with Tailwind and supports dark mode.
 */

import { useCallback, useState, useRef } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
} from 'lucide-react'
import type { VideoControlsProps } from '../../types/video'
import { formatTimestamp } from '../../types/video'

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

const VideoControls: React.FC<VideoControlsProps> = ({
  playing,
  currentTime,
  duration,
  volume,
  playbackRate,
  isMuted,
  isFullscreen,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onRateChange,
  onFullscreenToggle,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showRateMenu, setShowRateMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Handle progress bar click/drag
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration <= 0) return

      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percent = Math.max(0, Math.min(1, clickX / rect.width))
      onSeek(percent * duration)
    },
    [duration, onSeek]
  )

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      handleProgressClick(e)
    },
    [handleProgressClick]
  )

  const handleProgressMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        handleProgressClick(e)
      }
    },
    [isDragging, handleProgressClick]
  )

  const handleProgressMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleProgressMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  // Get volume icon based on level
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="w-full px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="group relative h-2 bg-gray-600/50 rounded-full cursor-pointer mb-3"
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
        onMouseMove={handleProgressMouseMove}
        onMouseUp={handleProgressMouseUp}
        onMouseLeave={handleProgressMouseLeave}
        role="slider"
        aria-label="Video progress"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        {/* Buffered/loaded indicator could go here */}

        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Scrubber handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={playing ? onPause : onPlay}
            className="p-2 text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          {/* Volume control */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              type="button"
              onClick={onMuteToggle}
              className="p-2 text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <VolumeIcon className="w-5 h-5" />
            </button>

            {/* Volume slider */}
            <div
              className={`
                absolute left-10 top-1/2 -translate-y-1/2
                flex items-center
                overflow-hidden transition-all duration-200
                ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}
              `}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Time display */}
          <span className="text-sm text-white font-mono">
            {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Playback rate */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRateMenu(!showRateMenu)}
              className="flex items-center gap-1 p-2 text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Playback speed"
              aria-expanded={showRateMenu}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">{playbackRate}x</span>
            </button>

            {/* Rate menu */}
            {showRateMenu && (
              <div className="absolute bottom-full right-0 mb-2 py-1 bg-gray-900 rounded-lg shadow-xl min-w-[80px] z-50">
                {PLAYBACK_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      onRateChange(rate)
                      setShowRateMenu(false)
                    }}
                    className={`
                      w-full px-4 py-2 text-left text-sm
                      ${rate === playbackRate ? 'text-blue-400 bg-gray-800' : 'text-white hover:bg-gray-800'}
                      transition-colors
                    `}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={onFullscreenToggle}
            className="p-2 text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoControls
