import { useState } from 'react'

interface Tier {
  id: string
  name: string
  level: number
  requiredPoints: number
  maxPoints: number
  color: string
  icon: string
  benefits: string[]
  exclusiveRewards: string[]
  memberCount: number
  nextTierPreview?: string[]
}

interface UserProgress {
  currentPoints: number
  currentTier: number
  pointsToNextTier: number
  lifetimePoints: number
  tierProgress: number
  estimatedTimeToNext: string
  recentPointsGained: number
}

interface Reward {
  id: string
  title: string
  description: string
  points: number
  category: 'digital' | 'physical' | 'experience' | 'feature'
  availability: 'available' | 'limited' | 'coming_soon' | 'tier_locked'
  tier: number
  expiryDate?: string
  claimed: boolean
  popularity: number
  image: string
}

interface PointsActivity {
  id: string
  action: string
  points: number
  date: string
  category: 'learning' | 'achievement' | 'social' | 'bonus'
  tier: number
}

const mockTiers: Tier[] = [
  {
    id: 'bronze',
    name: 'Bronze Explorer',
    level: 1,
    requiredPoints: 0,
    maxPoints: 999,
    color: '#CD7F32',
    icon: '🥉',
    benefits: [
      'Basic progress tracking',
      'Course completion certificates',
      'Community forum access',
      'Monthly progress reports'
    ],
    exclusiveRewards: [
      'Welcome starter pack',
      'Basic achievement badges',
      'Standard profile themes'
    ],
    memberCount: 1250
  },
  {
    id: 'silver',
    name: 'Silver Scholar',
    level: 2,
    requiredPoints: 1000,
    maxPoints: 2999,
    color: '#C0C0C0',
    icon: '🥈',
    benefits: [
      'All Bronze benefits',
      'Priority support',
      'Advanced analytics',
      'Skill assessments',
      'Peer mentoring access'
    ],
    exclusiveRewards: [
      'Silver achievement badges',
      'Premium profile themes',
      '50% discount on select courses',
      'Early access to new features'
    ],
    memberCount: 850,
    nextTierPreview: ['Personal learning assistant', 'Custom learning paths', 'Expert mentoring']
  },
  {
    id: 'gold',
    name: 'Gold Achiever',
    level: 3,
    requiredPoints: 3000,
    maxPoints: 6999,
    color: '#FFD700',
    icon: '🥇',
    benefits: [
      'All Silver benefits',
      'Personal learning assistant',
      'Custom learning paths',
      'Expert mentoring sessions',
      'Premium content access',
      'Career coaching calls'
    ],
    exclusiveRewards: [
      'Gold achievement badges',
      'Exclusive learning materials',
      'Free certification exams',
      'VIP event invitations',
      'Personal brand consultation'
    ],
    memberCount: 420,
    nextTierPreview: ['Platinum status perks', 'Industry connections', 'Speaking opportunities']
  },
  {
    id: 'platinum',
    name: 'Platinum Master',
    level: 4,
    requiredPoints: 7000,
    maxPoints: 14999,
    color: '#E5E4E2',
    icon: '💎',
    benefits: [
      'All Gold benefits',
      'Direct industry connections',
      'Speaking opportunities',
      'Course creation tools',
      'Revenue sharing program',
      'White-glove support'
    ],
    exclusiveRewards: [
      'Platinum status badge',
      'Industry networking events',
      'Content creator benefits',
      'Executive coaching sessions',
      'Thought leadership platform'
    ],
    memberCount: 125,
    nextTierPreview: ['Diamond exclusivity', 'Advisory board access', 'Equity opportunities']
  },
  {
    id: 'diamond',
    name: 'Diamond Elite',
    level: 5,
    requiredPoints: 15000,
    maxPoints: 999999,
    color: '#4A90E2',
    icon: '💎',
    benefits: [
      'All Platinum benefits',
      'Advisory board access',
      'Equity participation opportunities',
      'Custom enterprise solutions',
      'Unlimited mentoring',
      'Global ambassador program'
    ],
    exclusiveRewards: [
      'Diamond elite status',
      'Equity investment opportunities',
      'Global leadership summit',
      'Personal board of advisors',
      'Legacy impact projects'
    ],
    memberCount: 25
  }
]

const mockUserProgress: UserProgress = {
  currentPoints: 1850,
  currentTier: 2,
  pointsToNextTier: 1150,
  lifetimePoints: 1850,
  tierProgress: 73.3,
  estimatedTimeToNext: '3-4 weeks',
  recentPointsGained: 340
}

const mockRewards: Reward[] = [
  {
    id: 'r1',
    title: 'Premium Course Bundle',
    description: 'Access to 5 premium courses of your choice',
    points: 500,
    category: 'digital',
    availability: 'available',
    tier: 1,
    claimed: false,
    popularity: 85,
    image: '📚'
  },
  {
    id: 'r2',
    title: 'One-on-One Mentoring Session',
    description: '60-minute session with an industry expert',
    points: 800,
    category: 'experience',
    availability: 'available',
    tier: 2,
    claimed: false,
    popularity: 92,
    image: '👥'
  },
  {
    id: 'r3',
    title: 'TajiConnect Branded Merchandise',
    description: 'Premium hoodie, water bottle, and notebook set',
    points: 1200,
    category: 'physical',
    availability: 'limited',
    tier: 2,
    expiryDate: '2025-03-01',
    claimed: false,
    popularity: 67,
    image: '👕'
  },
  {
    id: 'r4',
    title: 'Advanced Analytics Dashboard',
    description: 'Unlock detailed learning analytics and insights',
    points: 300,
    category: 'feature',
    availability: 'available',
    tier: 1,
    claimed: true,
    popularity: 78,
    image: '📊'
  },
  {
    id: 'r5',
    title: 'Career Coaching Package',
    description: '3-session career coaching with certified coach',
    points: 2000,
    category: 'experience',
    availability: 'tier_locked',
    tier: 3,
    claimed: false,
    popularity: 95,
    image: '🎯'
  },
  {
    id: 'r6',
    title: 'Industry Conference Ticket',
    description: 'All-access pass to top industry conference',
    points: 3500,
    category: 'experience',
    availability: 'coming_soon',
    tier: 3,
    claimed: false,
    popularity: 88,
    image: '🎟️'
  }
]

const mockPointsActivities: PointsActivity[] = [
  { id: 'p1', action: 'Completed Python Course', points: 150, date: '2025-01-15', category: 'learning', tier: 2 },
  { id: 'p2', action: 'Weekly Learning Streak', points: 100, date: '2025-01-14', category: 'achievement', tier: 2 },
  { id: 'p3', action: 'Helped Community Member', points: 50, date: '2025-01-13', category: 'social', tier: 2 },
  { id: 'p4', action: 'Assessment Perfect Score', points: 75, date: '2025-01-12', category: 'achievement', tier: 2 },
  { id: 'p5', action: 'Daily Login Bonus', points: 25, date: '2025-01-11', category: 'bonus', tier: 2 }
]

export default function RewardsTiers() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'rewards' | 'history'>('overview')
  const [rewardCategory, setRewardCategory] = useState<'all' | Reward['category']>('all')

  const currentTier = mockTiers.find(t => t.level === mockUserProgress.currentTier)!
  const nextTier = mockTiers.find(t => t.level === mockUserProgress.currentTier + 1)

  const getAvailabilityColor = (availability: Reward['availability']) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-darkMode-success/20 dark:text-darkMode-success'
      case 'limited': return 'bg-orange-100 text-orange-800 dark:bg-warning/20 dark:text-warning'
      case 'coming_soon': return 'bg-blue-100 text-blue-800 dark:bg-info/20 dark:text-info'
      case 'tier_locked': return 'bg-red-100 text-red-800 dark:bg-error/20 dark:text-error'
    }
  }

  const getCategoryIcon = (category: Reward['category']) => {
    switch (category) {
      case 'digital': return '💻'
      case 'physical': return '📦'
      case 'experience': return '✨'
      case 'feature': return '⚡'
    }
  }

  const filteredRewards = mockRewards.filter(reward =>
    rewardCategory === 'all' || reward.category === rewardCategory
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">Rewards & Tiers</h1>
              <p className="text-gray-600 dark:text-darkMode-textSecondary">Earn points, unlock tiers, and claim exclusive rewards</p>
            </div>
          </div>

          {/* Tier Progression Notification */}
          <div className="bg-accent-goldLight/20 dark:bg-darkMode-accent/10 border border-accent-gold/30 dark:border-darkMode-accent/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-accent-gold dark:text-darkMode-accent">⭐</span>
              <div>
                <p className="text-yellow-800 dark:text-darkMode-accent font-medium">You're making great progress!</p>
                <p className="text-yellow-700 dark:text-darkMode-textSecondary text-sm">
                  Only {mockUserProgress.pointsToNextTier} more points needed to reach {nextTier?.name}.
                  Estimated time: {mockUserProgress.estimatedTimeToNext}.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${currentTier.color}20`, border: `2px solid ${currentTier.color}` }}
                >
                  {currentTier.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{currentTier.name}</h2>
                  <p className="text-gray-600 dark:text-darkMode-textSecondary">Level {currentTier.level} • {mockUserProgress.currentPoints.toLocaleString()} points</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-secondary dark:text-darkMode-success">+{mockUserProgress.recentPointsGained}</div>
                <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">points this week</div>
              </div>
            </div>

            {nextTier && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span>{mockUserProgress.pointsToNextTier} points to go</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-3">
                  <div
                    className="bg-primary-dark dark:bg-darkMode-progress h-3 rounded-full"
                    style={{ width: `${mockUserProgress.tierProgress}%` }}
                  />
                </div>
                <div className="text-right text-sm font-bold text-secondary dark:text-darkMode-success mt-1">
                  {Math.round(mockUserProgress.tierProgress)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-darkMode-surface rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tiers', label: 'All Tiers', icon: '🏆' },
            { id: 'rewards', label: 'Rewards Store', icon: '🎁' },
            { id: 'history', label: 'Points History', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Next Tier Preview */}
            {nextTier && (
              <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">Unlock {nextTier.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">New Benefits</h3>
                    <div className="space-y-2">
                      {nextTier.nextTierPreview?.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-secondary dark:text-darkMode-success">✨</span>
                          <span className="text-gray-700 dark:text-darkMode-textSecondary text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">How to Get There</h3>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-darkMode-textSecondary">
                      <div>• Complete 2 more courses (+300 pts)</div>
                      <div>• Maintain learning streak (+500 pts)</div>
                      <div>• Help community members (+200 pts)</div>
                      <div>• Take skill assessments (+150 pts)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Tier Benefits */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">Your Current Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Access & Features</h3>
                  <div className="space-y-2">
                    {currentTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-secondary dark:text-darkMode-success">✓</span>
                        <span className="text-gray-700 dark:text-darkMode-textSecondary text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Exclusive Rewards</h3>
                  <div className="space-y-2">
                    {currentTier.exclusiveRewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-primary-light dark:text-darkMode-link">🎁</span>
                        <span className="text-gray-700 dark:text-darkMode-textSecondary text-sm">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Rewards */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Featured Rewards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRewards.slice(0, 3).map((reward) => (
                  <div key={reward.id} className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{reward.image}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(reward.availability)}`}>
                        {reward.availability.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-text mb-2">{reward.title}</h3>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-secondary dark:text-darkMode-success">{reward.points} pts</span>
                      <button
                        disabled={reward.availability !== 'available' || reward.claimed || mockUserProgress.currentPoints < reward.points}
                        className="px-4 py-2 bg-primary-light dark:bg-darkMode-accent text-white dark:text-darkMode-bg rounded-lg text-sm font-medium hover:bg-primary-dark dark:hover:bg-darkMode-accentHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reward.claimed ? 'Claimed' : 'Claim'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Points Earning Guide */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">How to Earn Points</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-info/10 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-1">Complete Courses</h3>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">50-200 points</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-darkMode-success/10 rounded-lg">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-1">Pass Assessments</h3>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">25-100 points</p>
                </div>
                <div className="text-center p-4 bg-accent-goldLight/20 dark:bg-darkMode-accent/10 rounded-lg">
                  <div className="text-2xl mb-2">🔥</div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-1">Learning Streaks</h3>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">10-500 points</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-1">Help Others</h3>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">10-75 points</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            {mockTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-2 ${
                  tier.level === mockUserProgress.currentTier ? 'border-secondary dark:border-darkMode-success' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${tier.color}20`, border: `2px solid ${tier.color}` }}
                    >
                      {tier.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{tier.name}</h2>
                      <p className="text-gray-600 dark:text-darkMode-textSecondary">
                        Level {tier.level} • {tier.requiredPoints.toLocaleString()} - {tier.maxPoints.toLocaleString()} points
                      </p>
                      <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">{tier.memberCount} members</p>
                    </div>
                  </div>

                  {tier.level === mockUserProgress.currentTier && (
                    <span className="bg-secondary dark:bg-darkMode-success text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Tier
                    </span>
                  )}
                  {tier.level < mockUserProgress.currentTier && (
                    <span className="bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary px-3 py-1 rounded-full text-sm font-medium">
                      Achieved
                    </span>
                  )}
                  {tier.level > mockUserProgress.currentTier && (
                    <span className="bg-blue-100 dark:bg-info/20 text-blue-600 dark:text-info px-3 py-1 rounded-full text-sm font-medium">
                      Locked
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Benefits & Features</h3>
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-secondary dark:text-darkMode-success">✓</span>
                          <span className="text-gray-700 dark:text-darkMode-textSecondary text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Exclusive Rewards</h3>
                    <div className="space-y-2">
                      {tier.exclusiveRewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-primary-light dark:text-darkMode-link">🎁</span>
                          <span className="text-gray-700 dark:text-darkMode-textSecondary text-sm">{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {tier.level > mockUserProgress.currentTier && (
                  <div className="mt-4 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg p-3">
                    <p className="text-blue-800 dark:text-info text-sm">
                      <strong>Need {(tier.requiredPoints - mockUserProgress.currentPoints).toLocaleString()} more points</strong> to unlock this tier.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rewards Store Tab */}
        {activeTab === 'rewards' && (
          <div>
            {/* Category Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'digital', 'physical', 'experience', 'feature'].map((category) => (
                <button
                  key={category}
                  onClick={() => setRewardCategory(category as typeof rewardCategory)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    rewardCategory === category
                      ? 'bg-primary-light dark:bg-darkMode-accent text-white dark:text-darkMode-bg'
                      : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text bg-white dark:bg-darkMode-surface'
                  }`}
                >
                  {category !== 'all' && <span>{getCategoryIcon(category as Reward['category'])}</span>}
                  {category}
                </button>
              ))}
            </div>

            {/* Points Balance */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text">Available Points</h3>
                  <p className="text-gray-600 dark:text-darkMode-textSecondary">You can spend these points on rewards</p>
                </div>
                <div className="text-3xl font-bold text-secondary dark:text-darkMode-success">
                  {mockUserProgress.currentPoints.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <div key={reward.id} className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{reward.image}</span>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(reward.availability)}`}>
                            {reward.availability.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm">{getCategoryIcon(reward.category)}</span>
                            <span className="text-xs text-gray-500 dark:text-darkMode-textMuted capitalize">{reward.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-secondary dark:text-darkMode-success">{reward.points}</div>
                        <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">points</div>
                      </div>
                    </div>

                    <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg mb-2">{reward.title}</h3>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm mb-4">{reward.description}</p>

                    <div className="space-y-2 text-xs text-gray-500 dark:text-darkMode-textMuted mb-4">
                      <div className="flex justify-between">
                        <span>Tier Required:</span>
                        <span>Level {reward.tier}+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Popularity:</span>
                        <span>{reward.popularity}%</span>
                      </div>
                      {reward.expiryDate && (
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span>{new Date(reward.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {reward.claimed ? (
                        <button className="w-full bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                          ✓ Already Claimed
                        </button>
                      ) : reward.availability === 'tier_locked' ? (
                        <button className="w-full bg-red-100 dark:bg-error/20 text-red-600 dark:text-error py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                          🔒 Tier {reward.tier} Required
                        </button>
                      ) : reward.availability === 'coming_soon' ? (
                        <button className="w-full bg-blue-100 dark:bg-info/20 text-blue-600 dark:text-info py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                          🕐 Coming Soon
                        </button>
                      ) : mockUserProgress.currentPoints < reward.points ? (
                        <button className="w-full bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                          💰 Need {reward.points - mockUserProgress.currentPoints} More Points
                        </button>
                      ) : (
                        <button className="btn-primary w-full">
                          Claim Reward
                        </button>
                      )}

                      <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-1">
                        <div
                          className="bg-primary-dark dark:bg-darkMode-progress h-1 rounded-full"
                          style={{ width: `${reward.popularity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Points History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Points Summary */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Points Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/10 dark:bg-darkMode-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary dark:text-darkMode-success">{mockUserProgress.lifetimePoints.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Lifetime Earned</div>
                </div>
                <div className="text-center p-4 bg-primary-light/10 dark:bg-darkMode-link/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary-light dark:text-darkMode-link">{mockUserProgress.currentPoints.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Current Balance</div>
                </div>
                <div className="text-center p-4 bg-forest-sage/10 dark:bg-darkMode-progress/10 rounded-lg">
                  <div className="text-2xl font-bold text-forest-sage dark:text-darkMode-progress">0</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Points Spent</div>
                </div>
                <div className="text-center p-4 bg-primary-dark/10 dark:bg-darkMode-text/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockUserProgress.recentPointsGained}</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">This Week</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Recent Points Activity</h2>
              <div className="space-y-3">
                {mockPointsActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-darkMode-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.category === 'learning' ? 'bg-blue-100 dark:bg-info/20' :
                        activity.category === 'achievement' ? 'bg-green-100 dark:bg-darkMode-success/20' :
                        activity.category === 'social' ? 'bg-purple-100 dark:bg-purple-900/20' :
                        'bg-accent-goldLight/30 dark:bg-darkMode-accent/20'
                      }`}>
                        <span className="text-sm">
                          {activity.category === 'learning' ? '📚' :
                           activity.category === 'achievement' ? '🏆' :
                           activity.category === 'social' ? '👥' : '🎁'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-dark dark:text-darkMode-text">{activity.action}</h3>
                        <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                          {new Date(activity.date).toLocaleDateString()} • Tier {activity.tier}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary dark:text-darkMode-success">+{activity.points}</div>
                      <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Points Chart Placeholder */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Points Earned Over Time</h2>
              <div className="h-64 bg-primary/10 dark:bg-darkMode-progress/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-600 dark:text-darkMode-textSecondary">Interactive points history chart</p>
                  <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">Track your points earning patterns over time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-info">💡</span>
            <div>
              <p className="text-blue-800 dark:text-info font-medium">Maximizing Your Rewards</p>
              <p className="text-blue-700 dark:text-darkMode-textSecondary text-sm">
                Focus on consistent daily learning to build streaks, help community members for social points,
                and maintain high assessment scores. Save points for higher-tier rewards for better value!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
