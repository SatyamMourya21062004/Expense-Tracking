import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetPage } from './pages/BudgetPage';
import { GoalsPage } from './pages/GoalsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuthStore } from './store/index';
import { useEffect, useState } from 'react';
import './globals.css';

function App() {
  const [isReady, setIsReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const stored = localStorage.getItem('expense_tracker_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const { user, accessToken: token, refreshToken } = parsed;
        // Validate stored auth data
        if (user && user.email && token) {
          setAuth(user, token, refreshToken);
        } else {
          // Invalid stored data, clear it
          localStorage.removeItem('expense_tracker_auth');
          logout();
        }
      } catch (error) {
        console.error('Failed to restore auth:', error);
        localStorage.removeItem('expense_tracker_auth');
        logout();
      }
    }
    setIsReady(true);
  }, [setAuth, logout]);

  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.user && state.accessToken) {
      localStorage.setItem(
        'expense_tracker_auth',
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        })
      );
    } else {
      localStorage.removeItem('expense_tracker_auth');
    }
  }, [accessToken]);

  if (!isReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {accessToken ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
