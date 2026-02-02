# Plan 01-03: Badge System with Unlock Conditions

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Status**: Pending

## Objective

Implement a meaningful badge system with 15-20 badges that recognize genuine milestones, not trivial actions. Badges should feel earned and special.

## Requirements Addressed

- GAM-03: User earns meaningful badges for milestones (15-20 badges with clear criteria)

## Success Criteria

- [ ] 18 badges defined with clear unlock criteria
- [ ] 4 rarity tiers: Common, Rare, Epic, Legendary
- [ ] Badge unlock notifications with celebration
- [ ] Badge showcase on user profile
- [ ] Hidden badges (discovered on unlock)
- [ ] Badge progress tracking for partial completion
- [ ] Badges persist to backend

## Technical Approach

### 1. Badge Definitions

Location: `frontend/src/data/badges.ts`

18 badges across 4 categories:

**Learning Milestones (5 badges):**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| First Steps | Complete first lesson | Common |
| Course Conqueror | Complete first course | Rare |
| Polyglot Path | Start learning 2nd language | Rare |
| Knowledge Seeker | Complete 10 courses | Epic |
| Master Scholar | Complete 25 courses | Legendary |

**Consistency (4 badges):**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Getting Started | 3-day streak | Common |
| Week Warrior | 7-day streak | Rare |
| Month Master | 30-day streak | Epic |
| Century Club | 100-day streak | Legendary |

**Performance (5 badges):**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Quick Learner | 3 perfect quizzes | Common |
| Sharp Mind | 10 perfect quizzes | Rare |
| Flawless | Complete a course with all perfect quizzes | Epic |
| Speed Demon | Complete lesson in under 3 minutes | Rare |
| Night Owl | Complete 10 lessons after 10pm | Common (Hidden) |

**Social & Engagement (4 badges):**
| Badge | Criteria | Rarity |
|-------|----------|--------|
| Early Bird | Login before 6am, 5 times | Common (Hidden) |
| Level 10 | Reach level 10 | Rare |
| Level 25 | Reach level 25 | Epic |
| Level 40 | Reach level 40 | Legendary |

### 2. Badge Unlock Engine

Location: `frontend/src/lib/badgeEngine.ts`

```typescript
interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string // Emoji or icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'learning' | 'consistency' | 'performance' | 'engagement'
  hidden: boolean
  criteria: BadgeCriteria
}

interface BadgeCriteria {
  type: 'count' | 'streak' | 'level' | 'time' | 'composite'
  metric: string
  threshold: number
  conditions?: BadgeCriteria[]
}

class BadgeEngine {
  checkUnlocks(userId: string, event: GameEvent): Badge[]
  getProgress(userId: string, badgeId: string): number // 0-100%
  getUnlockedBadges(userId: string): Badge[]
  getAllBadges(showHidden: boolean): BadgeDefinition[]
}
```

### 3. Badge Unlock Notification

Location: `frontend/src/components/gamification/BadgeUnlockModal.tsx`

```typescript
interface BadgeUnlockModalProps {
  badge: Badge
  onClose: () => void
}

// Features:
// - Rarity-colored border/glow
// - Badge icon prominently displayed
// - Badge name and description
// - "First to unlock" indicator if applicable
// - Share button (future)
```

### 4. Badge Showcase

Location: `frontend/src/components/gamification/BadgeShowcase.tsx`

```typescript
interface BadgeShowcaseProps {
  userId: string
  displayMode: 'grid' | 'list'
  showLocked?: boolean
}

// Grid view: 4 columns, badge icons with name on hover
// Locked badges: Grayed out silhouette
// Hidden badges: ? icon until unlocked
// Click opens detail modal
```

### 5. Badge Detail Modal

Location: `frontend/src/components/gamification/BadgeDetailModal.tsx`

Shows:
- Full badge artwork
- Name and description
- Rarity with color indicator
- Unlock date (if unlocked)
- Progress bar (if not unlocked)
- How to unlock (if not hidden)

### 6. Event Listeners for Badge Checks

In gamification store, after relevant events:

```typescript
eventBus.on('lesson:completed', () => badgeEngine.checkUnlocks('lesson'))
eventBus.on('quiz:completed', () => badgeEngine.checkUnlocks('quiz'))
eventBus.on('streak:updated', () => badgeEngine.checkUnlocks('streak'))
eventBus.on('level:up', () => badgeEngine.checkUnlocks('level'))
```

### 7. Backend Storage

Location: `backend/routes/badges.js`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/badges` | GET | Get all badge definitions |
| `/api/v1/badges/user` | GET | Get user's unlocked badges |
| `/api/v1/badges/unlock` | POST | Record badge unlock |
| `/api/v1/badges/:id/progress` | GET | Get progress toward badge |

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/data/badges.ts` | Badge definitions (18 badges) |
| `frontend/src/lib/badgeEngine.ts` | Badge unlock logic |
| `frontend/src/components/gamification/BadgeUnlockModal.tsx` | Unlock celebration |
| `frontend/src/components/gamification/BadgeShowcase.tsx` | Profile badge display |
| `frontend/src/components/gamification/BadgeDetailModal.tsx` | Badge information |
| `frontend/src/components/gamification/BadgeCard.tsx` | Individual badge display |
| `backend/routes/badges.js` | Badge API routes |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/stores/gamificationStore.ts` | Add badge state and unlock tracking |
| `frontend/src/lib/eventBus.ts` | Add badge:unlocked event |
| `frontend/src/components/achievements/Achievements.tsx` | Replace mock data with real badges |
| `backend/db.json` | Add badges data structure |

## Dependencies

- 01-01 (Event bus for badge check triggers)
- 01-02 (Level events for level-based badges)

## Blocked By

- 01-01 (Event bus)
- 01-02 (XP/Level system for level badges)

## Blocks

- None directly

## Estimated Scope

- Components: 5 new
- Data/Logic: 2 new
- Backend: 1 new
- Lines: ~600

## Rarity Visual Design

| Rarity | Border Color | Glow | Background |
|--------|--------------|------|------------|
| Common | Gray (#9CA3AF) | None | Gray-50 |
| Rare | Blue (#3B82F6) | Subtle blue | Blue-50 |
| Epic | Purple (#8B5CF6) | Medium purple | Purple-50 |
| Legendary | Gold (#F59E0B) | Strong gold | Amber-50 |

---
*Plan created: 2026-02-02*
