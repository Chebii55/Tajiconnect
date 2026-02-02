# Requirements: TajiConnect LMS v2.0

**Defined:** 2026-02-02
**Core Value:** Personalized career development through AI-powered learning

## v1 Requirements

Requirements for the world-class upgrade. Each maps to roadmap phases.

### Gamification

- [ ] **GAM-01**: User earns XP points for all learning activities (lesson completion, quizzes, daily logins)
- [ ] **GAM-02**: User levels up as XP accumulates with visual level progression (30-50 levels)
- [ ] **GAM-03**: User earns meaningful badges for milestones (15-20 badges with clear criteria)
- [ ] **GAM-04**: User maintains daily learning streak with streak counter and streak protection
- [ ] **GAM-05**: User competes on weekly leaderboards with league tiers (Bronze/Silver/Gold/Diamond)
- [ ] **GAM-06**: User can opt out of competitive leaderboards

### Microlearning

- [ ] **MIC-01**: Lessons are structured as 5-10 minute bite-sized modules
- [ ] **MIC-02**: User sets and tracks daily learning goals (e.g., "Complete 3 lessons today")
- [ ] **MIC-03**: User sees progress toward daily goal with visual indicators

### Interactive Video

- [ ] **VID-01**: Video player supports chapter navigation and bookmarks
- [ ] **VID-02**: Video player supports in-video quizzes at key moments
- [ ] **VID-03**: User progress in video is tracked and resumable

### AI Tutor

- [ ] **TUT-01**: User can access AI tutor from any course/lesson context
- [ ] **TUT-02**: AI tutor provides contextual help based on current lesson
- [ ] **TUT-03**: AI tutor uses Socratic method (guides to answers, doesn't give direct answers)
- [ ] **TUT-04**: AI tutor conversation history persists across sessions
- [ ] **TUT-05**: AI tutor has usage limits per user for cost control

### Adaptive Learning

- [ ] **ADP-01**: Pre-assessment quiz determines user's starting point in a course
- [ ] **ADP-02**: System adjusts difficulty based on quiz/lesson performance
- [ ] **ADP-03**: User receives personalized content recommendations based on performance

### Spaced Repetition

- [ ] **SRS-01**: System generates flashcards from course content (auto or manual curation)
- [ ] **SRS-02**: SM-2 algorithm schedules reviews based on user recall performance
- [ ] **SRS-03**: User has daily review queue with manageable targets
- [ ] **SRS-04**: User rates recall difficulty (Easy/Good/Hard/Again) after each card
- [ ] **SRS-05**: System tracks retention analytics for users

### Discussion Forums

- [ ] **FOR-01**: Each course has a discussion forum
- [ ] **FOR-02**: User can create threaded discussion posts
- [ ] **FOR-03**: User can upvote helpful posts/replies
- [ ] **FOR-04**: User can @mention other users in posts

### Peer Review

- [ ] **PRV-01**: Trainer can create peer review assignments with rubrics
- [ ] **PRV-02**: User can submit work for peer review
- [ ] **PRV-03**: User reviews peers' work using provided rubric
- [ ] **PRV-04**: Reviews are anonymous to reduce bias

### Cohort Learning

- [ ] **COH-01**: Trainer can create time-bound cohorts with enrollment windows
- [ ] **COH-02**: Cohort has shared deadlines and milestones
- [ ] **COH-03**: Cohort has dedicated discussion space
- [ ] **COH-04**: User sees cohort progress relative to peers

### Learning Analytics

- [ ] **ANA-01**: Learner sees personal analytics dashboard (time spent, progress, trends)
- [ ] **ANA-02**: Admin sees aggregate analytics (enrollment, completion, engagement)
- [ ] **ANA-03**: Dashboard visualizations are clear and actionable

### Predictive Analytics

- [ ] **PRD-01**: System predicts likelihood of course completion for each user
- [ ] **PRD-02**: System identifies at-risk learners showing churn signals
- [ ] **PRD-03**: Admin receives alerts for intervention opportunities

### ROI Measurement

- [ ] **ROI-01**: System tracks skill improvement over time
- [ ] **ROI-02**: System tracks career outcomes (job placements from marketplace)
- [ ] **ROI-03**: Reports show correlation between learning activities and outcomes

### PWA & Offline

- [ ] **PWA-01**: App is installable as PWA with proper manifest
- [ ] **PWA-02**: Service worker caches static assets and API responses
- [ ] **PWA-03**: User receives push notifications for streak reminders and updates
- [ ] **PWA-04**: User can download courses for offline learning
- [ ] **PWA-05**: Progress syncs when connectivity restored (with conflict resolution)
- [ ] **PWA-06**: App handles Safari 7-day eviction gracefully (server backup)

### Technical Infrastructure

- [ ] **INF-01**: xAPI/LRS integration for standardized learning records
- [ ] **INF-02**: WebSocket infrastructure for real-time features (presence, notifications)
- [ ] **INF-03**: Event bus architecture for cross-feature communication

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Social Features

- **SOC-01**: User can add friends
- **SOC-02**: Friend streaks and friend quests
- **SOC-03**: Study groups with shared goals

### Live Sessions

- **LIV-01**: Integrated video conferencing for synchronous sessions
- **LIV-02**: Screen sharing for trainers
- **LIV-03**: Live Q&A features

### Payments

- **PAY-01**: M-Pesa integration for subscriptions
- **PAY-02**: Course marketplace with payments

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Native mobile apps (iOS/Android) | PWA provides 90% of capabilities with single codebase |
| Full microservices migration | Too complex, keep JSON server for now |
| VR/AR integration | Low device penetration in African market, high cost |
| Live video sessions | Deferred to v2, focus on async learning first |
| LTI 1.3 tool integration | Wait until after xAPI implementation |
| Multi-tenancy/white-labeling | Not needed for current stage |
| Custom video hosting | Use existing platforms with custom overlay |
| Complex reporting builder | Pre-built dashboards cover 80% of use cases |
| Hundreds of badges | 15-20 meaningful badges, not hundreds (dilutes meaning) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GAM-01 | Phase 1 | Pending |
| GAM-02 | Phase 1 | Pending |
| GAM-03 | Phase 1 | Pending |
| GAM-04 | Phase 1 | Pending |
| GAM-05 | Phase 1 | Pending |
| GAM-06 | Phase 1 | Pending |
| MIC-01 | Phase 1 | Pending |
| MIC-02 | Phase 1 | Pending |
| MIC-03 | Phase 1 | Pending |
| INF-03 | Phase 1 | Pending |
| VID-01 | Phase 2 | Pending |
| VID-02 | Phase 2 | Pending |
| VID-03 | Phase 2 | Pending |
| TUT-01 | Phase 3 | Pending |
| TUT-02 | Phase 3 | Pending |
| TUT-03 | Phase 3 | Pending |
| TUT-04 | Phase 3 | Pending |
| TUT-05 | Phase 3 | Pending |
| ADP-01 | Phase 3 | Pending |
| ADP-02 | Phase 3 | Pending |
| ADP-03 | Phase 3 | Pending |
| SRS-01 | Phase 4 | Pending |
| SRS-02 | Phase 4 | Pending |
| SRS-03 | Phase 4 | Pending |
| SRS-04 | Phase 4 | Pending |
| SRS-05 | Phase 4 | Pending |
| FOR-01 | Phase 5 | Pending |
| FOR-02 | Phase 5 | Pending |
| FOR-03 | Phase 5 | Pending |
| FOR-04 | Phase 5 | Pending |
| PRV-01 | Phase 5 | Pending |
| PRV-02 | Phase 5 | Pending |
| PRV-03 | Phase 5 | Pending |
| PRV-04 | Phase 5 | Pending |
| COH-01 | Phase 5 | Pending |
| COH-02 | Phase 5 | Pending |
| COH-03 | Phase 5 | Pending |
| COH-04 | Phase 5 | Pending |
| ANA-01 | Phase 6 | Pending |
| ANA-02 | Phase 6 | Pending |
| ANA-03 | Phase 6 | Pending |
| PRD-01 | Phase 6 | Pending |
| PRD-02 | Phase 6 | Pending |
| PRD-03 | Phase 6 | Pending |
| ROI-01 | Phase 6 | Pending |
| ROI-02 | Phase 6 | Pending |
| ROI-03 | Phase 6 | Pending |
| PWA-01 | Phase 7 | Pending |
| PWA-02 | Phase 7 | Pending |
| PWA-03 | Phase 7 | Pending |
| PWA-04 | Phase 7 | Pending |
| PWA-05 | Phase 7 | Pending |
| PWA-06 | Phase 7 | Pending |
| INF-01 | Phase 8 | Pending |
| INF-02 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47 ✓
- Unmapped: 0

---
*Requirements defined: 2026-02-02*
*Last updated: 2026-02-02 after roadmap creation*
