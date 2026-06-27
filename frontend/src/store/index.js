import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) =>
    set({ user, accessToken, refreshToken }),

  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),

  logout: () =>
    set({ user: null, accessToken: null, refreshToken: null }),

  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return !!state.accessToken;
  },
}));

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  categories: [],
  budgets: [],
  summary: null,
  loading: false,
  error: null,

  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  setBudgets: (budgets) => set({ budgets }),
  setSummary: (summary) => set({ summary }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useAnalyticsStore = create((set) => ({
  categoryBreakdown: [],
  trends: [],
  budgetVsActual: [],
  loading: false,

  setCategoryBreakdown: (data) => set({ categoryBreakdown: data }),
  setTrends: (data) => set({ trends: data }),
  setBudgetVsActual: (data) => set({ budgetVsActual: data }),
  setLoading: (loading) => set({ loading }),
}));
