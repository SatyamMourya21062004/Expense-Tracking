import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalService } from '../api/services';
import { ArrowLeft, Plus, Trash2, Edit2, Target, TrendingUp, Calendar, PiggyBank } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const GOAL_CATEGORIES = [
  { value: 'emergency', label: 'Emergency Fund', color: '#ef4444' },
  { value: 'vacation', label: 'Vacation', color: '#f59e0b' },
  { value: 'education', label: 'Education', color: '#3b82f6' },
  { value: 'investment', label: 'Investment', color: '#10b981' },
  { value: 'purchase', label: 'Major Purchase', color: '#8b5cf6' },
  { value: 'retirement', label: 'Retirement', color: '#ec4899' },
  { value: 'other', label: 'Other', color: '#64748b' },
];

export function GoalsPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showContribute, setShowContribute] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'other',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await goalService.getGoals();
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
      };

      if (editingId) {
        await goalService.updateGoal(editingId, goalData);
      } else {
        await goalService.createGoal(goalData);
      }
      loadGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert(error.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleContribute = async (goalId) => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) return;
    try {
      await goalService.contributeToGoal(goalId, parseFloat(contributeAmount));
      loadGoals();
      setShowContribute(null);
      setContributeAmount('');
    } catch (error) {
      console.error('Error contributing:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal._id);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.split('T')[0],
      category: goal.category,
      priority: goal.priority,
      notes: goal.notes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'other',
      priority: 'medium',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getProgressPercent = (current, target) => Math.min((current / target) * 100, 100);
  
  const getDaysRemaining = (deadline) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : 0;
  };

  const getCategoryInfo = (cat) => GOAL_CATEGORIES.find(c => c.value === cat) || GOAL_CATEGORIES[6];

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financial Goals</h1>
              <p className="text-sm text-slate-600">Track your savings goals</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <PiggyBank size={20} className="text-green-600" />
              <span className="text-sm text-slate-600">Total Saved</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalSaved.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-blue-600" />
              <span className="text-sm text-slate-600">Total Target</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalTarget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span className="text-sm text-slate-600">Active Goals</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{activeGoals}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-orange-600" />
              <span className="text-sm text-slate-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              {editingId ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Emergency Fund"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {GOAL_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Amount</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="100000"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Amount</label>
                  <input
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any notes..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {editingId ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Target size={48} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Goals Yet</h3>
            <p className="text-slate-600 mb-6">Start setting financial goals to track your progress.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const percent = getProgressPercent(goal.currentAmount, goal.targetAmount);
              const daysLeft = getDaysRemaining(goal.deadline);
              const catInfo = getCategoryInfo(goal.category);
              const isCompleted = goal.status === 'completed';

              return (
                <div
                  key={goal._id}
                  className={`bg-white rounded-2xl border p-6 ${isCompleted ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${catInfo.color}20` }}
                      >
                        <Target size={20} style={{ color: catInfo.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{goal.name}</h3>
                        <p className="text-sm text-slate-600">{catInfo.label}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!isCompleted && (
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-slate-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-900">{percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="font-semibold text-slate-900">
                        {goal.currentAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-slate-600">
                        of {goal.targetAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-600">
                      {isCompleted ? 'Completed' : `${daysLeft} days remaining`}
                    </span>
                    <span className="text-slate-600">Due: {format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
                  </div>

                  {!isCompleted && (
                    <>
                      {showContribute === goal._id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            placeholder="Amount"
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleContribute(goal._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => { setShowContribute(null); setContributeAmount(''); }}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowContribute(goal._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                        >
                          Add Contribution
                        </button>
                      )}
                    </>
                  )}

                  {isCompleted && (
                    <div className="text-center text-green-600 font-semibold py-2">
                      Goal Achieved!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
