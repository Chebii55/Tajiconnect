# Plan 01-04: Streak Tracking with Freeze Protection

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Status**: Pending

## Objective

Implement daily learning streak tracking with visual streak counter, streak freeze protection, and streak-based XP bonuses to drive daily engagement.

## Requirements Addressed

- GAM-04: User maintains daily learning streak with streak counter and streak protection

## Success Criteria

- [ ] Daily streak increments on any learning activity
- [ ] Streak counter visible in header
- [ ] Streak freeze available (earn or purchase)
- [ ] Visual celebration for streak milestones (7, 30, 100 days)
- [ ] Streak at risk warning (no activity by 8pm)
- [ ] Streak history and longest streak tracking
- [ ] XP bonus based on streak length (up to 100% bonus)
- [ ] Streak recovery option within 24 hours (uses freeze)

## Technical Approach

### 1. Streak Logic

Location: `frontend/src/lib/streakEngine.ts`

```typescript
interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null // ISO date
  streakFreezes: number
  freezeUsedToday: boolean
  streakAtRisk: boolean
}

class StreakEngine {
  // Called when user completes any learning activity
  recordActivity(userId: string): StreakUpdate

  // Check if streak is at risk (called on app load and periodically)
  checkStreakStatus(userId: string): StreakStatus

  // Use a freeze to protect streak
  useFreeze(userId: string): boolean

  // Calculate XP multiplier based on streak
  getStreakMultiplier(currentStreak: number): number

  // Award freeze for milestone
  awardFreeze(userId: string, reason: string): void
}

interface StreakUpdate {
  newStreak: number
  isNewRecord: boolean
  milestone?: 7 | 30 | 100
  xpMultiplier: number
}
```

### 2. Streak Display Component

Location: `frontend/src/components/gamification/StreakDisplay.tsx`

```typescript
interface StreakDisplayProps {
  streak: number
  longestStreak: number
  freezesAvailable: number
  atRisk?: boolean
  compact?: boolean // For header vs profile view
}

// Compact: Flame icon + number
// Full: Flame + number + freeze count + longest streak
// At risk: Pulsing orange border
```

### 3. Streak Milestone Celebration

Location: `frontend/src/components/gamification/StreakMilestoneModal.tsx`

Milestones:
- 7 days: "Week Warrior!" + 1 freeze reward
- 30 days: "Month Master!" + 2 freezes + special badge
- 100 days: "Century Club!" + 5 freezes + legendary badge

### 4. Streak Warning Component

Location: `frontend/src/components/gamification/StreakWarning.tsx`

Shows when:
- Time is after 8pm local time
- No activity recorded today
- Streak > 0

```typescript
// Banner at top of dashboard
// "Your streak is at risk! Complete a lesson to keep your 15-day streak."
// Button: "Protect Streak" -> opens lesson picker
```

### 5. Freeze Management

Location: `frontend/src/components/gamification/FreezeManager.tsx`

```typescript
interface FreezeManagerProps {
  freezesAvailable: number
  canEarnMore: boolean
  onUseFreeze: () => void
}

// Shows:
// - Current freeze count with snowflake icon
// - "Use Freeze" button (if streak at risk)
// - How to earn more freezes
```

### 6. Streak Bonus Display

When earning XP, show the streak bonus:

```
+10 XP (Lesson)
+1 XP (10% streak bonus)
```

Bonus calculation:
- 1-6 days: 0% bonus
- 7-13 days: 10% bonus
- 14-29 days: 25% bonus
- 30-99 days: 50% bonus
- 100+ days: 100% bonus

### 7. Backend Endpoints

Location: `backend/routes/streaks.js`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/streaks` | GET | Get user's streak status |
| `/api/v1/streaks/activity` | POST | Record daily activity |
| `/api/v1/streaks/freeze` | POST | Use a streak freeze |
| `/api/v1/streaks/history` | GET | Get streak history |

### 8. Timezone Handling

- Store dates in UTC
- Calculate "today" based on user's local timezone
- Activity window: midnight to 11:59pm local time
- Warning trigger: 8pm local time

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/lib/streakEngine.ts` | Streak calculation logic |
| `frontend/src/components/gamification/StreakDisplay.tsx` | Streak counter |
| `frontend/src/components/gamification/StreakMilestoneModal.tsx` | Milestone celebration |
| `frontend/src/components/gamification/StreakWarning.tsx` | At-risk banner |
| `frontend/src/components/gamification/FreezeManager.tsx` | Freeze UI |
| `backend/routes/streaks.js` | Streak API routes |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/stores/gamificationStore.ts` | Add streak state |
| `frontend/src/components/Layout.tsx` | Add StreakDisplay to header |
| `frontend/src/lib/eventBus.ts` | Add streak:updated event |
| `frontend/src/utils/xpCalculator.ts` | Integrate streak multiplier |
| `backend/db.json` | Add streak data structure |

## Dependencies

- 01-01 (Event bus for streak events)
- 01-02 (XP system for streak bonuses)

## Blocked By

- 01-01 (Event bus)
- 01-02 (XP calculator)

## Blocks

- 01-03 (Streak badges depend on streak tracking)

## Estimated Scope

- Components: 5 new
- Logic: 1 new
- Backend: 1 new
- Lines: ~450

## Visual Design

**Streak Display:**
- Flame emoji 🔥 or custom icon
- Orange/red gradient for high streaks
- Ice blue when freeze is active

**At Risk State:**
- Pulsing orange border
- Warning icon overlay
- "⚠️ At Risk" text

**Milestone Celebrations:**
- 7 days: Blue confetti
- 30 days: Gold confetti + fireworks
- 100 days: Rainbow confetti + special animation

---
*Plan created: 2026-02-02*
