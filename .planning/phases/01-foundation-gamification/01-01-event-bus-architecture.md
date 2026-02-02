# Plan 01-01: Event Bus and State Architecture

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Completed**: 2026-02-02
**Status**: Complete
**Summary**: See 01-01-SUMMARY.md

## Objective

Implement event bus pattern for cross-feature communication and migrate feature state to Zustand stores, keeping React Context for app-wide state (theme, auth).

## Requirements Addressed

- INF-03: Event bus architecture for cross-feature communication

## Success Criteria

- [x] Event bus enables decoupled feature communication
- [x] Zustand store for gamification state (XP, level, badges, streaks)
- [x] Zustand store for user preferences and profile
- [x] React Context preserved for theme and auth (app-wide concerns)
- [x] Type-safe event definitions
- [x] DevTools integration for debugging

## Technical Approach

### 1. Event Bus Implementation

Location: `frontend/src/lib/eventBus.ts`

Pattern: Typed publish/subscribe with event registry

```typescript
type EventMap = {
  'xp:earned': { amount: number; source: string; lessonId?: string }
  'level:up': { newLevel: number; previousLevel: number }
  'badge:unlocked': { badgeId: string; badgeName: string }
  'streak:updated': { currentStreak: number; isNewRecord: boolean }
  'lesson:completed': { lessonId: string; courseId: string; score: number }
  'quiz:completed': { quizId: string; score: number; passed: boolean }
  'daily:login': { date: string; consecutiveDays: number }
}

class EventBus {
  private listeners: Map<keyof EventMap, Set<Function>>

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void
  on<K extends keyof EventMap>(event: K, callback: (payload: EventMap[K]) => void): () => void
  off<K extends keyof EventMap>(event: K, callback: Function): void
}

export const eventBus = new EventBus()
```

### 2. Zustand Store: Gamification

Location: `frontend/src/stores/gamificationStore.ts`

```typescript
interface GamificationState {
  // XP & Levels
  currentXP: number
  totalXP: number
  level: number
  xpToNextLevel: number

  // Streaks
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number

  // Badges
  unlockedBadges: string[]
  recentBadge: Badge | null

  // Actions
  addXP: (amount: number, source: string) => void
  checkStreak: () => void
  useStreakFreeze: () => boolean
  unlockBadge: (badgeId: string) => void

  // Sync
  loadFromServer: () => Promise<void>
  persistToServer: () => Promise<void>
}
```

### 3. Zustand Store: User Profile

Location: `frontend/src/stores/userProfileStore.ts`

Includes learner profile from psychometric onboarding.

```typescript
interface UserProfileState {
  profile: LearnerProfile | null
  preferences: UserPreferences

  setProfile: (profile: LearnerProfile) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  loadFromServer: () => Promise<void>
}
```

### 4. Event-Gamification Integration

The gamification store listens to events and updates state:

```typescript
// In gamificationStore initialization
eventBus.on('lesson:completed', ({ score }) => {
  const xp = calculateLessonXP(score)
  get().addXP(xp, 'lesson')
})

eventBus.on('quiz:completed', ({ score, passed }) => {
  if (passed) {
    const xp = calculateQuizXP(score)
    get().addXP(xp, 'quiz')
  }
})
```

### 5. XP Calculation Logic

Location: `frontend/src/utils/xpCalculator.ts`

```typescript
const XP_VALUES = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 25,
  QUIZ_PERFECT: 50,
  DAILY_LOGIN: 5,
  STREAK_BONUS_MULTIPLIER: 0.1, // +10% per streak day (max 100%)
}

function calculateLessonXP(score: number): number
function calculateQuizXP(score: number, isPerfect: boolean): number
function applyStreakBonus(baseXP: number, streakDays: number): number
```

### 6. Level Progression System

Location: `frontend/src/utils/levelSystem.ts`

```typescript
// XP required per level (exponential growth with diminishing returns)
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNext: number }
```

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/lib/eventBus.ts` | Typed event bus singleton |
| `frontend/src/stores/gamificationStore.ts` | XP, levels, streaks, badges state |
| `frontend/src/stores/userProfileStore.ts` | User profile and preferences |
| `frontend/src/utils/xpCalculator.ts` | XP calculation logic |
| `frontend/src/utils/levelSystem.ts` | Level progression formulas |
| `frontend/src/types/gamification.ts` | Shared gamification types |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/package.json` | Add zustand dependency |
| `frontend/src/App.tsx` | Initialize stores on mount |

## Dependencies

- zustand (to be installed)

## Blocked By

- None (first implementation plan)

## Blocks

- 01-02 (XP points system)
- 01-03 (Badge system)
- 01-04 (Streak tracking)
- 01-05 (Leaderboard)

## Estimated Scope

- Core files: 6 new
- Package: 1 dependency
- Lines: ~400

## Design Decisions

1. **Why Zustand over Context for gamification?**
   - More granular subscriptions (components only re-render on used slices)
   - Built-in devtools support
   - Simpler async actions
   - Better for frequently-changing state (XP updates)

2. **Why keep Context for theme/auth?**
   - Infrequent changes
   - Already working well
   - No performance concern

3. **Why event bus?**
   - Decouples lesson/quiz components from gamification logic
   - Allows features to react without direct imports
   - Easier to add new event handlers

---
*Plan created: 2026-02-02*
*Plan completed: 2026-02-02*
