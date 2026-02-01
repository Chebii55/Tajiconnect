# Codebase Concerns

**Analysis Date:** 2026-02-02

## Tech Debt

**Extensive Use of `any` Type:**
- Issue: TypeScript's `any` type used throughout frontend, bypassing type safety
- Files:
  - `frontend/src/utils/validation.ts` (lines 8, 33, 56, 76)
  - `frontend/src/contexts/TrainerContext.tsx` (lines 93, 101, 117)
  - `frontend/src/contexts/LearningPathContext.tsx` (lines 13, 16, 48, 98)
  - `frontend/src/components/progress/ProgressDashboard.tsx` (line 31)
  - `frontend/src/components/ui/TrendingContent.tsx` (line 34)
  - `frontend/src/components/trainer/courses/CourseLearners.tsx` (lines 63, 64, 121, 136, 153, 238)
- Impact: Reduced type safety, potential runtime errors, harder refactoring
- Fix approach: Define proper interfaces for all data structures; audit and replace `any` types

**Hardcoded Mock Data in Production Code:**
- Issue: Components contain hardcoded mock data instead of API integration
- Files:
  - `frontend/src/components/jobs/GeneralJobs.tsx` (lines 52-220 - mock job listings)
  - `frontend/src/contexts/TrainerContext.tsx` (lines 130-350 - mock trainer data)
  - `backend/server.js` (lines 614-656 - mock skills gap data)
- Impact: Features appear functional but don't use real data; misleading user experience
- Fix approach: Replace mock data with actual API calls; move mocks to test fixtures only

**Plaintext Password Storage:**
- Issue: Backend stores passwords without hashing
- Files: `backend/server.js` (line 64 - comment "In production, hash this")
- Impact: Critical security vulnerability if database is compromised
- Fix approach: Implement bcrypt hashing before storage; add password migration

**Duplicate Route Definitions:**
- Issue: Same route defined multiple times in server
- Files: `backend/server.js` (lines 284-314, 407-440 - `/api/onboarding/complete` defined twice)
- Impact: Unpredictable behavior; maintenance confusion
- Fix approach: Consolidate duplicate routes; add route registry pattern

**Multiple Onboarding Flows:**
- Issue: Several onboarding component implementations exist simultaneously
- Files:
  - `frontend/src/components/onboarding/EnhancedProfileSetup.tsx` (921 lines)
  - `frontend/src/components/onboarding/ProfileSetup.tsx` (568 lines)
  - `frontend/src/components/onboarding/StreamlinedOnboarding.tsx`
  - `frontend/src/components/onboarding/BriefOnboarding.tsx`
- Impact: Unclear which flow is authoritative; code duplication; maintenance burden
- Fix approach: Consolidate to single onboarding flow; deprecate unused components

## Known Bugs

**Empty Catch Blocks:**
- Symptoms: Errors silently swallowed without handling
- Files:
  - `frontend/src/services/api/auth.ts` (lines 196, 293)
  - `frontend/tests/api/auth.spec.ts` (lines 44, 99, 165)
- Trigger: Any API error in those code paths
- Workaround: Check console for errors during debugging

**useEffect Dependency Issues:**
- Symptoms: Potential stale closures or missing re-renders
- Files: `frontend/src/components/jobs/GeneralJobs.tsx` (line 263 - eslint-disable comment)
- Trigger: Component state changes not reflected in effect
- Workaround: Review component behavior when filters change

## Security Considerations

**Google OAuth Client ID Exposed in Frontend:**
- Risk: Client ID visible in frontend `.env` file committed indirectly
- Files: `frontend/.env` (line 19)
- Current mitigation: Client ID is meant to be public (OAuth flow design)
- Recommendations: Ensure redirect URIs are strictly configured in Google Console

**No Rate Limiting Implementation:**
- Risk: API vulnerable to brute force and DoS attacks
- Files: `backend/server.js` (entire file - no rate limiting middleware)
- Current mitigation: None
- Recommendations: Add express-rate-limit middleware; implement per-endpoint limits

**Token Storage in localStorage:**
- Risk: XSS attacks could steal authentication tokens
- Files:
  - `frontend/src/services/api/auth.ts` (lines 260, 268, 274-276)
  - `frontend/src/services/api/client.ts` (lines 38-39, 86-91, 103-105)
- Current mitigation: None
- Recommendations: Consider httpOnly cookies for refresh tokens; implement token refresh strategy

**CORS Wildcard Configuration:**
- Risk: Any origin can make requests to the API
- Files: `backend/server.js` (line 18 - `Access-Control-Allow-Origin: '*'`)
- Current mitigation: None
- Recommendations: Configure specific allowed origins for production

**No Input Validation on Backend:**
- Risk: Injection attacks, malformed data processing
- Files: `backend/server.js` (entire file - minimal validation)
- Current mitigation: Basic field presence checks only
- Recommendations: Add Joi or Zod validation schemas; sanitize all inputs

## Performance Bottlenecks

**Large Component Files:**
- Problem: Several components exceed 500 lines, impacting load time and maintainability
- Files:
  - `backend/career-algorithm.js` (1157 lines)
  - `frontend/src/components/onboarding/EnhancedProfileSetup.tsx` (921 lines)
  - `frontend/src/components/achievements/RewardsTiers.tsx` (798 lines)
  - `frontend/src/components/settings/Settings.tsx` (743 lines)
  - `frontend/src/components/learning/LearningPath.tsx` (695 lines)
  - `backend/server.js` (689 lines)
- Cause: Components accumulating functionality without decomposition
- Improvement path: Split into smaller, focused components; extract hooks; use composition

**No Code Splitting:**
- Problem: Entire application loaded upfront
- Files: No dynamic imports found in route definitions
- Cause: Static imports throughout
- Improvement path: Add React.lazy for route-based code splitting

**Synchronous File Operations:**
- Problem: Backend uses synchronous file reads
- Files: `backend/career-algorithm.js` (line 15 - `fs.readFileSync`)
- Cause: Quick implementation without async consideration
- Improvement path: Convert to async/await with fs.promises

## Fragile Areas

**Session Storage for Onboarding State:**
- Files:
  - `frontend/src/components/onboarding/EnhancedProfileSetup.tsx` (lines 124-143)
  - `frontend/src/utils/onboardingMigration.ts`
- Why fragile: Data lost on browser close; no server backup; relies on sessionStorage API availability
- Safe modification: Always check for null; validate parsed JSON
- Test coverage: No tests for storage edge cases

**WebSocket Reconnection Logic:**
- Files: `frontend/src/hooks/useWebSocket.ts` (lines 146-155)
- Why fragile: Multiple state variables track connection status; reconnect logic in event handlers
- Safe modification: Test all connection state transitions manually
- Test coverage: No unit tests for reconnection scenarios

**API Client Token Refresh:**
- Files: `frontend/src/services/api/client.ts` (lines 56-115)
- Why fragile: Complex promise queue for concurrent requests during refresh; race conditions possible
- Safe modification: Test with concurrent requests; verify subscriber cleanup
- Test coverage: No tests for concurrent refresh scenarios

## Scaling Limits

**JSON Server Backend:**
- Current capacity: Suitable for development/demo only
- Limit: Cannot handle concurrent writes; no query optimization
- Scaling path: Replace with proper database (PostgreSQL) and API framework (FastAPI/Express)

**In-Memory Data Storage:**
- Current capacity: Limited by server memory
- Limit: Data lost on server restart; no persistence guarantees
- Scaling path: Implement proper database with connection pooling

## Dependencies at Risk

**JSON Server as Production Backend:**
- Risk: Not designed for production use; no auth, no validation, no scaling
- Impact: Current backend is development-only tool
- Migration plan: Implement FastAPI backend as planned in INTEGRATION_PLAN.md

## Missing Critical Features

**No Unit Tests for Frontend Components:**
- Problem: Only E2E tests exist
- Blocks: Confident refactoring; regression detection; CI/CD pipeline
- Files: No `*.test.tsx` files in `frontend/src/`

**No Error Boundary Implementation:**
- Problem: React errors can crash entire application
- Blocks: Graceful error handling; user-friendly error states
- Files: No ErrorBoundary component found

**No Logging Infrastructure:**
- Problem: Only console.log/error statements
- Blocks: Production debugging; error tracking; audit trails

## Test Coverage Gaps

**API Service Layer:**
- What's not tested: `frontend/src/services/api/*.ts` - unit tests for service methods
- Files: All files in `frontend/src/services/api/`
- Risk: API integration bugs discovered only in E2E or production
- Priority: High

**Context Providers:**
- What's not tested: Context state management, provider logic
- Files: `frontend/src/contexts/*.tsx`
- Risk: State management bugs cause cascading failures
- Priority: High

**Utility Functions:**
- What's not tested: `frontend/src/utils/` - validation, error handling, cache
- Files: `frontend/src/utils/validation.ts`, `frontend/src/utils/cache.ts`, `frontend/src/utils/errorHandler.ts`
- Risk: Edge cases in utility functions cause widespread issues
- Priority: Medium

**Backend Endpoints:**
- What's not tested: `backend/server.js` - no unit tests
- Files: `backend/server.js`, `backend/services/*.js`
- Risk: Backend bugs only found in integration testing
- Priority: High

---

*Concerns audit: 2026-02-02*
