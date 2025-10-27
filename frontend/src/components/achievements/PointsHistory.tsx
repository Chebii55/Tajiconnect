import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Award, Book, Target, Users, Filter, Download, Search } from 'lucide-react';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  reason: string;
  category: 'course' | 'assessment' | 'achievement' | 'social' | 'milestone' | 'reward' | 'event';
  date: string;
  relatedItem?: string;
  multiplier?: number;
}

interface PointsSummary {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  thisMonth: number;
  lastMonth: number;
  averageDaily: number;
}

const PointsHistory: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockTransactions: PointsTransaction[] = [
    {
      id: '1',
      type: 'earned',
      amount: 500,
      reason: 'Completed "Advanced React Patterns" course',
      category: 'course',
      date: '2024-03-15T10:30:00Z',
      relatedItem: 'Advanced React Patterns',
      multiplier: 1.5
    },
    {
      id: '2',
      type: 'earned',
      amount: 200,
      reason: 'Perfect score on JavaScript Assessment',
      category: 'assessment',
      date: '2024-03-14T14:20:00Z',
      relatedItem: 'JavaScript Fundamentals Quiz'
    },
    {
      id: '3',
      type: 'spent',
      amount: -300,
      reason: 'Redeemed Premium Course Access',
      category: 'reward',
      date: '2024-03-13T09:15:00Z',
      relatedItem: 'Premium Course Bundle'
    },
    {
      id: '4',
      type: 'bonus',
      amount: 150,
      reason: 'Weekly learning streak bonus',
      category: 'milestone',
      date: '2024-03-12T00:00:00Z',
      multiplier: 2.0
    },
    {
      id: '5',
      type: 'earned',
      amount: 100,
      reason: 'Helped peer in discussion forum',
      category: 'social',
      date: '2024-03-11T16:45:00Z',
      relatedItem: 'Community Support'
    },
    {
      id: '6',
      type: 'earned',
      amount: 75,
      reason: 'Completed daily challenge',
      category: 'event',
      date: '2024-03-10T12:00:00Z',
      relatedItem: 'Daily Coding Challenge'
    },
    {
      id: '7',
      type: 'earned',
      amount: 300,
      reason: 'Achievement unlocked: Course Completionist',
      category: 'achievement',
      date: '2024-03-09T18:30:00Z',
      relatedItem: 'Course Completionist Badge'
    },
    {
      id: '8',
      type: 'spent',
      amount: -150,
      reason: 'Purchased learning resource',
      category: 'reward',
      date: '2024-03-08T11:20:00Z',
      relatedItem: 'Advanced JavaScript Ebook'
    }
  ];

  const mockSummary: PointsSummary = {
    totalEarned: 2450,
    totalSpent: 450,
    currentBalance: 2000,
    thisMonth: 825,
    lastMonth: 650,
    averageDaily: 35
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'course', label: 'Courses' },
    { value: 'assessment', label: 'Assessments' },
    { value: 'achievement', label: 'Achievements' },
    { value: 'social', label: 'Social' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'reward', label: 'Rewards' },
    { value: 'event', label: 'Events' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'earned', label: 'Earned' },
    { value: 'spent', label: 'Spent' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'penalty', label: 'Penalty' }
  ];

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      const matchesSearch = searchTerm === '' ||
        transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.relatedItem?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, selectedType, searchTerm, mockTransactions]);

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'course': return <Book className="w-4 h-4" />;
      case 'assessment': return <Target className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600';
      case 'spent': return 'text-red-600';
      case 'bonus': return 'text-blue-600';
      case 'penalty': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Type,Amount,Category,Reason,Related Item\n" +
      filteredTransactions.map(t =>
        `${formatDate(t.date)},${t.type},${t.amount},${t.category},${t.reason},${t.relatedItem || ''}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "points_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1C3D6E] mb-2">Points History</h1>
          <p className="text-gray-600">Track your earning and spending patterns</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#4A9E3D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">{mockSummary.currentBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#4A9E3D] bg-opacity-10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#4A9E3D]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#3DAEDB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">{mockSummary.totalEarned.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#3DAEDB] bg-opacity-10 rounded-lg">
                <Award className="w-6 h-6 text-[#3DAEDB]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#2C857A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">+{mockSummary.thisMonth}</p>
                <p className="text-sm text-green-600">
                  +{Math.round(((mockSummary.thisMonth - mockSummary.lastMonth) / mockSummary.lastMonth) * 100)}% from last month
                </p>
              </div>
              <div className="p-3 bg-[#2C857A] bg-opacity-10 rounded-lg">
                <Calendar className="w-6 h-6 text-[#2C857A]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">{mockSummary.averageDaily}</p>
                <p className="text-sm text-gray-500">points per day</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year' | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#1C3D6E] text-white rounded-lg hover:bg-[#2A4F7C] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1C3D6E]">
              Transaction History ({filteredTransactions.length} transactions)
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'earned' ? 'bg-green-100' :
                      transaction.type === 'spent' ? 'bg-red-100' :
                      transaction.type === 'bonus' ? 'bg-blue-100' :
                      'bg-orange-100'
                    }`}>
                      {getTransactionIcon(transaction.category)}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.reason}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="capitalize">{transaction.category}</span>
                        {transaction.relatedItem && (
                          <>
                            <span>•</span>
                            <span>{transaction.relatedItem}</span>
                          </>
                        )}
                        {transaction.multiplier && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">
                              {transaction.multiplier}x multiplier
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

        {/* Success Notification */}
        <div className="fixed bottom-4 right-4 bg-[#4A9E3D] text-white px-6 py-3 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300" id="success-notification">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>Points history updated successfully!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;