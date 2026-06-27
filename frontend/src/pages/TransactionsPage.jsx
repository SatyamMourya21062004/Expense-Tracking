import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService, categoryService } from '../api/services';
import { Plus, Trash2, Edit2, ArrowLeft, Download, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

export function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
  });

  useEffect(() => {
    loadData();
  }, [filterType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transData, catData] = await Promise.all([
        transactionService.getTransactions({
          type: filterType === 'all' ? null : filterType,
          limit: 50,
        }),
        categoryService.getCategories(),
      ]);
      setTransactions(transData.data || []);
      setCategories(catData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await categoryService.createCategory({
        name: newCategoryName,
        type: formData.type,
      });
      loadData();
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionService.updateTransaction(editingId, formData);
        setEditingId(null);
      } else {
        await transactionService.createTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      loadData();
      setShowForm(false);
      setFormData({
        category: '',
        type: 'expense',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const exportToCSV = () => {
    const filteredTransactions = getFilteredTransactions();
    const headers = ['Date', 'Category', 'Description', 'Type', 'Amount', 'Payment Method'];
    const rows = filteredTransactions.map(tx => [
      format(new Date(tx.date), 'yyyy-MM-dd'),
      getCategoryName(tx.category),
      tx.description || '',
      tx.type,
      tx.amount,
      tx.paymentMethod || 'cash'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredTransactions = () => {
    return transactions.filter(tx => {
      const matchesSearch = searchQuery === '' || 
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(tx.category).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDateRange = 
        (!dateRange.start || new Date(tx.date) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(tx.date) <= new Date(dateRange.end));
      
      return matchesSearch && matchesDateRange;
    });
  };

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c._id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingId ? 'Edit Transaction' : 'Add Daily Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <div className="space-y-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories
                      .filter((c) => c.type === formData.type)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    + Add New Category
                  </button>
                  {showNewCategory && (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Groceries, Lunch, Transport"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      category: '',
                      type: 'expense',
                      amount: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      paymentMethod: 'cash',
                    });
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {type === 'all' ? 'All Transactions' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => { setDateRange({ start: '', end: '' }); setSearchQuery(''); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {!loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {getFilteredTransactions().length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {getFilteredTransactions().map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {format(new Date(tx.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{getCategoryName(tx.category)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{tx.description || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-right space-x-3">
                          <button
                            onClick={() => {
                              setEditingId(tx._id);
                              setFormData({
                                ...tx,
                                amount: tx.amount.toString(),
                              });
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(tx._id)}
                            className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-slate-600 mb-4">
                  {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
                </p>
                {transactions.length === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    Add First Transaction
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Delete Transaction</h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
