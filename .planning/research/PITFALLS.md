# TajiConnect v2.0 Upgrade - Pitfalls Research

**Researched:** 2026-02-02
**Scope:** AI Tutoring, Gamification, Spaced Repetition, Offline/PWA Support
**Confidence:** MEDIUM-HIGH (WebSearch verified with official documentation)

---

## Executive Summary

LMS upgrade projects commonly fail not from lack of features but from implementation mistakes that compound over time. This research identifies 18 critical pitfalls across four major feature domains, with specific warning signs and prevention strategies mapped to implementation phases.

**Top 5 Most Critical Pitfalls (Ranked by Impact):**

1. **AI Cost Explosion** - Uncontrolled LLM API costs bankrupting the project budget
2. **Shallow Gamification** - Points/badges without learning value, causing engagement drop-off
3. **Offline Sync Conflicts** - Data loss from poor conflict resolution destroying user trust
4. **Safari 7-Day Eviction** - PWA data disappearing on iOS, causing African market abandonment
5. **Adaptive Learning Complexity** - Over-engineering personalization, delaying delivery indefinitely

---

## Section 1: AI Tutor Integration Pitfalls

### Pitfall 1.1: Uncontrolled API Cost Explosion

**What goes wrong:** Teams integrate Claude/GPT without usage limits, caching, or cost monitoring. A viral feature or bug can generate thousands of API calls, creating surprise bills in the thousands of dollars. Output tokens cost 3-5x more than input tokens, making chatty responses disproportionately expensive.

**Warning signs:**
- No per-user or per-session token limits implemented
- No caching layer for repeated questions
- API calls made directly from frontend without backend mediation
- No monitoring dashboard tracking daily/weekly spend
- System prompts repeated in full with every request

**Prevention strategy:**
- Implement semantic caching for similar questions (30-60% cost reduction)
- Cache static prompt components (system prompts, style guides) - up to 90% input savings
- Set hard per-user daily/weekly limits with graceful degradation
- Use tiered models: cheap model for simple questions, Claude for complex reasoning
- Add middleware logging every API call with token counts
- Set budget alerts at 50%, 75%, 90% of monthly budget

**Phase mapping:** Phase 2 (AI-Powered Learning) - Design cost architecture before any API integration

**Confidence:** HIGH - Verified with [Anthropic Rate Limits docs](https://docs.anthropic.com/en/api/rate-limits) and [LLM cost optimization guides](https://ai.koombea.com/blog/llm-cost-optimization)

---

### Pitfall 1.2: Rate Limit Cascade Failures

**What goes wrong:** Anthropic rate limits are per-organization, not per-API-key. Multiple features sharing the same account (AI tutor, quiz generation, content summarization) starve each other during peak usage, causing cascading failures across the platform.

**Warning signs:**
- Multiple AI features hitting API without request coordination
- 429 errors appearing in logs with increasing frequency
- Different features using different retry strategies
- No request queuing or prioritization system
- Production and development sharing same API keys

**Prevention strategy:**
- Implement centralized API gateway managing all Claude requests
- Add request queue with priority levels (user-facing > background processing)
- Use exponential backoff with jitter, not fixed retry intervals
- Separate development and production API keys in different tiers
- Monitor `anthropic-ratelimit-tokens-*` headers for approaching limits
- Build multi-provider fallback (Claude primary, GPT fallback) for critical paths

**Phase mapping:** Phase 2 (AI-Powered Learning) - Build API gateway before adding AI features

**Confidence:** HIGH - Verified with [Anthropic Rate Limits](https://docs.anthropic.com/en/api/rate-limits)

---

### Pitfall 1.3: AI Tutor Becomes Answer Machine

**What goes wrong:** AI tutor gives direct answers instead of using Socratic method, undermining learning outcomes. Students game the system by asking AI for quiz answers. Learning metrics look good (completion rates up) but actual skill acquisition plummets.

**Warning signs:**
- Students completing courses faster than expected
- Quiz scores high but practical assessment scores low
- AI conversation logs show mostly one-shot Q&A, not multi-turn dialogue
- Students reporting "the AI just gives answers"
- Declining time-on-task despite high completion

**Prevention strategy:**
- Engineer prompts for Socratic method: "Guide the student to discover the answer"
- Implement "hint progression" - first response always a guiding question
- Add guardrails detecting quiz question patterns and refusing direct answers
- Track conversation turn depth as quality metric (target: 3+ turns per learning moment)
- Randomize quiz questions so AI can't simply provide cached answers
- A/B test learning outcomes between AI-assisted and control groups

**Phase mapping:** Phase 2 (AI-Powered Learning) - Define pedagogy before implementation

**Confidence:** MEDIUM - Based on [LMS AI integration best practices](https://www.lmsportals.com/post/best-practices-when-integrating-ai-tools-with-a-corporate-lms) and general pedagogical principles

---

### Pitfall 1.4: Context Window Bloat

**What goes wrong:** To make the AI "contextually aware," developers include entire course content, user history, and conversation history in every request. This creates slow responses (5-10 seconds), massive token costs, and frequently hits context limits.

**Warning signs:**
- AI responses taking >3 seconds consistently
- Input token counts growing unbounded with conversation length
- "Context too long" errors appearing
- High costs despite low conversation volume
- AI responses becoming less relevant as conversations grow

**Prevention strategy:**
- Use RAG (Retrieval Augmented Generation) - fetch only relevant content snippets
- Implement sliding window for conversation history (last 10 messages, not all)
- Summarize older context instead of including verbatim
- Pre-chunk course content for efficient retrieval
- Set maximum context budget per request (e.g., 8K tokens max)
- Profile typical requests and optimize the worst offenders

**Phase mapping:** Phase 2 (AI-Powered Learning) - Design context management architecture early

**Confidence:** HIGH - Verified with [LLM cost reduction guides](https://www.getmaxim.ai/articles/how-to-reduce-llm-cost-and-latency-in-ai-applications/)

---

## Section 2: Gamification Pitfalls

### Pitfall 2.1: Shallow Gamification (Points Without Purpose)

**What goes wrong:** Teams add points, badges, and leaderboards (PBL) as a cosmetic layer without connecting them to learning objectives. Initial engagement spikes, then crashes as users realize the game elements are disconnected from actual value. 80% of gamification initiatives fail for this reason.

**Warning signs:**
- Gamification designed by developers, not instructional designers
- Points awarded for any action (login, page views) without discrimination
- No narrative or progression system connecting rewards
- Leaderboard is the only competitive element
- No clear criteria communicated for earning rewards
- Rewards feel arbitrary or too easy to obtain

**Prevention strategy:**
- Define learning objectives FIRST, then map game mechanics to support them
- Use variable reward schedules (not constant points for every action)
- Create meaningful progression tiers tied to actual skill mastery
- Implement multiple paths to success (not just speed-based competition)
- Pilot with small group and iterate based on learning outcome data
- Balance intrinsic motivation (mastery, purpose) with extrinsic (points, badges)

**Phase mapping:** Phase 1 (Foundation Enhancements) - Define gamification philosophy before building

**Confidence:** HIGH - Verified with [TalentLMS gamification mistakes](https://www.talentlms.com/blog/common-gamification-mistakes-avoid/) and [Litmos gamification guide](https://www.litmos.com/blog/articles/gamification-mistakes)

---

### Pitfall 2.2: Leaderboard Demotivation

**What goes wrong:** Leaderboards create healthy competition for top performers but devastate motivation for bottom performers. Consistent last-place finishers disengage entirely. Some learners avoid participation to avoid embarrassment on public boards.

**Warning signs:**
- Bottom 30% of leaderboard showing declining engagement
- Users opting out of courses with visible competition
- Survey feedback mentions "feeling stupid" or "can't keep up"
- High performers dominating while others give up
- No activity from users after they fall far behind

**Prevention strategy:**
- Implement privacy controls (opt-in leaderboards, not opt-out)
- Use cohort-based competition (compare with similar-level peers)
- Show "personal best" progress, not just relative ranking
- Create team-based challenges alongside individual competition
- Consider "improvement leaderboards" (who progressed most, not who's highest)
- Add "comeback" mechanics for users who've fallen behind

**Phase mapping:** Phase 1 (Foundation Enhancements) - Design inclusive competition system

**Confidence:** HIGH - Verified with [gamification research](https://www.td.org/content/atd-blog/8-gamification-of-learning-mistakes-you-need-to-avoid)

---

### Pitfall 2.3: The Overjustification Effect

**What goes wrong:** Excessive extrinsic rewards (points, badges) replace intrinsic motivation. Users who once learned for the joy of learning now only engage when rewards are offered. Reducing or removing rewards causes complete disengagement.

**Warning signs:**
- Users asking "how many points is this worth?" before engaging
- Engagement drops immediately when reward systems change
- Users doing minimum required for rewards, skipping optional enrichment
- Forum complaints when expected rewards aren't given
- No voluntary practice outside required coursework

**Prevention strategy:**
- Use rewards to get users started, then fade them over time
- Reward effort and improvement, not just achievement
- Create "hidden" achievements that surprise users (discovery motivation)
- Balance external rewards with internal feedback (skill visualization)
- Avoid rewarding activities that should be intrinsically motivating
- Test: remove points for a feature and see if engagement remains

**Phase mapping:** Phase 1 (Foundation Enhancements) - Design reward decay into system

**Confidence:** MEDIUM - Based on [gamification psychology research](https://journals.sagepub.com/doi/abs/10.1177/15554120241228125)

---

### Pitfall 2.4: Technology-First Gamification

**What goes wrong:** Teams select a gamification platform or framework first, then try to fit learning objectives into its capabilities. The result is technically impressive but pedagogically weak. Technology constraints drive design decisions instead of learning science.

**Warning signs:**
- Feature decisions driven by "the plugin supports this"
- Learning designers brought in after technical architecture set
- Gamification feels disconnected from course content
- Complex technical implementation with simple game mechanics
- No instructional design review of gamification elements

**Prevention strategy:**
- Start with paper prototyping of game mechanics, no code
- Involve instructional designers from day one
- Define what behaviors you want to encourage BEFORE choosing tools
- Accept simpler technology if it better serves learning objectives
- Test game mechanics with real users before building infrastructure
- Ask "does this help learning?" for every feature decision

**Phase mapping:** Phase 1 (Foundation Enhancements) - Design pedagogy before selecting technology

**Confidence:** HIGH - Verified with [Intellum gamification guide](https://www.intellum.com/resources/blog/gamification-mistakes)

---

## Section 3: Spaced Repetition Pitfalls

### Pitfall 3.1: SM-2 "Ease Hell"

**What goes wrong:** The standard SM-2 algorithm punishes failed cards by dramatically reducing ease factor and interval. Cards that are genuinely difficult get trapped in "ease hell" - shown too frequently, creating frustration without improving retention. Users burn out reviewing the same difficult content endlessly.

**Warning signs:**
- Users complaining "I see the same cards every day"
- Cards with ease factors below 150% accumulating
- Users abandoning review queue (too overwhelming)
- Review time per session increasing over time
- High proportion of cards marked "hard" or "again"

**Prevention strategy:**
- Set minimum ease factor floor (Anki uses 130%, consider 150%)
- Implement "leech detection" - cards failed 8+ times need reformulation
- Add "easy bonus" for mature cards answered correctly after long interval
- Consider SM-2+ or FSRS algorithm improvements over base SM-2
- Allow users to "suspend" or "bury" problematic cards for reformulation
- Provide guidance on creating better cards when leech detected

**Phase mapping:** Phase 2 (AI-Powered Learning) - Choose algorithm variant carefully

**Confidence:** HIGH - Verified with [SM-2 algorithm analysis](https://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2) and [Anki documentation](https://faqs.ankiweb.net/what-spaced-repetition-algorithm)

---

### Pitfall 3.2: Overdue Card Penalty

**What goes wrong:** SM-2 is too aggressive when scheduling overdue cards. If a user correctly recalls a card that was a month overdue, the algorithm shows it again in just a few days - wasting the user's time on content they clearly know well. Studies show this causes 87% recall dropping to 75% as overdueness increases.

**Warning signs:**
- Users correctly answering cards, then seeing them again within a week
- Users complaining the system "doesn't trust them"
- Review counts not decreasing despite consistent correct answers
- Users gaming system by reviewing on exact schedule (unnatural behavior)
- High churn among users with irregular review schedules

**Prevention strategy:**
- Award bonus interval for correctly answering overdue cards
- Scale bonus by overdueness (1 month overdue + correct = big interval boost)
- Consider FSRS algorithm which handles overdue cards more gracefully
- Add randomness to intervals (prevents clustering and tests true recall)
- Allow users with long absences to "reset" deck with diagnostic test
- Don't punish life happening - users will miss days

**Phase mapping:** Phase 2 (AI-Powered Learning) - Test with irregular usage patterns

**Confidence:** HIGH - Verified with [SM-2 overdue handling research](https://controlaltbackspace.org/overdue-handling/)

---

### Pitfall 3.3: Card Clustering and Order Dependency

**What goes wrong:** Cards learned together and always answered correctly cluster in the review queue - appearing at the same time, in the same order. Related cards create artificial recall through association (seeing Card A triggers memory of Card B) rather than true independent recall.

**Warning signs:**
- Related cards always appearing consecutively in review
- Users "knowing" the next card before seeing it
- High recall in app but poor performance on external tests
- Review sessions feeling predictable and repetitive
- Same cards always in same position in queue

**Prevention strategy:**
- Add randomization factor (+/- 10%) to calculated intervals
- Shuffle review order within each session
- Implement "related card spacing" - ensure related cards don't appear adjacently
- Test recall with randomized external quizzes (not just SRS queue)
- Consider interleaving cards from different topics in review sessions
- Track correlation between clustered cards and flag for separation

**Phase mapping:** Phase 2 (AI-Powered Learning) - Build anti-clustering into scheduler

**Confidence:** HIGH - Verified with [spaced repetition implementation guides](https://github.com/thyagoluciano/sm2)

---

### Pitfall 3.4: Review Queue Overwhelm

**What goes wrong:** Users create many cards initially, then face an overwhelming daily review queue that grows faster than they can complete. The psychological burden causes abandonment - users feel they can "never catch up" and quit entirely.

**Warning signs:**
- Daily review counts exceeding 100+ cards
- Users with growing backlog of overdue cards
- New card creation while review queue is already large
- Users logging in, seeing queue size, and immediately logging out
- Completion rates dropping as account age increases

**Prevention strategy:**
- Cap new cards per day (e.g., 20 new cards maximum)
- Show "time to complete" estimate before review sessions
- Implement "vacation mode" that suspends new cards during breaks
- Allow scheduling review sessions (morning/evening preferences)
- Break large queues into manageable chunks ("do 25 cards now")
- Celebrate streak maintenance, not just completion volume

**Phase mapping:** Phase 2 (AI-Powered Learning) - Design for sustainable daily practice

**Confidence:** MEDIUM - Based on spaced repetition community patterns and Anki best practices

---

## Section 4: Offline/PWA Support Pitfalls

### Pitfall 4.1: Safari 7-Day Cache Eviction

**What goes wrong:** Safari on iOS/macOS evicts ALL IndexedDB data, Service Worker registration, and Cache API storage after 7 days of user inactivity with the site. For African market users who may not have consistent daily internet access, this means losing all offline content - including downloaded courses and progress - with no warning.

**Warning signs:**
- iOS users reporting "my courses disappeared"
- Support tickets about lost progress from Safari users
- Users needing to re-download content repeatedly
- Offline mode working on Chrome but failing on Safari
- Higher churn rates among iOS users compared to Android

**Prevention strategy:**
- Prompt users to "Add to Home Screen" - installed PWAs are exempt from eviction
- Implement server-side progress backup that syncs when online
- Show clear warning to Safari users about data persistence limitations
- Consider critical data storage in cookies (longer Safari persistence)
- Add "re-download" flow that's fast and doesn't lose user state
- Test specifically on Safari after 7+ days of inactivity

**Phase mapping:** Phase 5 (Mobile Excellence) - Design for Safari limitations from start

**Confidence:** HIGH - Verified with [MDN Storage documentation](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

---

### Pitfall 4.2: Offline Sync Conflict Disasters

**What goes wrong:** User completes lesson offline, syncs online, but server has newer data. Without proper conflict resolution, user's progress is overwritten (lost work) or server data is overwritten (data corruption). Both outcomes destroy user trust.

**Warning signs:**
- Users reporting "I completed that lesson already"
- Progress numbers jumping backwards
- Duplicate entries appearing after sync
- Inconsistent state between devices
- Support tickets about "lost" achievements or XP

**Prevention strategy:**
- Implement version vectors or timestamps on all syncable data
- Choose conflict strategy per data type (progress = merge, settings = last-write-wins)
- Show users pending offline changes before sync
- Allow manual conflict resolution for important data
- Never silently overwrite - always log and potentially surface to user
- Test sync after extended offline periods (days, not minutes)

**Phase mapping:** Phase 5 (Mobile Excellence) - Design sync architecture before building offline

**Confidence:** HIGH - Verified with [PWA sync guide](https://gtcsys.com/comprehensive-faqs-guide-data-synchronization-in-pwas-offline-first-strategies-and-conflict-resolution/) and [offline-first patterns](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)

---

### Pitfall 4.3: Service Worker Update Purgatory

**What goes wrong:** New service worker is deployed but users keep getting old cached content indefinitely. The new service worker waits for ALL tabs to close before activating. Users with long-lived tabs (common on mobile) never get updates.

**Warning signs:**
- Users on different app versions despite deployments
- Bug fixes "not working" for some users
- Features appearing inconsistently across user base
- Users needing to "clear cache" to see updates
- A/B tests showing impossible version distributions

**Prevention strategy:**
- Implement `skipWaiting()` in service worker (with care)
- Show "Update Available - Refresh to Update" banner
- Use version number visible in UI for support debugging
- Implement force-refresh mechanism for critical updates
- Test update flow with multiple tabs open
- Consider "update on navigate" instead of "update on refresh"

**Phase mapping:** Phase 5 (Mobile Excellence) - Plan update strategy before deploying first SW

**Confidence:** HIGH - Verified with [MDN Service Worker guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)

---

### Pitfall 4.4: IndexedDB Quota Exceeded

**What goes wrong:** Downloaded course content fills available storage quota. Browser throws `QuotaExceededError`, breaking the app. Users lose ability to download more content or even use basic features. Safari's quota is particularly restrictive (500MB default on iOS).

**Warning signs:**
- Error logs showing QuotaExceededError
- Download failures for larger courses
- Users unable to download after extended use
- Storage growing unbounded without cleanup
- No visibility into storage usage for users

**Prevention strategy:**
- Show users their storage usage and quota
- Implement LRU cache eviction for old/unused content
- Compress downloadable content (video is the biggest culprit)
- Request persistent storage permission where supported
- Implement selective download (allow choosing which courses)
- Handle QuotaExceededError gracefully with user-facing message
- Test specifically on Safari iOS (most restrictive quotas)

**Phase mapping:** Phase 5 (Mobile Excellence) - Implement storage management before downloads

**Confidence:** HIGH - Verified with [RxDB IndexedDB limits](https://rxdb.info/articles/indexeddb-max-storage-limit.html) and [MDN Storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

---

### Pitfall 4.5: African Network Reality Ignored

**What goes wrong:** Offline features tested on "offline" Chrome DevTools but not on real African network conditions. Users experience 2G connections, connections that drop mid-request, and inconsistent connectivity that's neither fully online nor offline. App behavior is unpredictable.

**Warning signs:**
- Features work offline but fail on slow networks
- Long spinners or timeouts on partial connectivity
- Users reporting "it just hangs"
- No loading states for slow operations
- App assumes binary online/offline state

**Prevention strategy:**
- Test on real 2G throttling (not just offline toggle)
- Implement timeouts with retry for all network operations
- Use optimistic UI updates with background sync
- Show connection quality indicator in app
- Queue failed requests for retry (Background Sync API)
- Design for "lie-fi" - connected but no actual data transfer
- Test in markets like Kenya, Nigeria with real network conditions

**Phase mapping:** Phase 5 (Mobile Excellence) - Test on realistic African network conditions

**Confidence:** HIGH - Verified with [Opensignal African mobile report](https://insights.opensignal.com/2024/11/11/the-state-of-mobile-network-experience-in-africa) showing 8-38% time on 2G/3G networks

---

## Section 5: Cross-Cutting Pitfalls

### Pitfall 5.1: Feature Overload Without Integration

**What goes wrong:** Each feature (AI tutor, gamification, spaced repetition, offline) is built as an isolated module. The AI tutor doesn't know about spaced repetition cards. Gamification doesn't reward review sessions. Offline mode breaks AI features. The result is a fragmented experience that confuses users.

**Warning signs:**
- Features designed and built by separate teams without coordination
- No shared data model between feature domains
- User has to switch between different "modes" or "sections"
- Features duplicate functionality (multiple notification systems)
- No unified user profile connecting all features

**Prevention strategy:**
- Define unified data model before building any feature
- Create integration points between features (AI generates flashcards, reviews earn XP)
- Single notification system, single progress tracking, single user profile
- Design user journeys that flow across features naturally
- Review every feature against: "How does this connect to other features?"
- Build for integration from day one, not as afterthought

**Phase mapping:** All phases - Establish integration architecture in Phase 1

**Confidence:** MEDIUM - Based on LMS integration patterns and general software architecture principles

---

### Pitfall 5.2: React State Management Fragmentation

**What goes wrong:** Different features use different state management approaches (Context for auth, Redux for courses, local state for gamification). State synchronization breaks. Memory leaks accumulate. Performance degrades as the app grows.

**Warning signs:**
- Multiple state management libraries in package.json
- "Prop drilling" to share data between feature modules
- Memory profiler showing steadily increasing heap
- Slow re-renders on state updates
- Race conditions between different state stores

**Prevention strategy:**
- Choose ONE primary state management approach (Zustand recommended for new React apps)
- Define clear boundaries for what lives in global vs local state
- Implement cleanup in useEffect for all subscriptions and timers
- Use React DevTools profiler regularly during development
- Audit re-renders - components shouldn't re-render on unrelated state changes
- Consider React Query/TanStack Query for server state separately from UI state

**Phase mapping:** Phase 1 (Foundation Enhancements) - Establish state architecture before adding features

**Confidence:** HIGH - Verified with [React performance optimization guides](https://www.zignuts.com/blog/react-app-performance-optimization-guide)

---

### Pitfall 5.3: Adaptive Learning Over-Engineering

**What goes wrong:** Team attempts to build sophisticated ML-powered adaptive learning system. Requires massive data collection, complex algorithms, and extensive A/B testing. Project delays indefinitely as the "personalization engine" is never quite ready. Meanwhile, competitors ship simpler solutions.

**Warning signs:**
- Adaptive learning requirements include "machine learning model"
- No MVP definition for adaptive features
- Data science team needed before feature can launch
- Extensive user data collection before any adaptation happens
- Months of development with no user-facing improvement

**Prevention strategy:**
- Start with rules-based adaptation (if quiz score <60%, show remedial content)
- Ship simple before sophisticated (manual paths before ML paths)
- Define clear adaptation levels: L1 (rules), L2 (heuristics), L3 (ML)
- Build L1 first, ship it, then iterate toward L2/L3
- Use existing psychometric data (you have this!) for initial personalization
- Don't require perfection - "somewhat personalized" beats "not personalized"

**Phase mapping:** Phase 2 (AI-Powered Learning) - Start with rules, not ML

**Confidence:** HIGH - Verified with [adaptive learning implementation research](https://link.springer.com/article/10.1007/s40593-024-00400-6)

---

### Pitfall 5.4: Testing Only Happy Paths

**What goes wrong:** Features tested with perfect connectivity, clean data, and expected user behavior. Real users have spotty connections, corrupted local storage, conflicting browser extensions, and use the app in unexpected ways. Edge cases cause data corruption, crashes, and lost work.

**Warning signs:**
- No tests for error states
- Offline testing is just toggling Chrome's offline mode
- No testing on actual mobile devices (only simulators)
- Test data is clean and consistent
- QA finds most bugs in production, not staging

**Prevention strategy:**
- Test with throttled networks (2G, 3G, lie-fi)
- Test with storage quota near limits
- Test with corrupted IndexedDB (simulate partial writes)
- Test conflict scenarios (offline edits + server changes)
- Test on actual physical devices (not just simulators)
- Test with real-world data (special characters, long text, edge cases)
- Implement chaos engineering: randomly fail things in staging

**Phase mapping:** All phases - Build testing discipline from Phase 1

**Confidence:** MEDIUM - Based on general software testing principles and PWA testing guides

---

## Phase-Pitfall Mapping Summary

| Phase | Must Address | Should Address |
|-------|--------------|----------------|
| **Phase 1: Foundation** | 2.1 (Shallow gamification), 2.2 (Leaderboard demotivation), 2.3 (Overjustification), 2.4 (Tech-first gamification), 5.2 (State management) | 5.1 (Feature integration) |
| **Phase 2: AI Learning** | 1.1 (Cost explosion), 1.2 (Rate limits), 1.3 (Answer machine), 1.4 (Context bloat), 3.1 (Ease hell), 3.2 (Overdue penalty), 3.3 (Card clustering), 3.4 (Queue overwhelm), 5.3 (Over-engineering) | 5.1 (Feature integration) |
| **Phase 5: Mobile** | 4.1 (Safari eviction), 4.2 (Sync conflicts), 4.3 (SW updates), 4.4 (Quota exceeded), 4.5 (African networks) | 5.4 (Testing edge cases) |

---

## Risk Matrix

| Pitfall | Probability | Impact | Priority |
|---------|-------------|--------|----------|
| 1.1 AI Cost Explosion | HIGH | CRITICAL | P0 |
| 4.1 Safari 7-Day Eviction | HIGH | HIGH | P0 |
| 2.1 Shallow Gamification | HIGH | HIGH | P1 |
| 4.2 Sync Conflicts | MEDIUM | CRITICAL | P1 |
| 1.3 Answer Machine | MEDIUM | HIGH | P1 |
| 4.5 African Network Reality | HIGH | MEDIUM | P1 |
| 3.1 SM-2 Ease Hell | MEDIUM | MEDIUM | P2 |
| 5.3 Adaptive Over-Engineering | MEDIUM | HIGH | P2 |
| 2.2 Leaderboard Demotivation | MEDIUM | MEDIUM | P2 |
| 4.4 Quota Exceeded | LOW | HIGH | P2 |

---

## Quick Reference Checklist

### Before Phase 1 Launch
- [ ] Gamification mechanics tied to learning objectives, not just engagement
- [ ] Leaderboards are opt-in with cohort-based alternatives
- [ ] Reward system designed with decay/fading built in
- [ ] State management architecture decided and documented
- [ ] Feature integration points defined in data model

### Before Phase 2 Launch
- [ ] AI cost monitoring and alerts active
- [ ] Per-user token limits implemented
- [ ] Caching layer for repeated AI queries working
- [ ] Socratic prompting verified (AI doesn't give direct answers)
- [ ] SM-2 algorithm includes ease floor and overdue handling
- [ ] Review queue has daily caps and overwhelm prevention

### Before Phase 5 Launch
- [ ] Safari PWA limitations tested and handled
- [ ] Sync conflict resolution strategy implemented per data type
- [ ] Storage quota management with user visibility
- [ ] Service Worker update flow tested with multiple tabs
- [ ] Tested on real 2G/3G networks (not just simulated)
- [ ] Offline + slow network + reconnect scenarios all tested

---

## Sources

### Primary (HIGH confidence)
- [Anthropic Rate Limits Documentation](https://docs.anthropic.com/en/api/rate-limits)
- [MDN Storage Quotas and Eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN Service Workers Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)

### Secondary (MEDIUM confidence)
- [TalentLMS Gamification Mistakes](https://www.talentlms.com/blog/common-gamification-mistakes-avoid/)
- [Litmos Gamification Guide](https://www.litmos.com/blog/articles/gamification-mistakes)
- [SM-2+ Algorithm Analysis](https://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2)
- [SM-2 Overdue Card Research](https://controlaltbackspace.org/overdue-handling/)
- [RxDB IndexedDB Storage Limits](https://rxdb.info/articles/indexeddb-max-storage-limit.html)
- [Opensignal African Mobile Report](https://insights.opensignal.com/2024/11/11/the-state-of-mobile-network-experience-in-africa)
- [LLM Cost Optimization Guide](https://ai.koombea.com/blog/llm-cost-optimization)
- [PWA Data Sync Guide](https://gtcsys.com/comprehensive-faqs-guide-data-synchronization-in-pwas-offline-first-strategies-and-conflict-resolution/)
- [Adaptive Learning Implementation Research](https://link.springer.com/article/10.1007/s40593-024-00400-6)

### Tertiary (LOW confidence - needs validation)
- [LMS AI Integration Best Practices](https://www.lmsportals.com/post/best-practices-when-integrating-ai-tools-with-a-corporate-lms) - Single source, verify with implementation experience
- Gamification psychology research - Academic, may not translate directly to practice

---

*Research completed: 2026-02-02*
*Valid until: 30 days (stable domain, patterns unlikely to change rapidly)*
