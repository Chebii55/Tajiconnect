# Roadmap: TajiConnect LMS v2.0

## Overview

Transform TajiConnect from a solid LMS foundation into a world-class AI-powered learning platform. This roadmap prioritizes engagement first (gamification), then AI enhancement (tutor, spaced repetition), social features, analytics, and finally mobile excellence. Each phase delivers complete, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Gamification** - Core engagement engine with XP, levels, badges, streaks, leaderboards
- [ ] **Phase 2: Interactive Content** - Enhanced video player with chapters, bookmarks, in-video quizzes
- [ ] **Phase 3: AI Tutor** - 24/7 contextual AI assistant with Socratic method
- [ ] **Phase 4: Spaced Repetition** - SM-2 algorithm flashcard system for long-term retention
- [ ] **Phase 5: Social & Collaborative** - Discussion forums, peer review, cohort learning
- [ ] **Phase 6: Analytics & Insights** - Learner/admin dashboards, predictive analytics, ROI tracking
- [ ] **Phase 7: Mobile Excellence** - PWA, offline learning, push notifications, Safari handling
- [ ] **Phase 8: Technical Infrastructure** - xAPI/LRS integration, WebSocket real-time

## Phase Details

### Phase 1: Foundation & Gamification
**Goal**: Users engage with a complete gamification engine that drives daily learning habits
**Depends on**: Nothing (first phase)
**Requirements**: GAM-01, GAM-02, GAM-03, GAM-04, GAM-05, GAM-06, MIC-01, MIC-02, MIC-03, INF-03
**Success Criteria** (what must be TRUE):
  1. User earns XP points when completing lessons and quizzes
  2. User sees their level and progress to next level
  3. User earns badges for meaningful milestones
  4. User maintains and views daily streak with protection
  5. User can view and compete on weekly leaderboards (with opt-out)
  6. Lessons are structured as 5-10 minute modules with daily goals
**Research**: Unlikely (established patterns from Duolingo case study)
**Plans**: 7 plans (includes psychometric onboarding from design doc)

Plans:
- [ ] 01-00: Psychometric onboarding enhancement (Template A - 90 seconds)
- [ ] 01-01: Event bus and state architecture (Zustand migration)
- [ ] 01-02: XP points system and level progression
- [ ] 01-03: Badge system with unlock conditions
- [ ] 01-04: Streak tracking with freeze protection
- [ ] 01-05: Leaderboard with leagues and opt-out
- [ ] 01-06: Microlearning structure and daily goals

### Phase 2: Interactive Content
**Goal**: Videos become active learning experiences, not passive watching
**Depends on**: Phase 1
**Requirements**: VID-01, VID-02, VID-03
**Success Criteria** (what must be TRUE):
  1. User can navigate videos using chapter markers
  2. User can bookmark moments in videos
  3. User answers quizzes embedded within videos
  4. Video progress is saved and resumable
**Research**: Likely (H5P integration)
**Research topics**: H5P React integration, interactive video standards, custom player vs H5P
**Plans**: TBD

Plans:
- [ ] 02-01: Interactive video player with chapters/bookmarks
- [ ] 02-02: In-video quiz system

### Phase 3: AI Tutor
**Goal**: Every learner has a 24/7 AI tutor that guides without giving answers
**Depends on**: Phase 1 (event bus for gamification integration)
**Requirements**: TUT-01, TUT-02, TUT-03, TUT-04, TUT-05, ADP-01, ADP-02, ADP-03
**Success Criteria** (what must be TRUE):
  1. User can ask AI tutor questions from any lesson
  2. AI tutor knows current learning context
  3. AI tutor guides with questions, doesn't give direct answers
  4. Conversation history persists across sessions
  5. Usage limits prevent cost explosion
  6. Pre-assessment places users at correct starting point
  7. Difficulty adapts based on performance
**Research**: Likely (Claude API, RAG, streaming)
**Research topics**: Claude API streaming, RAG implementation, prompt engineering for Socratic method, cost optimization
**Plans**: TBD

Plans:
- [ ] 03-01: AI tutor infrastructure (API gateway, rate limiting, caching)
- [ ] 03-02: Chat UI with streaming responses
- [ ] 03-03: Context awareness and conversation history
- [ ] 03-04: Pre-assessment and adaptive difficulty

### Phase 4: Spaced Repetition
**Goal**: Learners retain knowledge long-term through scientifically-scheduled review
**Depends on**: Phase 1 (gamification points for reviews)
**Requirements**: SRS-01, SRS-02, SRS-03, SRS-04, SRS-05
**Success Criteria** (what must be TRUE):
  1. Flashcards are generated from course content
  2. Review schedule adapts to user's recall performance
  3. Daily review queue is manageable (capped, not overwhelming)
  4. User rates difficulty and system responds accordingly
  5. User sees retention analytics
**Research**: Likely (SM-2 algorithm)
**Research topics**: SM-2 vs FSRS algorithm, supermemo npm package, ease hell prevention
**Plans**: TBD

Plans:
- [ ] 04-01: Flashcard data model and auto-generation
- [ ] 04-02: SM-2 scheduling engine with ease floor
- [ ] 04-03: Review queue UI with difficulty ratings
- [ ] 04-04: Retention analytics

### Phase 5: Social & Collaborative
**Goal**: Learning becomes social with discussions, peer feedback, and cohort communities
**Depends on**: Phase 1 (gamification points for participation)
**Requirements**: FOR-01, FOR-02, FOR-03, FOR-04, PRV-01, PRV-02, PRV-03, PRV-04, COH-01, COH-02, COH-03, COH-04
**Success Criteria** (what must be TRUE):
  1. Each course has a discussion forum with threaded posts
  2. Users can upvote and @mention in discussions
  3. Trainers can create peer review assignments with rubrics
  4. Users submit, review, and receive anonymous peer feedback
  5. Cohorts have enrollment windows and shared deadlines
  6. Cohort members see relative progress
**Research**: Unlikely (standard forum patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: Discussion forums with threading
- [ ] 05-02: Upvoting and mentions
- [ ] 05-03: Peer review system with rubrics
- [ ] 05-04: Cohort creation and management
- [ ] 05-05: Cohort progress and deadlines

### Phase 6: Analytics & Insights
**Goal**: Data drives decisions for learners, trainers, and admins
**Depends on**: Phases 1-5 (data to analyze)
**Requirements**: ANA-01, ANA-02, ANA-03, PRD-01, PRD-02, PRD-03, ROI-01, ROI-02, ROI-03
**Success Criteria** (what must be TRUE):
  1. Learners see personal progress dashboards
  2. Admins see aggregate enrollment and engagement metrics
  3. System predicts completion likelihood for at-risk learners
  4. Admins receive intervention alerts
  5. ROI reports show skill improvement and career outcomes
**Research**: Likely (predictive models, visualization)
**Research topics**: Churn prediction models, D3/Recharts for dashboards, analytics data pipeline
**Plans**: TBD

Plans:
- [ ] 06-01: Learner analytics dashboard
- [ ] 06-02: Admin analytics dashboard
- [ ] 06-03: Predictive analytics for at-risk learners
- [ ] 06-04: ROI measurement and reporting

### Phase 7: Mobile Excellence
**Goal**: Learning works perfectly offline, especially in low-connectivity African markets
**Depends on**: Phase 1 (offline sync for gamification)
**Requirements**: PWA-01, PWA-02, PWA-03, PWA-04, PWA-05, PWA-06
**Success Criteria** (what must be TRUE):
  1. App is installable as PWA on mobile
  2. Static assets and API responses are cached
  3. Push notifications remind users about streaks and updates
  4. Users can download courses for offline learning
  5. Progress syncs when coming back online (no data loss)
  6. Safari 7-day eviction is handled gracefully
**Research**: Likely (service workers, IndexedDB, Safari handling)
**Research topics**: vite-plugin-pwa, Dexie.js, background sync, Safari storage limits
**Plans**: TBD

Plans:
- [ ] 07-01: PWA manifest and service worker setup
- [ ] 07-02: IndexedDB storage with Dexie.js
- [ ] 07-03: Push notification infrastructure
- [ ] 07-04: Offline course download
- [ ] 07-05: Sync queue and conflict resolution
- [ ] 07-06: Safari eviction handling

### Phase 8: Technical Infrastructure
**Goal**: Platform integrates with learning ecosystem standards and supports real-time features
**Depends on**: Phases 1-7 (learning data to standardize)
**Requirements**: INF-01, INF-02
**Success Criteria** (what must be TRUE):
  1. Learning events are recorded in xAPI/LRS format
  2. Real-time presence and notifications work via WebSocket
**Research**: Likely (xAPI spec, WebSocket at scale)
**Research topics**: xAPI statement format, LRS options, WebSocket with Socket.io vs native
**Plans**: TBD

Plans:
- [ ] 08-01: xAPI/LRS integration
- [ ] 08-02: WebSocket infrastructure

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Gamification | 0/7 | Planned | - |
| 2. Interactive Content | 0/2 | Not started | - |
| 3. AI Tutor | 0/4 | Not started | - |
| 4. Spaced Repetition | 0/4 | Not started | - |
| 5. Social & Collaborative | 0/5 | Not started | - |
| 6. Analytics & Insights | 0/4 | Not started | - |
| 7. Mobile Excellence | 0/6 | Not started | - |
| 8. Technical Infrastructure | 0/2 | Not started | - |

**Total:** 0/34 plans complete
