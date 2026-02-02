# Plan 01-06: Microlearning Structure and Daily Goals

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Status**: Pending

## Objective

Structure lessons as 5-10 minute bite-sized modules and implement daily learning goals that users can set and track, driving consistent engagement.

## Requirements Addressed

- MIC-01: Lessons are structured as 5-10 minute bite-sized modules
- MIC-02: User sets and tracks daily learning goals (e.g., "Complete 3 lessons today")
- MIC-03: User sees progress toward daily goal with visual indicators

## Success Criteria

- [ ] Lessons display estimated time (5-10 min badges)
- [ ] Lessons structured in digestible chunks
- [ ] User can set daily lesson goal (1-10 lessons)
- [ ] Daily goal suggested based on time_commitment from onboarding
- [ ] Progress ring/bar shows daily completion
- [ ] Celebration when daily goal met
- [ ] Goal streak tracked (days meeting goal)
- [ ] Flexible "catch-up" option if behind

## Technical Approach

### 1. Lesson Time Estimation

Location: `frontend/src/utils/lessonTime.ts`

```typescript
interface LessonTimeEstimate {
  minutes: number
  formatted: string // "5 min" | "8 min"
  badge: 'quick' | 'standard' | 'extended'
}

function estimateLessonTime(lesson: Lesson): LessonTimeEstimate {
  // Based on:
  // - Video duration (if any)
  // - Text content word count (~200 words/min)
  // - Quiz question count (~30 sec each)
  // - Interactive elements
}
```

### 2. Lesson Time Badge Component

Location: `frontend/src/components/lessons/LessonTimeBadge.tsx`

```typescript
interface LessonTimeBadgeProps {
  minutes: number
  size?: 'sm' | 'md'
}

// Displays: Clock icon + "5 min"
// Color coding:
// - Green: 5 min or less (quick)
// - Blue: 6-10 min (standard)
// - Orange: 10+ min (extended)
```

### 3. Daily Goal Settings

Location: `frontend/src/components/goals/DailyGoalSettings.tsx`

```typescript
interface DailyGoalSettingsProps {
  currentGoal: number
  suggestedGoal: number // From onboarding time_commitment
  onGoalChange: (goal: number) => void
}

// UI: Slider or numeric stepper (1-10 lessons)
// Suggestions based on time_commitment:
// - short (5-10 min/day): 1-2 lessons
// - medium (15-30 min/day): 3-4 lessons
// - flexible: 2-3 lessons
```

### 4. Daily Goal Progress Component

Location: `frontend/src/components/goals/DailyGoalProgress.tsx`

```typescript
interface DailyGoalProgressProps {
  completed: number
  goal: number
  compact?: boolean
}

// Compact (for header): Ring progress with fraction (2/5)
// Full (for dashboard):
// - Progress bar with lesson dots
// - Each completed lesson = filled dot
// - "2 more lessons to reach your goal!"
```

### 5. Goal Completion Celebration

Location: `frontend/src/components/goals/GoalCompletedModal.tsx`

```typescript
interface GoalCompletedModalProps {
  lessonsCompleted: number
  goalStreak: number // Consecutive days meeting goal
  bonusXP: number
  onContinue: () => void
  onDone: () => void
}

// Shows:
// - "🎯 Daily Goal Achieved!"
// - Bonus XP earned (+25 for meeting goal)
// - Current goal streak
// - Option to continue learning or finish for day
```

### 6. Goal Streak Tracking

Separate from learning streak:
- Learning streak: Any activity
- Goal streak: Meeting daily lesson goal

```typescript
interface GoalProgress {
  dailyGoal: number
  completedToday: number
  goalStreak: number // Days meeting goal
  lastGoalMetDate: string | null
}
```

### 7. Smart Goal Suggestions

Location: `frontend/src/utils/goalSuggestions.ts`

```typescript
function suggestDailyGoal(profile: LearnerProfile, history: LessonHistory): number {
  // Base on time_commitment
  let base = profile.timeCommitment === 'short' ? 2 :
             profile.timeCommitment === 'medium' ? 4 : 3

  // Adjust based on recent performance
  const recentAvg = calculateRecentAverage(history)
  if (recentAvg > base * 1.5) base = Math.min(base + 1, 10)
  if (recentAvg < base * 0.5) base = Math.max(base - 1, 1)

  return base
}
```

### 8. Catch-Up Feature

Location: `frontend/src/components/goals/CatchUpPrompt.tsx`

When user is behind (e.g., 0/5 at 8pm):

```typescript
// "You're a bit behind today. Want to do a quick 5-minute lesson?"
// Shows shortest available lesson
// "Skip today" option (uses streak freeze if available)
```

### 9. Backend Endpoints

Location: `backend/routes/goals.js`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/goals/daily` | GET | Get today's goal progress |
| `/api/v1/goals/daily` | PUT | Update daily goal target |
| `/api/v1/goals/complete` | POST | Record goal completion |
| `/api/v1/goals/history` | GET | Get goal achievement history |

### 10. Dashboard Integration

Add to StudentDashboard:
- Daily goal progress prominently displayed
- "Continue Learning" button leads to next lesson
- Show estimated time for next lesson

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/utils/lessonTime.ts` | Time estimation logic |
| `frontend/src/components/lessons/LessonTimeBadge.tsx` | Time display badge |
| `frontend/src/components/goals/DailyGoalSettings.tsx` | Goal configuration |
| `frontend/src/components/goals/DailyGoalProgress.tsx` | Progress display |
| `frontend/src/components/goals/GoalCompletedModal.tsx` | Celebration modal |
| `frontend/src/components/goals/CatchUpPrompt.tsx` | Behind-schedule prompt |
| `frontend/src/utils/goalSuggestions.ts` | Smart goal calculation |
| `frontend/src/stores/goalsStore.ts` | Goals state management |
| `backend/routes/goals.js` | Goals API routes |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/components/StudentDashboard.tsx` | Add goal progress widget |
| `frontend/src/components/Layout.tsx` | Add compact goal progress |
| `frontend/src/components/courses/LessonCard.tsx` | Add time badge |
| `backend/db.json` | Add goals data structure |

## Dependencies

- 01-00 (Learner profile for time_commitment)
- 01-01 (Event bus for lesson:completed events)
- 01-02 (XP for goal completion bonus)

## Blocked By

- 01-00 (Psychometric onboarding for time preference)
- 01-01 (Event bus)

## Blocks

- None

## Estimated Scope

- Components: 6 new
- Stores: 1 new
- Utils: 2 new
- Backend: 1 new
- Lines: ~500

## Visual Design

**Time Badge Colors:**
| Duration | Color | Label |
|----------|-------|-------|
| ≤5 min | Green | Quick |
| 6-10 min | Blue | Standard |
| >10 min | Orange | Extended |

**Goal Progress Ring:**
- Empty: Gray ring
- In progress: Blue filled arc
- Complete: Green with checkmark
- Exceeded: Gold with star

**Goal Celebration:**
- Confetti animation
- Bounce effect on goal badge
- XP counter animation

---
*Plan created: 2026-02-02*
