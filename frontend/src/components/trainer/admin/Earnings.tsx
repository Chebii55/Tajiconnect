import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Banknote,
  PieChart,
  Filter
} from 'lucide-react';

const Earnings: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock earnings data
  const earningsData = {
    totalEarnings: 12450.00,
    thisMonth: 2340.00,
    lastMonth: 1890.00,
    pendingPayouts: 450.00,
    transactions: [
      {
        id: '1',
        type: 'course_sale',
        course: 'React Fundamentals',
        amount: 89.99,
        commission: 62.99,
        date: '2024-03-15',
        status: 'completed'
      },
      {
        id: '2',
        type: 'course_sale',
        course: 'Advanced JavaScript',
        amount: 129.99,
        commission: 90.99,
        date: '2024-03-14',
        status: 'completed'
      },
      {
        id: '3',
        type: 'course_sale',
        course: 'React Fundamentals',
        amount: 89.99,
        commission: 62.99,
        date: '2024-03-13',
        status: 'pending'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/dashboard')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Earnings</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Track your course sales and revenue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-neutral-dark dark:text-darkMode-text border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  ${earningsData.totalEarnings.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">This Month</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  ${earningsData.thisMonth.toLocaleString()}
                </p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1">
                  +{Math.round(((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100)}% from last month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary dark:text-primary-light" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Pending Payouts</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  ${earningsData.pendingPayouts.toLocaleString()}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Per Sale</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  ${(earningsData.totalEarnings / 150).toFixed(2)}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-accent-teal dark:text-accent-teal" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Recent Transactions</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="border border-neutral-gray dark:border-darkMode-border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-light dark:bg-darkMode-navbar">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                        Sale Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                        Your Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-gray dark:divide-darkMode-border">
                    {earningsData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-light dark:hover:bg-darkMode-navbar">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                            {transaction.course}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark dark:text-darkMode-text">
                            ${transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-success dark:text-darkMode-success">
                            ${transaction.commission}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-dark dark:text-darkMode-text">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success'
                              : 'bg-accent-gold/10 text-accent-gold dark:bg-darkMode-accent/20 dark:text-darkMode-accent'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payout Information */}
          <div className="space-y-6">
            {/* Next Payout */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Next Payout</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Amount:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">
                    ${earningsData.pendingPayouts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Date:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">
                    March 31, 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Method:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">
                    Bank Transfer
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-gray dark:border-darkMode-border">
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                  Payouts are processed monthly on the last day of each month.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Payment Method</h3>

              <div className="flex items-center gap-3 p-3 border border-neutral-gray dark:border-darkMode-border rounded-lg">
                <CreditCard className="w-5 h-5 text-forest-sage dark:text-darkMode-textMuted" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Bank Account</p>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">****1234</p>
                </div>
                <button className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary text-sm font-medium">
                  Edit
                </button>
              </div>

              <button className="w-full mt-4 px-4 py-2 text-primary dark:text-primary-light border border-primary dark:border-primary-light rounded-lg hover:bg-primary hover:text-white dark:hover:bg-darkMode-progress dark:hover:text-white transition-colors">
                Add Payment Method
              </button>
            </div>

            {/* Tax Information */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Tax Information</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Tax ID:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">
                    Not provided
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Tax Form:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">
                    W-9 Required
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary dark:bg-darkMode-progress text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors">
                Complete Tax Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
