# Plan 01-01: Event Bus and State Architecture - COMPLETED

**Completed**: 2026-02-02
**Duration**: ~30 minutes
**Status**: Complete

## Deliverables

### Files Created

| File | Purpose | Commit |
|------|---------|--------|
| `frontend/src/types/gamification.ts` | Shared gamification types, EventMap | 144643c |
| `frontend/src/lib/eventBus.ts` | Typed pub/sub event bus singleton | d2cd95f |
| `frontend/src/utils/xpCalculator.ts` | XP calculation logic with streak bonuses | 23dcdb6 |
| `frontend/src/utils/levelSystem.ts` | Level progression formulas (100 * level^1.5) | 23dcdb6 |
| `frontend/src/stores/gamificationStore.ts` | Zustand store for XP, levels, streaks, badges | e0c334b |
| `frontend/src/stores/userProfileStore.ts` | Zustand store for learner profile & preferences | e0c334b |

### Files Modified

| File | Changes | Commit |
|------|---------|--------|
| `frontend/package.json` | Added zustand dependency | 6bd9006 |
| `frontend/src/App.tsx` | Added StoreInitializer component | ccd7ec8 |

### Dependencies Added

- `zustand@5.0.11` - State management with devtools and persistence

## Implementation Details

### Event Bus (`eventBus.ts`)

Type-safe pub/sub pattern enabling decoupled feature communication:

```typescript
eventBus.on('lesson:completed', ({ lessonId, score }) => {
  // Gamification store reacts without direct imports
})

eventBus.emit('xp:earned', { amount: 25, source: 'quiz' })
```

**Events Defined:**
- `xp:earned` - XP awarded for any activity
- `level:up` - Level threshold crossed
- `badge:unlocked` - New badge earned
- `streak:updated` - Streak count changed
- `streak:broken` - Streak reset to zero
- `lesson:completed` - Lesson finished
- `quiz:completed` - Quiz submitted
- `daily:login` - First activity of the day
- `goal:achieved` - Daily/weekly goal met
- `profile:updated` - User profile changed

### Gamification Store (`gamificationStore.ts`)

Zustand store with:
- XP and level tracking with automatic level-up detection
- Streak management with freeze support
- Badge collection with rarity-based XP rewards
- LocalStorage persistence via `zustand/persist`
- DevTools integration via `zustand/devtools`
- Event bus listeners for lesson/quiz completion

### User Profile Store (`userProfileStore.ts`)

Zustand store with:
- Learner profile from psychometric assessment
- User preferences (notifications, display, goals)
- Archetype-based recommendation helper
- Server sync placeholders

### XP Calculator (`xpCalculator.ts`)

```typescript
XP_VALUES = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 25,
  QUIZ_PERFECT: 50,
  DAILY_LOGIN: 5,
  // Milestone bonuses...
}

// Streak bonus: +10% per day, max 100%
// Score multipliers: 2x perfect, 1.5x excellent, 1.2x good
```

### Level System (`levelSystem.ts`)

```typescript
// XP required per level: 100 * level^1.5
// Level 1: 100 XP
// Level 5: 1118 XP
// Level 10: 3162 XP
// Level 50: 35355 XP

// Titles: Newcomer -> Apprentice -> Learner -> ... -> Legend
```

## Commit History

```
ccd7ec8 feat(01-01): initialize gamification stores on app mount
e0c334b feat(01-01): implement Zustand stores for gamification and user profile
23dcdb6 feat(01-01): add XP calculator and level progression utilities
d2cd95f feat(01-01): implement typed event bus for cross-feature communication
144643c feat(01-01): add gamification type definitions
6bd9006 feat(01-01): add zustand state management dependency
```

## Success Criteria Met

- [x] Event bus enables decoupled feature communication
- [x] Zustand store for gamification state (XP, level, badges, streaks)
- [x] Zustand store for user preferences and profile
- [x] React Context preserved for theme and auth (app-wide concerns)
- [x] Type-safe event definitions
- [x] DevTools integration for debugging

## Design Decisions

1. **Zustand over Context for gamification** - More granular subscriptions, built-in devtools, simpler async
2. **Event bus pattern** - Decouples lesson/quiz from gamification, easier to extend
3. **LocalStorage persistence** - Offline-first approach, server sync when ready
4. **Debug mode in dev** - Event history and console logging for easier debugging

## Next Steps

This plan unblocks:
- **01-02**: XP Points & Levels UI (uses gamificationStore)
- **01-03**: Badge System (uses badge types and unlockBadge action)
- **01-04**: Streak Tracking UI (uses streak state and events)
- **01-05**: Leaderboard (uses totalXP for ranking)
- **01-06**: Microlearning & Goals (uses goal preferences)

## Testing Notes

To test event bus and stores in browser console:
```javascript
// Access event bus
window.__eventBus.emit('lesson:completed', { lessonId: 'test', courseId: 'test', score: 95, timeSpent: 300 })

// Access stores (via React DevTools or Zustand devtools extension)
```
