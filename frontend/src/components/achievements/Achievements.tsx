import { useState } from 'react'
import {
  Target,
  Trophy,
  Flame,
  Palette,
  Award,
  Sparkles
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'milestone' | 'performance' | 'consistency' | 'skill' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  progress: number
  total: number
  unlocked: boolean
  unlockedDate?: string
  requirements: string[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  level: number
  maxLevel: number
  category: string
  progress: number
  earned: boolean
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first course',
    icon: <Target className="w-6 h-6" />,
    category: 'milestone',
    rarity: 'common',
    points: 100,
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedDate: '2025-01-10',
    requirements: ['Complete any course']
  },
  {
    id: '2',
    title: 'Assessment Master',
    description: 'Score above 80% in all assessments',
    icon: <Trophy className="w-6 h-6" />,
    category: 'performance',
    rarity: 'rare',
    points: 500,
    progress: 3,
    total: 5,
    unlocked: false,
    requirements: ['Score 80%+ on 5 different assessments']
  },
  {
    id: '3',
    title: 'Week Warrior',
    description: 'Learn for 7 consecutive days',
    icon: <Flame className="w-6 h-6" />,
    category: 'consistency',
    rarity: 'epic',
    points: 750,
    progress: 7,
    total: 7,
    unlocked: true,
    unlockedDate: '2025-01-15',
    requirements: ['Maintain 7-day learning streak']
  },
  {
    id: '4',
    title: 'Code Ninja',
    description: 'Master 10 programming skills',
    icon: '⚔️',
    category: 'skill',
    rarity: 'legendary',
    points: 1500,
    progress: 3,
    total: 10,
    unlocked: false,
    requirements: ['Reach advanced level in 10 programming skills']
  },
  {
    id: '5',
    title: 'Speed Learner',
    description: 'Complete 3 courses in one month',
    icon: '⚡',
    category: 'performance',
    rarity: 'rare',
    points: 600,
    progress: 2,
    total: 3,
    unlocked: false,
    requirements: ['Complete 3 courses within 30 days']
  },
  {
    id: '6',
    title: 'Knowledge Sharer',
    description: 'Help 5 fellow learners',
    icon: '🤝',
    category: 'social',
    rarity: 'epic',
    points: 800,
    progress: 1,
    total: 5,
    unlocked: false,
    requirements: ['Provide help to 5 different learners']
  }
]

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Python Explorer',
    description: 'Programming proficiency in Python',
    icon: '🐍',
    level: 3,
    maxLevel: 5,
    category: 'Programming',
    progress: 78,
    earned: true
  },
  {
    id: '2',
    name: 'Data Detective',
    description: 'Data analysis and visualization skills',
    icon: '🔍',
    level: 2,
    maxLevel: 5,
    category: 'Data Science',
    progress: 45,
    earned: true
  },
  {
    id: '3',
    name: 'Design Guru',
    description: 'UI/UX design capabilities',
    icon: <Palette className="w-6 h-6" />,
    level: 1,
    maxLevel: 5,
    category: 'Design',
    progress: 25,
    earned: true
  },
  {
    id: '4',
    name: 'Algorithm Master',
    description: 'Advanced problem-solving skills',
    icon: '🧠',
    level: 0,
    maxLevel: 5,
    category: 'Computer Science',
    progress: 15,
    earned: false
  }
]

export default function Achievements() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements')
  const [filter, setFilter] = useState<'all' | Achievement['category']>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:border-darkMode-border dark:bg-darkMode-surface'
      case 'rare': return 'border-blue-300 bg-blue-50 dark:border-info dark:bg-info/10'
      case 'epic': return 'border-purple-300 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
      case 'legendary': return 'border-accent-gold bg-accent-goldLight/20 dark:border-darkMode-accent dark:bg-darkMode-accent/10'
    }
  }

  const getRarityText = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-darkMode-textSecondary'
      case 'rare': return 'text-blue-600 dark:text-info'
      case 'epic': return 'text-purple-600 dark:text-purple-400'
      case 'legendary': return 'text-accent-gold dark:text-darkMode-accent'
    }
  }

  const getBadgeLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 text-gray-600 dark:bg-darkMode-surface dark:text-darkMode-textSecondary'
      case 1: return 'bg-bronze-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-600'
      case 2: return 'bg-silver-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      case 3: return 'bg-accent-goldLight/30 text-accent-gold dark:bg-darkMode-accent/20 dark:text-darkMode-accent'
      case 4: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 5: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-darkMode-surface dark:text-darkMode-textSecondary'
    }
  }

  const getBadgeLevelText = (level: number) => {
    switch (level) {
      case 0: return 'Not Earned'
      case 1: return 'Bronze'
      case 2: return 'Silver'
      case 3: return 'Gold'
      case 4: return 'Platinum'
      case 5: return 'Diamond'
      default: return 'Unknown'
    }
  }

  const filteredAchievements = mockAchievements.filter(achievement => {
    const categoryMatch = filter === 'all' || achievement.category === filter
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked
    return categoryMatch && unlockedMatch
  })

  const totalPoints = mockAchievements
    .filter(a => a.unlocked)
    .reduce((sum, achievement) => sum + achievement.points, 0)

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-accent-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">Achievements & Rewards</h1>
              <p className="text-gray-600 dark:text-darkMode-textSecondary">Track your progress and unlock exciting rewards</p>
            </div>
          </div>

          {/* Achievement Unlock Notification */}
          <div className="bg-accent-goldLight/20 border border-accent-gold/30 rounded-lg p-4 mb-6 dark:bg-darkMode-accent/10 dark:border-darkMode-accent/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-gold dark:text-darkMode-accent" />
              <div>
                <p className="text-yellow-800 dark:text-darkMode-accent font-medium">New Achievement Unlocked!</p>
                <p className="text-yellow-700 dark:text-darkMode-textSecondary text-sm">
                  "Week Warrior" - You've maintained a 7-day learning streak! Keep it up!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary dark:text-darkMode-success">{totalPoints}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Total Points</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-light dark:text-darkMode-link">{unlockedCount}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Achievements</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-forest-sage dark:text-darkMode-progress">{mockBadges.filter(b => b.earned).length}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Badges Earned</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">15</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Leaderboard Rank</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-darkMode-surface rounded-lg shadow-sm">
          {[
            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
            { id: 'badges', label: 'Skill Badges', icon: <Award className="w-5 h-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
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

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex gap-2">
                {['all', 'milestone', 'performance', 'consistency', 'skill', 'social'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category as typeof filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === category
                        ? 'bg-primary-light text-white dark:bg-darkMode-accent dark:text-darkMode-bg'
                        : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text bg-white dark:bg-darkMode-surface'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-gray-600 dark:text-darkMode-textSecondary">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-darkMode-border focus:ring-primary-light dark:focus:ring-darkMode-accent"
                />
                <span>Unlocked only</span>
              </label>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                    achievement.unlocked
                      ? getRarityColor(achievement.rarity)
                      : 'border-gray-200 bg-gray-50 opacity-75 dark:border-darkMode-border dark:bg-darkMode-surfaceHover'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`text-6xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      achievement.unlocked ? 'text-primary-dark dark:text-darkMode-text' : 'text-gray-500 dark:text-darkMode-textMuted'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600 dark:text-darkMode-textSecondary' : 'text-gray-400 dark:text-darkMode-textMuted'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium capitalize ${getRarityText(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                      <span className={`font-bold ${
                        achievement.unlocked ? 'text-secondary dark:text-darkMode-success' : 'text-gray-400 dark:text-darkMode-textMuted'
                      }`}>
                        {achievement.points} pts
                      </span>
                    </div>

                    {!achievement.unlocked && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                          <div
                            className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-xs text-gray-500 dark:text-darkMode-textMuted text-center">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="border-t dark:border-darkMode-border pt-3">
                      <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mb-2">Requirements:</p>
                      <ul className="space-y-1">
                        {achievement.requirements.map((req, index) => (
                          <li key={index} className="text-xs text-gray-600 dark:text-darkMode-textSecondary flex items-center gap-2">
                            <span className={achievement.unlocked ? 'text-secondary dark:text-darkMode-success' : 'text-gray-400 dark:text-darkMode-textMuted'}>
                              {achievement.unlocked ? '✓' : '○'}
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                    badge.earned ? 'border-secondary dark:border-darkMode-success' : 'border-gray-200 dark:border-darkMode-border'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`text-5xl mb-3 ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      badge.earned ? 'text-primary-dark dark:text-darkMode-text' : 'text-gray-500 dark:text-darkMode-textMuted'
                    }`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      badge.earned ? 'text-gray-600 dark:text-darkMode-textSecondary' : 'text-gray-400 dark:text-darkMode-textMuted'
                    }`}>
                      {badge.description}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getBadgeLevelColor(badge.level)}`}>
                      {getBadgeLevelText(badge.level)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                        Level {badge.level}/{badge.maxLevel}
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {Array.from({ length: badge.maxLevel }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < badge.level ? 'bg-secondary dark:bg-darkMode-success' : 'bg-gray-200 dark:bg-darkMode-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {badge.earned && badge.level < badge.maxLevel && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                          <span>Next Level Progress</span>
                          <span>{badge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                          <div
                            className="bg-primary-dark dark:bg-darkMode-progress h-2 rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <span className="text-xs text-gray-500 dark:text-darkMode-textMuted bg-gray-100 dark:bg-darkMode-surfaceHover px-2 py-1 rounded-full">
                        {badge.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Badge Progress Feedback */}
            <div className="mt-8 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Target className="w-6 h-6 text-blue-600 dark:text-info" />
                <div>
                  <p className="text-blue-800 dark:text-info font-medium">Badge Progress Tip</p>
                  <p className="text-blue-700 dark:text-darkMode-textSecondary text-sm">
                    Focus on Algorithm Master badge by completing more computer science courses to unlock advanced problem-solving skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
