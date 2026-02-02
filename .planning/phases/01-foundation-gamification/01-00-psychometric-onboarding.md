# Plan 01-00: Psychometric Onboarding Enhancement

**Phase**: 1 - Foundation & Gamification
**Created**: 2026-02-02
**Completed**: 2026-02-02
**Status**: Complete
**Commit**: 888faf1

## Objective

Enhance the existing onboarding flow to implement Template A (Ultra-Fast 90-second psychometric assessment) that captures motivation, level, learning style, time commitment, and language preference for immediate personalization.

## Requirements Addressed

- Foundation for GAM personalization (XP rewards vary by commitment level)
- Foundation for MIC-01/02/03 (daily goals based on time commitment)
- Enables adaptive content delivery

## Success Criteria

- [x] 6-screen onboarding flow completes in under 90 seconds
- [x] User profile captures: motivation, level, learning_style, time_commitment, target_language
- [x] Learner archetype auto-generated from responses
- [x] Progress indicator shows 5 dots (screens 1-5, welcome is screen 0)
- [x] Mobile-first with large tap targets
- [x] Skip option available but discouraged
- [x] Privacy reassurance displayed at end

## Technical Approach

### 1. Extend OnboardingContext

Location: `frontend/src/contexts/OnboardingContext.tsx`

Current fields to preserve: `learningStyle`, `timeCommitment`, `primaryInterest`

New/enhanced profile structure:
```typescript
interface LearnerProfile {
  motivation: 'school' | 'culture' | 'communication' | 'travel' | 'personal'
  level: 'new' | 'few_words' | 'sentences'
  learningStyle: 'listening' | 'watching' | 'reading' | 'mixed'
  timeCommitment: 'short' | 'medium' | 'flexible'
  targetLanguage: string
  archetype?: 'structured' | 'cultural_explorer' | 'casual' | 'conversational'
}
```

### 2. Create Psychometric Flow Components

Location: `frontend/src/components/onboarding/psychometric/`

Files to create:
- `PsychometricFlow.tsx` - Main flow orchestrator
- `WelcomeScreen.tsx` - Screen 0 (non-scored)
- `MotivationScreen.tsx` - Screen 1
- `LevelScreen.tsx` - Screen 2
- `LearningStyleScreen.tsx` - Screen 3
- `TimeCommitmentScreen.tsx` - Screen 4
- `LanguageScreen.tsx` - Screen 5
- `ProgressIndicator.tsx` - 5-dot progress indicator
- `OptionCard.tsx` - Reusable tap card with emoji + label

### 3. Archetype Derivation Logic

Location: `frontend/src/utils/learnerArchetype.ts`

```typescript
function deriveArchetype(profile: LearnerProfile): Archetype {
  if (profile.motivation === 'school' && profile.timeCommitment !== 'short') {
    return 'structured'
  }
  if (profile.motivation === 'culture') {
    return 'cultural_explorer'
  }
  if (profile.timeCommitment === 'short' || profile.learningStyle === 'mixed') {
    return 'casual'
  }
  if (profile.motivation === 'communication') {
    return 'conversational'
  }
  return 'casual' // default
}
```

### 4. Integration Points

- Update router to include psychometric flow before dashboard
- Persist profile to backend via `onboardingService`
- Use profile in gamification engine (daily goal suggestions)

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/components/onboarding/psychometric/PsychometricFlow.tsx` | Flow orchestrator |
| `frontend/src/components/onboarding/psychometric/WelcomeScreen.tsx` | Welcome message |
| `frontend/src/components/onboarding/psychometric/MotivationScreen.tsx` | Why learning |
| `frontend/src/components/onboarding/psychometric/LevelScreen.tsx` | Current level |
| `frontend/src/components/onboarding/psychometric/LearningStyleScreen.tsx` | How to learn |
| `frontend/src/components/onboarding/psychometric/TimeCommitmentScreen.tsx` | Time available |
| `frontend/src/components/onboarding/psychometric/LanguageScreen.tsx` | Target language |
| `frontend/src/components/onboarding/psychometric/ProgressIndicator.tsx` | 5-dot progress |
| `frontend/src/components/onboarding/psychometric/OptionCard.tsx` | Tap card component |
| `frontend/src/utils/learnerArchetype.ts` | Archetype derivation |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/contexts/OnboardingContext.tsx` | Extend LearnerProfile interface |
| `frontend/src/router.tsx` | Add psychometric route |
| `frontend/src/services/api/onboarding.ts` | Add profile save endpoint |

## Dependencies

- None (first plan in phase)

## Blocked By

- None

## Blocks

- 01-02 (XP system uses time_commitment for daily goal calculation)
- 01-06 (Microlearning uses learner profile)

## Estimated Scope

- Components: 9 new
- Utils: 1 new
- Context: 1 modified
- Lines: ~600

## UX Copy (from Template A)

**Screen 0 - Welcome:**
"Welcome to Tajiconnect 👋 Let's personalize your learning experience. This takes less than 2 minutes."
CTA: "Start learning"

**Screen 1 - Motivation:**
"Why do you want to learn this language?"
Options: 🎓 School/Exams, 🌍 Culture & heritage, 💬 Communication, ✈️ Travel, ❤️ Personal interest

**Screen 2 - Level:**
"How would you describe your current level?"
Options: 🌱 New learner, 🌿 Know a few words, 🌳 Can form sentences

**Screen 3 - Learning Style:**
"How do you prefer to learn?"
Options: 🎧 Listening, 🎥 Watching, 📖 Reading, 🔄 A mix

**Screen 4 - Time:**
"How much time can you spend learning?"
Options: ⏱️ 5–10 min/day, ⏰ 15–30 min/day, 📆 Few times a week

**Screen 5 - Language:**
"Which language do you want to start with?"
Options: Swahili, Yoruba, Amharic, Hausa, Igbo, Zulu

**End Copy:**
"🎉 All set! Your learning path is ready."
Privacy: "Your answers help us personalize your experience. We never sell your data."

---
*Plan created: 2026-02-02*
