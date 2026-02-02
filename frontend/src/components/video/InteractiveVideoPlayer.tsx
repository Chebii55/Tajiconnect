/**
 * InteractiveVideoPlayer Component
 *
 * Full-featured video player with chapters, custom controls, and progress tracking.
 * Uses react-player for playback and integrates with videoStore for persistence.
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { useVideoStore } from '../../stores/videoStore'
import type { InteractiveVideoPlayerProps } from '../../types/video'
import VideoControls from './VideoControls'
import VideoChapters from './VideoChapters'
import BookmarkButton from './BookmarkButton'

// Progress callback props from react-player
interface ProgressState {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoUrl,
  title,
  videoId,
  chapters = [],
  onComplete,
  className = '',
}) => {
  // Refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Local state
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)

  // Video store
  const {
    setCurrentVideo,
    updateProgress,
    markCompleted,
    getResumeTime,
    setPlaying: setStorePlaying,
    setVolume: setStoreVolume,
    setPlaybackRate: setStorePlaybackRate,
  } = useVideoStore()

  // Initialize video in store on mount
  useEffect(() => {
    setCurrentVideo(videoId)
  }, [videoId, setCurrentVideo])

  // Handle player ready
  const handleReady = useCallback(() => {
    setReady(true)

    // Resume from last position
    const resumeTime = getResumeTime(videoId)
    if (resumeTime > 0 && playerRef.current) {
      playerRef.current.seekTo(resumeTime, 'seconds')
    }
  }, [videoId, getResumeTime])

  // Handle duration loaded
  const handleDuration = useCallback((dur: number) => {
    setDuration(dur)
  }, [])

  // Handle progress updates (called frequently during playback)
  const handleProgress = useCallback(
    (state: ProgressState) => {
      const time = state.playedSeconds
      setCurrentTime(time)

      // Update progress in store (throttled inside store)
      if (duration > 0) {
        updateProgress(videoId, time, duration)
      }
    },
    [videoId, duration, updateProgress]
  )

  // Handle video ended
  const handleEnded = useCallback(() => {
    setPlaying(false)
    markCompleted(videoId)
    onComplete?.()
  }, [videoId, markCompleted, onComplete])

  // Play/pause handlers
  const handlePlay = useCallback(() => {
    setPlaying(true)
    setStorePlaying(true)
  }, [setStorePlaying])

  const handlePause = useCallback(() => {
    setPlaying(false)
    setStorePlaying(false)
  }, [setStorePlaying])

  // Seek handler
  const handleSeek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds')
      setCurrentTime(time)
    }
  }, [])

  // Volume handler
  const handleVolumeChange = useCallback(
    (vol: number) => {
      setVolume(vol)
      setStoreVolume(vol)
      if (vol > 0) {
        setIsMuted(false)
      }
    },
    [setStoreVolume]
  )

  // Mute toggle handler
  const handleMuteToggle = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  // Playback rate handler
  const handleRateChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate)
      setStorePlaybackRate(rate)
    },
    [setStorePlaybackRate]
  )

  // Fullscreen handler
  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Chapter click handler
  const handleChapterClick = useCallback((startTime: number) => {
    handleSeek(startTime)
    setPlaying(true)
  }, [handleSeek])

  // Auto-hide controls on mouse inactivity
  const handleMouseMove = useCallback(() => {
    setShowControls(true)

    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }

    const timeout = setTimeout(() => {
      if (playing) {
        setShowControls(false)
      }
    }, 3000)

    setControlsTimeout(timeout)
  }, [playing, controlsTimeout])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [controlsTimeout])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if video player is focused
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          playing ? handlePause() : handlePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSeek(Math.max(0, currentTime - 10))
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSeek(Math.min(duration, currentTime + 10))
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange(Math.max(0, volume - 0.1))
          break
        case 'm':
          e.preventDefault()
          handleMuteToggle()
          break
        case 'f':
          e.preventDefault()
          handleFullscreenToggle()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [playing, currentTime, duration, volume, handlePlay, handlePause, handleSeek, handleVolumeChange, handleMuteToggle, handleFullscreenToggle])

  return (
    <div
      ref={containerRef}
      className={`flex flex-col lg:flex-row gap-4 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video player area */}
      <div className="flex-1 lg:w-[70%]">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>

        {/* Video container */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
          <ReactPlayer
            ref={playerRef}
            src={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={isMuted ? 0 : volume}
            playbackRate={playbackRate}
            onReady={handleReady}
            onDurationChange={(e) => handleDuration((e.target as HTMLVideoElement).duration)}
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement
              handleProgress({
                played: video.duration > 0 ? video.currentTime / video.duration : 0,
                playedSeconds: video.currentTime,
                loaded: 0,
                loadedSeconds: 0,
              })
            }}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          />

          {/* Click to play/pause overlay */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={playing ? handlePause : handlePlay}
            aria-label={playing ? 'Pause video' : 'Play video'}
          />

          {/* Custom controls overlay */}
          <div
            className={`
              absolute bottom-0 left-0 right-0
              transition-opacity duration-300
              ${showControls || !playing ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <VideoControls
              playing={playing}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              playbackRate={playbackRate}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
              onRateChange={handleRateChange}
              onFullscreenToggle={handleFullscreenToggle}
            />
          </div>

          {/* Bookmark button */}
          <div
            className={`
              absolute top-4 right-4
              transition-opacity duration-300
              ${showControls || !playing ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <BookmarkButton
              videoId={videoId}
              currentTime={currentTime}
              className="bg-black/50 hover:bg-black/70"
            />
          </div>

          {/* Loading indicator */}
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Chapters sidebar */}
      {chapters.length > 0 && (
        <div className="lg:w-[30%] min-w-[280px]">
          <div className="h-[400px] lg:h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <VideoChapters
              chapters={chapters}
              currentTime={currentTime}
              duration={duration}
              onChapterClick={handleChapterClick}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InteractiveVideoPlayer
