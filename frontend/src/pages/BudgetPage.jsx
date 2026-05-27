import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService, categoryService, analyticsService } from '../api/services';
import { ArrowLeft, Plus, Trash2, Edit2, Target, AlertTriangle } from 'lucide-react';

export function BudgetPage() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [spending, setSpending] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    alertThreshold: 80,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetData, catData, spendingData] = await Promise.all([
        budgetService.getBudgets(),
        categoryService.getCategories('expense'),
        analyticsService.getCategoryBreakdown('expense'),
      ]);
      setBudgets(budgetData || []);
      setCategories(catData || []);
      
      const spendingMap = {};
      (spendingData || []).forEach(item => {
        spendingMap[item._id] = item.total;
      });
      setSpending(spendingMap);
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await budgetService.updateBudget(editingId, {
          amount: parseFloat(formData.amount),
          alertThreshold: parseInt(formData.alertThreshold),
        });
      } else {
        await budgetService.createBudget({
          category: formData.category,
          amount: parseFloat(formData.amount),
          period: formData.period,
          alertThreshold: parseInt(formData.alertThreshold),
        });
      }
      loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    try {
      await budgetService.deleteBudget(id);
      loadData();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setFormData({
      category: budget.category._id,
      amount: budget.amount.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ category: '', amount: '', period: 'monthly', alertThreshold: 80 });
    setEditingId(null);
    setShowForm(false);
  };

  const getSpentAmount = (categoryId) => spending[categoryId] || 0;
  
  const getProgressColor = (spent, budget, threshold) => {
    const percent = (spent / budget) * 100;
    if (percent >= 100) return 'bg-red-500';
    if (percent >= threshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const availableCategories = categories.filter(
    cat => !budgets.some(b => b.category._id === cat._id) || editingId
  );

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
              <h1 className="text-2xl font-bold text-slate-900">Budget Management</h1>
              <p className="text-sm text-slate-600">Set spending limits for each category</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Budget
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              {editingId ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                  disabled={editingId}
                >
                  <option value="">Select category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Alert at (%)</label>
                <input
                  type="number"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                  min="50"
                  max="100"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
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
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Target size={48} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Budgets Set</h3>
            <p className="text-slate-600 mb-6">Create budgets to track your spending limits by category.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const spent = getSpentAmount(budget.category._id);
              const percent = Math.min((spent / budget.amount) * 100, 100);
              const isOverBudget = spent > budget.amount;
              const isNearLimit = percent >= budget.alertThreshold && !isOverBudget;

              return (
                <div
                  key={budget._id}
                  className={`bg-white rounded-2xl border p-6 ${
                    isOverBudget ? 'border-red-300 bg-red-50' : isNearLimit ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{budget.category.name}</h3>
                      <p className="text-sm text-slate-600 capitalize">{budget.period}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Spent</span>
                      <span className="font-semibold text-slate-900">
                        {spent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(spent, budget.amount, budget.alertThreshold)} transition-all`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-slate-600">Budget</span>
                      <span className="font-semibold text-slate-900">
                        {budget.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Over budget by {(spent - budget.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  {isNearLimit && (
                    <div className="flex items-center gap-2 text-yellow-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Approaching budget limit ({percent.toFixed(0)}%)</span>
                    </div>
                  )}
                  {!isOverBudget && !isNearLimit && (
                    <div className="text-green-600 text-sm">
                      Remaining: {(budget.amount - spent).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
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
