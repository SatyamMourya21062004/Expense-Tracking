import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryBreakdownChart } from '../components/CategoryBreakdownChart';
import { TrendsChart } from '../components/TrendsChart';
import { BudgetVsActualChart } from '../components/BudgetVsActualChart';
import { analyticsService, transactionService, goalService } from '../api/services';
import { useAuthStore } from '../store/index';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Plus, Settings, User, RefreshCw, Target, PiggyBank, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  // Auto-refresh when user focuses on the page
  useEffect(() => {
    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const [summaryData, catData, trendsData, actualBudgetData, transData, goalsData] = await Promise.all([
        analyticsService.getSummary(period),
        analyticsService.getCategoryBreakdown('expense'),
        analyticsService.getTrends(12),
        analyticsService.getBudgetVsActual(),
        transactionService.getTransactions({ limit: 5 }),
        goalService.getGoals().catch(() => []),
      ]);

      setSummary(summaryData);
      setCategoryData(catData);
      setTrends(trendsData);
      setBudgetData(actualBudgetData);
      setRecentTransactions(transData?.data || []);
      setGoals(goalsData || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data. Please try refreshing.');
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => window.location.href = '/login', 2000);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expense Tracker</h1>
            <p className="text-sm text-slate-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={isRefreshing}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={20} className={`text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/budgets')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Target size={18} />
              Budgets
            </button>
            <button
              onClick={() => navigate('/goals')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <PiggyBank size={18} />
              Goals
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Expense
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Profile"
            >
              <User size={20} className="text-slate-600" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-900 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {!loading && !summary && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-yellow-900 font-semibold mb-2">Backend Server Not Running</h3>
            <p className="text-yellow-800 text-sm">
              The backend server is not running. Please start it by running <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev</code> in the backend folder.
            </p>
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Total Income</h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">₹{summary.income.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              <p className="text-xs text-slate-500 mt-2">{summary.incomeCount} transactions</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Total Expense</h3>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft size={20} className="text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">₹{summary.expense.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              <p className="text-xs text-slate-500 mt-2">{summary.expenseCount} transactions</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Balance</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet size={20} className="text-blue-600" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{summary.balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
              <p className="text-xs text-slate-500 mt-2">Income - Expense</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Saving Rate</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {summary.income > 0 ? ((summary.balance / summary.income) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-slate-500 mt-2">Of your income saved</p>
            </div>
          </div>
        )}

        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              period === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              period === 'yearly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            This Year
          </button>
        </div>

        {!loading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Expenses by Category</h2>
                <CategoryBreakdownChart data={categoryData} />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Monthly Trends</h2>
                <TrendsChart data={trends} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Budget vs Actual</h2>
              <BudgetVsActualChart data={budgetData} />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
                <button
                  onClick={() => navigate('/transactions')}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              {recentTransactions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No transactions yet. Add your first expense!</p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight size={20} className="text-green-600" />
                          ) : (
                            <ArrowDownLeft size={20} className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {transaction.category?.name || 'Uncategorized'}
                          </p>
                          <p className="text-sm text-slate-600">
                            {transaction.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Goals Preview */}
            {goals.filter(g => g.status === 'active').length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Active Goals</h2>
                  <button
                    onClick={() => navigate('/goals')}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => {
                    const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                      <div key={goal._id} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <Target size={20} className="text-blue-600" />
                          <span className="font-semibold text-slate-900">{goal.name}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{percent.toFixed(0)}%</span>
                          <span className="text-slate-900 font-semibold">
                            {goal.currentAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} / {goal.targetAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
      </main>
    </div>
  );
}
