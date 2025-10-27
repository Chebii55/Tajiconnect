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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your course sales and revenue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${earningsData.totalEarnings.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${earningsData.thisMonth.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +{Math.round(((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100)}% from last month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payouts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${earningsData.pendingPayouts.toLocaleString()}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Per Sale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${(earningsData.totalEarnings / 150).toFixed(2)}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sale Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Your Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {earningsData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.course}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            ${transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            ${transaction.commission}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
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
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next Payout</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${earningsData.pendingPayouts}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    March 31, 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Bank Transfer
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payouts are processed monthly on the last day of each month.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
              
              <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Bank Account</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">****1234</p>
                </div>
                <button className="text-primary-light hover:text-primary text-sm font-medium">
                  Edit
                </button>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 text-primary-light border border-primary-light rounded-lg hover:bg-primary-light hover:text-white transition-colors">
                Add Payment Method
              </button>
            </div>

            {/* Tax Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tax Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Not provided
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax Form:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    W-9 Required
                  </span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
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