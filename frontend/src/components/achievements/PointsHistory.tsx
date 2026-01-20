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
      case 'earned': return 'text-green-600 dark:text-darkMode-success';
      case 'spent': return 'text-red-600 dark:text-error';
      case 'bonus': return 'text-blue-600 dark:text-info';
      case 'penalty': return 'text-orange-600 dark:text-warning';
      default: return 'text-gray-600 dark:text-darkMode-textSecondary';
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary-light/10 dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-2">Points History</h1>
          <p className="text-gray-600 dark:text-darkMode-textSecondary">Track your earning and spending patterns</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-l-4 border-secondary dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockSummary.currentBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-secondary/10 dark:bg-darkMode-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary dark:text-darkMode-success" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-l-4 border-primary-light dark:border-darkMode-link">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockSummary.totalEarned.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary-light/10 dark:bg-darkMode-link/10 rounded-lg">
                <Award className="w-6 h-6 text-primary-light dark:text-darkMode-link" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-l-4 border-forest-sage dark:border-darkMode-progress">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-1">This Month</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">+{mockSummary.thisMonth}</p>
                <p className="text-sm text-green-600 dark:text-darkMode-success">
                  +{Math.round(((mockSummary.thisMonth - mockSummary.lastMonth) / mockSummary.lastMonth) * 100)}% from last month
                </p>
              </div>
              <div className="p-3 bg-forest-sage/10 dark:bg-darkMode-progress/10 rounded-lg">
                <Calendar className="w-6 h-6 text-forest-sage dark:text-darkMode-progress" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border-l-4 border-purple-500 dark:border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockSummary.averageDaily}</p>
                <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">points per day</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-text"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-text"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-text"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year' | 'all')}
                className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-text"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary-dark dark:bg-darkMode-accent text-white dark:text-darkMode-bg rounded-lg hover:bg-primary dark:hover:bg-darkMode-accentHover transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-darkMode-border">
            <h2 className="text-xl font-semibold text-primary-dark dark:text-darkMode-text">
              Transaction History ({filteredTransactions.length} transactions)
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-darkMode-border">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'earned' ? 'bg-green-100 dark:bg-darkMode-success/20' :
                      transaction.type === 'spent' ? 'bg-red-100 dark:bg-error/20' :
                      transaction.type === 'bonus' ? 'bg-blue-100 dark:bg-info/20' :
                      'bg-orange-100 dark:bg-warning/20'
                    }`}>
                      {getTransactionIcon(transaction.category)}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-darkMode-text">{transaction.reason}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-darkMode-textSecondary">
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
                            <span className="text-blue-600 dark:text-info font-medium">
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
                    <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <Filter className="w-12 h-12 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-darkMode-text mb-2">No transactions found</h3>
              <p className="text-gray-600 dark:text-darkMode-textSecondary">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

        {/* Success Notification */}
        <div className="fixed bottom-4 right-4 bg-secondary dark:bg-darkMode-success text-white px-6 py-3 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300" id="success-notification">
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
