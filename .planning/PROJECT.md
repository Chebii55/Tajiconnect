# TajiConnect LMS - World-Class Upgrade

## What This Is

TajiConnect is a career-focused Learning Management System for the African market, featuring AI-powered career assessment, personalized learning roadmaps, psychometric testing, and TFDN compliance. This upgrade transforms it from a solid foundation into a world-class LMS with AI tutoring, gamification, spaced repetition, and offline-first mobile support.

## Core Value

**Personalized career development through AI-powered learning** - Every feature must support learners in discovering their career path and acquiring the skills to achieve it.

## Requirements

### Validated

<!-- Shipped and confirmed working - from existing codebase -->

- ✓ User authentication (email/password + Google OAuth) — existing
- ✓ Multi-role system (Student, Trainer, Admin) — existing
- ✓ AI-powered career assessment algorithm — existing
- ✓ Personalized career roadmaps generation — existing
- ✓ Psychometric testing (6-step onboarding flow) — existing (see design doc)
  - Motivation discovery (WHY: intrinsic vs extrinsic)
  - Skill baseline (WHERE: beginner to advanced)
  - Learning style preference (HOW: video/audio/reading)
  - Time & commitment assessment
  - Learner archetype generation (internal personas)
- ✓ Skills gap analysis — existing
- ✓ Course management and enrollment — existing
- ✓ Learning progress tracking — existing
- ✓ TFDN compliance tracking — existing
- ✓ Basic badge/achievement system — existing
- ✓ Job marketplace with matching — existing
- ✓ Trainer dashboard and course management — existing
- ✓ Dark mode support — existing
- ✓ Responsive web design — existing

### Active

<!-- Current scope - building toward these in this milestone -->

**Phase 1: Foundation Enhancements**
- [ ] Full gamification engine (XP, levels, streaks, leaderboards)
- [ ] Microlearning infrastructure (5-10 min modules, daily goals)
- [ ] Interactive video player (in-video quizzes, chapters, bookmarks)

**Phase 2: AI-Powered Learning**
- [ ] AI tutor integration (24/7 contextual help, Socratic method)
- [ ] Adaptive learning paths (pre-assessment, dynamic difficulty)
- [ ] Spaced repetition system (SM-2 algorithm, flashcards, review queue)

**Phase 3: Social & Collaborative**
- [ ] Discussion forums (threaded, upvoting, @mentions)
- [ ] Peer review system (rubrics, anonymous reviews)
- [ ] Cohort-based learning (time-bound groups, challenges)

**Phase 4: Analytics & Insights**
- [ ] Learning analytics dashboard (learner + admin views)
- [ ] Predictive analytics (completion prediction, churn prevention)
- [ ] ROI measurement (skill improvement, career outcomes)

**Phase 5: Mobile Excellence**
- [ ] PWA implementation (service worker, offline cache, push notifications)
- [ ] Offline learning support (download courses, sync progress)

**Phase 6: Technical Infrastructure**
- [ ] xAPI/LRS integration (learning records standardization)
- [ ] Real-time infrastructure (WebSocket, live presence)

### Out of Scope

<!-- Explicit boundaries for this milestone -->

- Native mobile apps (iOS/Android) — deferred to future milestone, PWA first
- Full microservices migration — too complex, keep JSON server for now
- VR/AR integration — low ROI for current user base
- Live video sessions (Daily.co/Whereby) — deferred to Phase 3+
- LTI 1.3 tool integration — deferred until after xAPI
- Multi-tenancy/white-labeling — not needed yet
- Payment processing (M-Pesa) — separate milestone

## Context

**Market Position:**
- Targeting African market with offline-first considerations
- Unique TFDN compliance attracts NGOs, governments, social enterprises
- Competing with Docebo, Coursera, Teachable but differentiated by career focus

**Technical Environment:**
- Frontend: React 19.1 + TypeScript 5.8 + Vite 7.1 + Tailwind CSS
- Backend: JSON Server mock (production needs proper backend)
- Hosting: Netlify (frontend), TBD (backend)
- Testing: Playwright for E2E

**Current State:**
- Production at portal.tajiconnect.com
- ~153 TypeScript/React components
- ~100 API endpoints defined
- Strong AI career assessment already working
- Codebase well-organized by feature

**Key Design Documents:**
- `Tajiconnect V2 – Onboarding Psychometric Test Design.md` — 6-step onboarding flow design
  - Captures motivation, capability, behavior dimensions
  - Generates learner archetypes (Structured, Cultural Explorer, Casual, Conversational)
  - Ready-to-use templates (A: Ultra-Fast, B: AI-Driven, C: Conversational)
  - Maximum 2-3 minutes completion time

**Key Insights from Research:**
- 72% of enterprises adopting AI-enhanced learning by 2026
- Gamification boosts engagement by 48% (Deloitte study)
- Spaced repetition improves retention by 200%+ vs traditional learning
- Mobile/offline critical for African market connectivity challenges

## Constraints

- **Tech Stack**: React/TypeScript frontend must be preserved — large investment, working well
- **Backend**: JSON Server is temporary — production backend needed eventually
- **AI Budget**: Claude/OpenAI API costs must be managed — implement caching and usage limits
- **Compatibility**: Must work offline in low-connectivity regions — PWA architecture required
- **Timeline**: 6-phase roadmap over ~28 weeks — phases can be adjusted based on feedback
- **Team**: Solo developer with Claude — no team coordination overhead

## Key Decisions

<!-- Decisions that constrain future work -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PWA over native apps | Faster delivery, single codebase, African market connectivity | — Pending |
| Claude API for AI tutor | Better reasoning, Socratic method support | — Pending |
| SM-2 for spaced repetition | Proven algorithm, well-documented, efficient | — Pending |
| Keep JSON Server for now | Full backend migration would derail feature work | — Pending |
| Gamification before AI tutor | Quick wins build momentum, lower complexity | — Pending |

---
*Last updated: 2026-02-02 after initialization*
