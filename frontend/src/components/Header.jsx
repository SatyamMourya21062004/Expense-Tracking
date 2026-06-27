import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index';
import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-neutral/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">$</span>
          </div>
          <span className="font-bold text-lg text-foreground">ExpenseTracker</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-2 hover:bg-background rounded-lg transition"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-foreground hidden sm:inline">{user?.name}</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-neutral/20 rounded-lg shadow-lg">
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background flex items-center gap-2 transition"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background flex items-center gap-2 transition"
              >
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-neutral/20 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-background flex items-center gap-2 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
