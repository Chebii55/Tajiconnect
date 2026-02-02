/**
 * VideoLesson Component
 *
 * Wraps InteractiveVideoPlayer for use within the course learning system.
 * Handles mapping course content data to video player props.
 */

import { useCallback, useMemo, useRef } from 'react';
import { InteractiveVideoPlayer, VideoBookmarks } from '../../video';
import { useVideoStore } from '../../../stores/videoStore';
import type { ContentBlock } from '../../../types/course';
import type { VideoChapter } from '../../../types/video';
import { eventBus } from '../../../lib/eventBus';

interface VideoLessonProps {
  content: ContentBlock;
  lessonId: string;
  courseId?: string;
  onComplete?: () => void;
  className?: string;
}

const VideoLesson: React.FC<VideoLessonProps> = ({
  content,
  lessonId,
  courseId = 'unknown',
  onComplete,
  className = '',
}) => {
  // Generate unique video ID from lesson ID
  const videoId = useMemo(() => `lesson-video-${lessonId}`, [lessonId]);

  // Track watch start time for time spent calculation
  const watchStartTime = useRef<number>(Date.now());

  // Get video store state
  const { currentVideo } = useVideoStore();

  // Handle video completion
  const handleComplete = useCallback(() => {
    // Calculate time spent watching
    const timeSpent = Math.round((Date.now() - watchStartTime.current) / 1000 / 60); // in minutes

    // Emit video completed event for gamification
    eventBus.emit('video:completed', {
      videoId,
      duration: currentVideo.currentTime || 0,
      watchedPercent: 100,
    });

    // Emit lesson completion event for gamification
    eventBus.emit('lesson:completed', {
      lessonId,
      courseId,
      score: 100, // Video completion is always 100%
      timeSpent,
    });

    // Call parent onComplete callback
    onComplete?.();
  }, [lessonId, courseId, videoId, currentVideo.currentTime, onComplete]);

  // Handle bookmark click to seek video
  const handleBookmarkClick = useCallback((timestamp: number) => {
    // The InteractiveVideoPlayer handles seeking internally via videoStore
    // We just need to trigger it - the player listens to currentVideo state
    useVideoStore.getState().updateProgress(videoId, timestamp, currentVideo.currentTime || 0);
  }, [videoId, currentVideo.currentTime]);

  // Map course content chapters to video player chapter format
  const chapters: VideoChapter[] = useMemo(() => {
    if (!content.chapters) return [];

    return content.chapters.map((chapter, index, arr) => ({
      id: chapter.id,
      title: chapter.title,
      startTime: chapter.startTime,
      // endTime: use next chapter's start time or undefined for last chapter
      endTime: chapter.endTime ?? (index < arr.length - 1 ? arr[index + 1].startTime : 0),
    }));
  }, [content.chapters]);

  // Validate video content
  if (content.type !== 'video' || !content.videoUrl) {
    return (
      <div className={`p-6 bg-red-50 dark:bg-red-900/20 rounded-lg ${className}`}>
        <p className="text-red-600 dark:text-red-400">
          Invalid video content: missing videoUrl
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Video Player */}
      <InteractiveVideoPlayer
        videoUrl={content.videoUrl}
        title=""
        videoId={videoId}
        chapters={chapters}
        onComplete={handleComplete}
        className="w-full"
      />

      {/* Bookmarks Section */}
      <div className="mt-4">
        <VideoBookmarks
          videoId={videoId}
          onBookmarkClick={handleBookmarkClick}
          currentTime={currentVideo.currentTime}
          className="max-w-md"
        />
      </div>
    </div>
  );
};

export default VideoLesson;
