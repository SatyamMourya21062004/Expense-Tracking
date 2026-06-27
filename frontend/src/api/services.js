import api from './axios';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  updateProfile: async (name, currency) => {
    const response = await api.put('/auth/update-profile', {
      name,
      currency,
    });
    return response.data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const transactionService = {
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/transactions?${params}`);
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export const categoryService = {
  getCategories: async (type = null) => {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`/categories${params}`);
    return response.data.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const budgetService = {
  getBudgets: async () => {
    const response = await api.get('/budgets');
    return response.data.data;
  },

  createBudget: async (data) => {
    const response = await api.post('/budgets', data);
    return response.data.data;
  },

  updateBudget: async (id, data) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data.data;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export const goalService = {
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data.data;
  },

  createGoal: async (data) => {
    const response = await api.post('/goals', data);
    return response.data.data;
  },

  updateGoal: async (id, data) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data.data;
  },

  contributeToGoal: async (id, amount) => {
    const response = await api.put(`/goals/${id}/contribute`, { amount });
    return response.data.data;
  },

  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

export const analyticsService = {
  getSummary: async (period = 'monthly') => {
    const response = await api.get(`/analytics/summary?period=${period}`);
    return response.data.data;
  },

  getCategoryBreakdown: async (type = null, month = null, year = null) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await api.get(`/analytics/category-breakdown?${params}`);
    return response.data.data;
  },

  getTrends: async (months = 12) => {
    const response = await api.get(`/analytics/trends?months=${months}`);
    return response.data.data;
  },

  getBudgetVsActual: async (month = null, year = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await api.get(`/analytics/budget-vs-actual?${params}`);
    return response.data.data;
  },
};
