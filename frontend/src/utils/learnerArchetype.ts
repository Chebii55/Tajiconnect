/**
 * Learner Archetype Derivation Utility
 * Derives learner archetypes from psychometric profile data
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Motivation = 'school' | 'culture' | 'communication' | 'travel' | 'personal'
export type Level = 'new' | 'few_words' | 'sentences'
export type LearningStyleType = 'listening' | 'watching' | 'reading' | 'mixed'
export type TimeCommitmentType = 'short' | 'medium' | 'flexible'
export type Archetype = 'structured' | 'cultural_explorer' | 'casual' | 'conversational'

export interface LearnerProfile {
  motivation: Motivation
  level: Level
  learningStyle: LearningStyleType
  timeCommitment: TimeCommitmentType
  targetLanguage: string
  archetype?: Archetype
}

// ============================================
// ARCHETYPE DERIVATION
// ============================================

/**
 * Derives a learner archetype based on profile responses
 *
 * Archetypes:
 * - structured: School/exam focused learners with moderate-high time commitment
 * - cultural_explorer: Culture and heritage motivated learners
 * - casual: Short time commitment or mixed learning style
 * - conversational: Communication-focused learners
 */
export function deriveArchetype(profile: Omit<LearnerProfile, 'archetype'>): Archetype {
  // School/exam motivation with non-short time commitment = structured learner
  if (profile.motivation === 'school' && profile.timeCommitment !== 'short') {
    return 'structured'
  }

  // Culture/heritage motivation = cultural explorer
  if (profile.motivation === 'culture') {
    return 'cultural_explorer'
  }

  // Short time commitment or mixed learning style = casual learner
  if (profile.timeCommitment === 'short' || profile.learningStyle === 'mixed') {
    return 'casual'
  }

  // Communication-focused = conversational learner
  if (profile.motivation === 'communication') {
    return 'conversational'
  }

  // Default to casual for travel and personal interest motivations
  return 'casual'
}

/**
 * Returns a human-readable description of the archetype
 */
export function getArchetypeDescription(archetype: Archetype): string {
  const descriptions: Record<Archetype, string> = {
    structured: 'You thrive with clear goals and structured learning paths. We will provide systematic lessons with measurable progress.',
    cultural_explorer: 'You are driven by cultural curiosity. Expect rich context, stories, and cultural insights woven into your lessons.',
    casual: 'You prefer flexible, bite-sized learning. We will keep sessions short and engaging to fit your lifestyle.',
    conversational: 'You want to communicate effectively. We will focus on practical phrases and real-world conversations.',
  }
  return descriptions[archetype]
}

/**
 * Returns the daily XP goal based on time commitment
 */
export function getDailyXPGoal(timeCommitment: TimeCommitmentType): number {
  const xpGoals: Record<TimeCommitmentType, number> = {
    short: 20,    // 5-10 min/day
    medium: 50,   // 15-30 min/day
    flexible: 30, // Few times a week (averaged daily)
  }
  return xpGoals[timeCommitment]
}

/**
 * Returns suggested session duration in minutes based on time commitment
 */
export function getSuggestedSessionDuration(timeCommitment: TimeCommitmentType): number {
  const durations: Record<TimeCommitmentType, number> = {
    short: 5,
    medium: 15,
    flexible: 10,
  }
  return durations[timeCommitment]
}

export default deriveArchetype
