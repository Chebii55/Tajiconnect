# Plan 01-02: XP Points System and Level Progression

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Status**: Pending

## Objective

Implement XP earning for all learning activities with visual level progression (30-50 levels), XP animations, and persistent tracking.

## Requirements Addressed

- GAM-01: User earns XP points for all learning activities (lesson completion, quizzes, daily logins)
- GAM-02: User levels up as XP accumulates with visual level progression (30-50 levels)

## Success Criteria

- [ ] XP earned for: lesson completion, quiz completion, daily login
- [ ] XP amount varies by activity type and performance
- [ ] Level progression with 40 levels (balanced growth curve)
- [ ] Visual XP gain animation (floating +XP indicator)
- [ ] Level-up celebration modal with confetti
- [ ] XP and level displayed in header/profile
- [ ] Progress bar shows XP to next level
- [ ] XP history viewable by user

## Technical Approach

### 1. XP Earning Events

Trigger points in existing components:

| Event | XP Base | Bonus Conditions |
|-------|---------|------------------|
| Lesson complete | 10 XP | +5 for first attempt |
| Quiz pass (≥70%) | 25 XP | +25 for perfect score |
| Daily login | 5 XP | Streak multiplier applies |
| Course complete | 100 XP | - |

### 2. XP Animation Component

Location: `frontend/src/components/gamification/XPGainIndicator.tsx`

```typescript
interface XPGainIndicatorProps {
  amount: number
  position: { x: number; y: number }
  onComplete: () => void
}

// Animated +XP that floats up and fades out
// Uses Tailwind animation classes
```

### 3. Level Progress Display

Location: `frontend/src/components/gamification/LevelProgress.tsx`

```typescript
interface LevelProgressProps {
  level: number
  currentXP: number
  xpToNextLevel: number
  showDetails?: boolean // Expanded view with history
}

// Compact: Circle with level number + progress ring
// Expanded: Full progress bar with XP numbers
```

### 4. Level-Up Celebration

Location: `frontend/src/components/gamification/LevelUpModal.tsx`

```typescript
interface LevelUpModalProps {
  newLevel: number
  unlockedRewards?: Reward[]
  onClose: () => void
}

// Full-screen modal with:
// - Confetti animation
// - New level badge
// - Any unlocked rewards
// - "Continue" button
```

### 5. Header Integration

Modify existing header to show:
- Current level (circular badge)
- XP progress ring around level badge
- Clicking opens detailed progress view

### 6. XP History

Location: `frontend/src/components/gamification/XPHistory.tsx`

```typescript
interface XPHistoryEntry {
  id: string
  amount: number
  source: 'lesson' | 'quiz' | 'login' | 'course' | 'bonus'
  sourceId?: string
  sourceName?: string
  earnedAt: Date
}

// List view with filtering by date/source
// Shows running total
```

### 7. Backend Endpoints

Location: `backend/routes/gamification.js`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/gamification/xp` | GET | Get user's XP and level |
| `/api/v1/gamification/xp` | POST | Record XP gain |
| `/api/v1/gamification/xp/history` | GET | Get XP history |
| `/api/v1/gamification/level-check` | POST | Check for level-up |

### 8. Level System Constants

40 levels with exponential curve:

| Level Range | XP per Level | Total XP at Max |
|-------------|--------------|-----------------|
| 1-10 | 100-500 | ~2,500 |
| 11-20 | 550-1,200 | ~10,000 |
| 21-30 | 1,300-2,500 | ~25,000 |
| 31-40 | 2,700-5,000 | ~60,000 |

Formula: `xpForLevel(n) = floor(100 * n^1.5)`

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/components/gamification/XPGainIndicator.tsx` | Floating +XP animation |
| `frontend/src/components/gamification/LevelProgress.tsx` | Level display with progress |
| `frontend/src/components/gamification/LevelUpModal.tsx` | Level-up celebration |
| `frontend/src/components/gamification/XPHistory.tsx` | XP earnings history |
| `frontend/src/hooks/useXPAnimation.ts` | Hook for triggering XP animations |
| `backend/routes/gamification.js` | Gamification API routes |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/components/Layout.tsx` | Add LevelProgress to header |
| `frontend/src/stores/gamificationStore.ts` | Implement addXP with level-check |
| `frontend/src/lib/eventBus.ts` | Ensure xp:earned event triggers animation |
| `backend/server.js` | Register gamification routes |
| `backend/db.json` | Add gamification data structure |

## Dependencies

- 01-01 (Event bus and Zustand store)
- 01-00 (Learner profile for streak bonus calculation)

## Blocked By

- 01-01 (Event bus must exist)

## Blocks

- 01-03 (Badges can award bonus XP)
- 01-05 (Leaderboard ranks by XP)

## Estimated Scope

- Components: 4 new
- Hooks: 1 new
- Backend routes: 1 new file
- Lines: ~500

## Animation Specifications

**XP Gain Animation:**
- Duration: 1.5s
- Movement: Float up 50px while fading
- Color: Gold (#FFD700)
- Font: Bold, slightly larger than body

**Level-Up Modal:**
- Entry: Scale from 0.8 to 1.0 with opacity fade
- Confetti: 100 particles, 3s duration
- Exit: Fade out over 0.3s

**Progress Ring:**
- Smooth transition on XP gain (0.5s ease-out)
- Pulse animation when near level-up (within 10%)

---
*Plan created: 2026-02-02*
