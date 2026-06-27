import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, TrendingUp, PieChart, Lock } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">₹</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Expense Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-slate-700 font-semibold hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Take Control of Your Finances
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Track every rupee you spend and earn. Get insights into your spending patterns, set budgets, and achieve your financial goals with our powerful expense tracking app.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Analytics</h3>
                <p className="text-sm text-slate-600">Visual insights into your spending habits</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Budget Goals</h3>
                <p className="text-sm text-slate-600">Set and track your spending limits</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Category Breakdown</h3>
                <p className="text-sm text-slate-600">Understand where your money goes</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock size={24} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Secure & Private</h3>
                <p className="text-sm text-slate-600">Your data is encrypted and protected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white border-t border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-slate-600">Everything you need to manage your money effectively</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Entry</h3>
                <p className="text-slate-600 mb-4">
                  Add expenses and income with just a few clicks. Categorize transactions instantly with our intuitive interface.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Rich Analytics</h3>
                <p className="text-slate-600 mb-4">
                  Get detailed insights with pie charts, bar graphs, and monthly trends. Understand your spending patterns at a glance.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Budget Planning</h3>
                <p className="text-slate-600 mb-4">
                  Set category budgets and get alerts when you're approaching limits. Take control of your finances proactively.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Monthly Reports</h3>
                <p className="text-slate-600 mb-4">
                  View comprehensive monthly and yearly summaries. Track your financial progress over time with detailed reports.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Category Management</h3>
                <p className="text-slate-600 mb-4">
                  Organize expenses into multiple categories. Create custom categories that match your spending habits.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Account</h3>
                <p className="text-slate-600 mb-4">
                  Your data is protected with industry-standard encryption. Your privacy is our top priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Start Managing Your Money Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who are taking control of their finances
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-slate-50 text-blue-600 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Sign Up Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400">© 2024 Expense Tracker. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
