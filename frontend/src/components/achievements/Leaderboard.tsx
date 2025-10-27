import { useState } from 'react'

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  points: number
  level: number
  weeklyPoints: number
  monthlyPoints: number
  streak: number
  achievements: number
  isCurrentUser?: boolean
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'weekly' | 'monthly' | 'daily'
  progress: number
  total: number
  reward: number
  timeLeft: string
  participants: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    name: 'Alex Chen',
    avatar: '👨‍💻',
    points: 15420,
    level: 28,
    weeklyPoints: 890,
    monthlyPoints: 3240,
    streak: 42,
    achievements: 24
  },
  {
    id: '2',
    rank: 2,
    name: 'Maria Rodriguez',
    avatar: '👩‍🎓',
    points: 14850,
    level: 26,
    weeklyPoints: 720,
    monthlyPoints: 2980,
    streak: 28,
    achievements: 22
  },
  {
    id: '3',
    rank: 3,
    name: 'James Wilson',
    avatar: '👨‍🚀',
    points: 13960,
    level: 25,
    weeklyPoints: 650,
    monthlyPoints: 2750,
    streak: 35,
    achievements: 20
  },
  {
    id: '15',
    rank: 15,
    name: 'You',
    avatar: '👤',
    points: 8420,
    level: 18,
    weeklyPoints: 340,
    monthlyPoints: 1560,
    streak: 7,
    achievements: 12,
    isCurrentUser: true
  }
]

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Week Sprint',
    description: 'Complete 5 courses this week',
    type: 'weekly',
    progress: 3,
    total: 5,
    reward: 500,
    timeLeft: '3d 14h',
    participants: 234
  },
  {
    id: '2',
    title: 'Assessment Master',
    description: 'Score 90%+ on 3 assessments',
    type: 'weekly',
    progress: 1,
    total: 3,
    reward: 300,
    timeLeft: '5d 8h',
    participants: 156
  },
  {
    id: '3',
    title: 'Learning Streak',
    description: 'Maintain 14-day learning streak',
    type: 'monthly',
    progress: 7,
    total: 14,
    reward: 1000,
    timeLeft: '12d 6h',
    participants: 89
  },
  {
    id: '4',
    title: 'Daily Focus',
    description: 'Study for 2 hours today',
    type: 'daily',
    progress: 1.2,
    total: 2,
    reward: 50,
    timeLeft: '8h 45m',
    participants: 456
  }
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard')
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly')
  const [challengeFilter, setChallengeFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all')

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-300'
      case 2: return 'bg-gray-100 border-gray-300'
      case 3: return 'bg-orange-100 border-orange-300'
      default: return 'bg-white border-gray-200'
    }
  }

  const getTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800'
      case 'weekly': return 'bg-blue-100 text-blue-800'
      case 'monthly': return 'bg-purple-100 text-purple-800'
    }
  }

  const filteredChallenges = mockChallenges.filter(challenge =>
    challengeFilter === 'all' || challenge.type === challengeFilter
  )

  const currentUser = mockLeaderboard.find(entry => entry.isCurrentUser)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Leaderboard & Challenges</h1>
              <p className="text-gray-600 dark:text-gray-300">Compete with peers and join exciting challenges</p>
            </div>
          </div>

          {/* Competition Update Notification */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">🚀</span>
              <div>
                <p className="text-orange-800 font-medium">You've moved up 3 positions!</p>
                <p className="text-orange-700 text-sm">
                  Great work this week! You're now #15 on the leaderboard. Keep learning to climb higher!
                </p>
              </div>
            </div>
          </div>

          {/* Current User Stats */}
          {currentUser && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center text-2xl">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Your Ranking</h3>
                    <p className="text-gray-600 dark:text-gray-300">Rank #{currentUser.rank} • Level {currentUser.level}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#4A9E3D]">{currentUser.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#3DAEDB]">{currentUser.weeklyPoints}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">This Week</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2C857A]">{currentUser.streak}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{currentUser.achievements}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
            { id: 'challenges', label: 'Challenges', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            {/* Time Frame Selector */}
            <div className="flex justify-end mb-6">
              <div className="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {['weekly', 'monthly', 'allTime'].map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setTimeFrame(frame as typeof timeFrame)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      timeFrame === frame
                        ? 'bg-[#3DAEDB] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB]'
                    }`}
                  >
                    {frame === 'allTime' ? 'All Time' : frame.charAt(0).toUpperCase() + frame.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {mockLeaderboard.slice(0, 3).map((_, index) => {
                const positions = [1, 0, 2] // Reorder for podium visual effect
                const actualEntry = mockLeaderboard[positions[index]]
                return (
                  <div
                    key={actualEntry.id}
                    className={`text-center ${
                      index === 1 ? 'order-first' : index === 0 ? 'order-2' : 'order-3'
                    }`}
                  >
                    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${getRankColor(actualEntry.rank)}`}>
                      <div className="text-4xl mb-2">{getRankMedal(actualEntry.rank)}</div>
                      <div className="text-3xl mb-2">{actualEntry.avatar}</div>
                      <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-1">{actualEntry.name}</h3>
                      <p className="text-lg font-bold text-[#4A9E3D]">{actualEntry.points.toLocaleString()} pts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Level {actualEntry.level}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Full Rankings</h2>
              </div>
              <div className="divide-y">
                {mockLeaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      entry.isCurrentUser ? 'bg-[#4A9E3D]/5 border-l-4 border-[#4A9E3D]' : ''
                    }`}
                  >
                    <div className="w-12 text-center">
                      <span className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">
                        {entry.rank <= 3 ? getRankMedal(entry.rank) : `#${entry.rank}`}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-[#3DAEDB]/20 rounded-full flex items-center justify-center text-xl">
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-[#4A9E3D]' : 'text-[#1C3D6E] dark:text-[#3DAEDB]'}`}>
                        {entry.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Level {entry.level} • {entry.achievements} achievements</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{entry.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div>
                        <div className="font-bold text-[#3DAEDB]">{entry.weeklyPoints}</div>
                        <div className="text-xs text-gray-500">Weekly</div>
                      </div>
                      <div>
                        <div className="font-bold text-[#2C857A]">{entry.streak}</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            {/* Challenge Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'daily', 'weekly', 'monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChallengeFilter(filter as typeof challengeFilter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    challengeFilter === filter
                      ? 'bg-[#3DAEDB] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] bg-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Active Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg">{challenge.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                          {challenge.type}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏰ {challenge.timeLeft} left</span>
                        <span>👥 {challenge.participants} joined</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#4A9E3D]">{challenge.reward}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-dark h-3 rounded-full"
                        style={{ width: `${Math.min((challenge.progress / challenge.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {challenge.progress >= challenge.total ? (
                      <button className="flex-1 bg-[#4A9E3D] text-white py-2 px-4 rounded-lg font-medium">
                        Claim Reward
                      </button>
                    ) : (
                      <>
                        <button className="btn-primary flex-1">
                          Continue
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge Tips */}
            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">💡</span>
                <div>
                  <p className="text-purple-800 font-medium">Challenge Strategy</p>
                  <p className="text-purple-700 text-sm">
                    Focus on daily challenges first - they're easier to complete and build momentum for weekly and monthly goals!
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