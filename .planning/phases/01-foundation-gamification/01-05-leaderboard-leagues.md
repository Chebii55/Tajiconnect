# Plan 01-05: Leaderboard with Leagues and Opt-Out

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Status**: Pending

## Objective

Implement weekly leaderboards with tiered leagues (Bronze/Silver/Gold/Diamond) for competitive users, with easy opt-out for those who prefer non-competitive learning.

## Requirements Addressed

- GAM-05: User competes on weekly leaderboards with league tiers (Bronze/Silver/Gold/Diamond)
- GAM-06: User can opt out of competitive leaderboards

## Success Criteria

- [ ] Weekly leaderboard resets every Monday
- [ ] 4 league tiers with promotion/demotion
- [ ] Top 10, 25, 50% promote to next league
- [ ] Bottom 25% demote to lower league
- [ ] Leaderboard shows user's rank and nearby competitors
- [ ] League badge displayed on profile
- [ ] Opt-out toggle in settings
- [ ] Opted-out users see personal progress only

## Technical Approach

### 1. League System Design

**Leagues:**
| League | Entry Requirement | Promotion | Demotion |
|--------|-------------------|-----------|----------|
| Bronze | Default start | Top 50% → Silver | None |
| Silver | Promoted from Bronze | Top 25% → Gold | Bottom 25% → Bronze |
| Gold | Promoted from Silver | Top 10% → Diamond | Bottom 25% → Silver |
| Diamond | Promoted from Gold | Stay if top 50% | Bottom 50% → Gold |

**Weekly XP Tracking:**
- Separate from total XP
- Resets Monday 00:00 UTC
- Only XP earned during week counts

### 2. Leaderboard Data Model

Location: `frontend/src/types/leaderboard.ts`

```typescript
interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarUrl?: string
  weeklyXP: number
  league: 'bronze' | 'silver' | 'gold' | 'diamond'
  trend: 'up' | 'down' | 'same' // vs yesterday
  isCurrentUser: boolean
}

interface LeaderboardState {
  league: League
  entries: LeaderboardEntry[]
  userRank: number
  totalInLeague: number
  promotionZone: boolean
  demotionZone: boolean
  timeUntilReset: number // seconds
}
```

### 3. Leaderboard Component

Location: `frontend/src/components/gamification/Leaderboard.tsx`

```typescript
interface LeaderboardProps {
  userId: string
}

// Features:
// - League selector (show other leagues, grayed out)
// - User's current position highlighted
// - Top 3 with medal icons
// - Promotion zone highlighted green
// - Demotion zone highlighted red
// - "You" indicator for current user
// - Pull to refresh
```

### 4. League Badge Component

Location: `frontend/src/components/gamification/LeagueBadge.tsx`

```typescript
interface LeagueBadgeProps {
  league: 'bronze' | 'silver' | 'gold' | 'diamond'
  size: 'sm' | 'md' | 'lg'
}

// Visual: Shield/crest shape with league icon
// Colors match league tier
```

### 5. Leaderboard Preview Widget

Location: `frontend/src/components/gamification/LeaderboardPreview.tsx`

For dashboard - shows:
- User's rank (e.g., "#23 in Silver")
- XP to next rank
- XP to promotion zone
- "View Full Leaderboard" link

### 6. Opt-Out Flow

Location: `frontend/src/components/settings/LeaderboardSettings.tsx`

```typescript
// Toggle: "Compete on leaderboards"
// Description: "When disabled, you won't appear on leaderboards
//              and won't see competitive rankings."
// Confirmation dialog if opting out mid-week
```

When opted out:
- User removed from leaderboard calculations
- Personal stats still tracked
- Shows "Personal Mode" instead of league badge
- Dashboard shows personal weekly progress, not rank

### 7. Weekly Reset Logic

Location: `backend/services/leaderboardService.js`

```javascript
// Scheduled job (Monday 00:00 UTC):
async function processWeeklyReset() {
  // 1. Calculate final standings per league
  // 2. Determine promotions/demotions
  // 3. Update user league assignments
  // 4. Archive week's data
  // 5. Reset weekly XP counters
  // 6. Send promotion/demotion notifications
}
```

### 8. Backend Endpoints

Location: `backend/routes/leaderboard.js`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/leaderboard` | GET | Get user's league leaderboard |
| `/api/v1/leaderboard/:league` | GET | Get specific league (if allowed) |
| `/api/v1/leaderboard/opt-out` | POST | Toggle opt-out status |
| `/api/v1/leaderboard/history` | GET | Get past week results |

### 9. Real-Time Updates (Optional Enhancement)

If WebSocket available (Phase 8):
- Live rank updates as others earn XP
- Celebration when user overtakes someone

For now: Poll every 5 minutes when leaderboard is visible.

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/types/leaderboard.ts` | Leaderboard types |
| `frontend/src/components/gamification/Leaderboard.tsx` | Full leaderboard view |
| `frontend/src/components/gamification/LeagueBadge.tsx` | League tier badge |
| `frontend/src/components/gamification/LeaderboardPreview.tsx` | Dashboard widget |
| `frontend/src/components/settings/LeaderboardSettings.tsx` | Opt-out toggle |
| `frontend/src/hooks/useLeaderboard.ts` | Leaderboard data hook |
| `backend/routes/leaderboard.js` | Leaderboard API |
| `backend/services/leaderboardService.js` | Weekly reset logic |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/stores/gamificationStore.ts` | Add weeklyXP, league state |
| `frontend/src/components/StudentDashboard.tsx` | Add LeaderboardPreview |
| `backend/db.json` | Add leaderboard data structure |

## Dependencies

- 01-01 (Event bus for XP events)
- 01-02 (XP system for weekly tracking)

## Blocked By

- 01-02 (XP system must exist)

## Blocks

- None

## Estimated Scope

- Components: 5 new
- Hooks: 1 new
- Backend: 2 new
- Lines: ~550

## Visual Design

**League Colors:**
| League | Primary | Secondary | Icon |
|--------|---------|-----------|------|
| Bronze | #CD7F32 | #8B4513 | 🥉 |
| Silver | #C0C0C0 | #A9A9A9 | 🥈 |
| Gold | #FFD700 | #DAA520 | 🥇 |
| Diamond | #B9F2FF | #00CED1 | 💎 |

**Promotion Zone:**
- Light green background
- "↑ Promotion Zone" label

**Demotion Zone:**
- Light red background
- "↓ Demotion Zone" label

---
*Plan created: 2026-02-02*
