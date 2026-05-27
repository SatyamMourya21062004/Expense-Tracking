import { AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

export function BudgetVsActualChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500 text-sm">No budget data available</p>
      </div>
    );
  }

  return (
     <div className="space-y-4">
      {data.map((item) => {
        const percentUsed = item.budgeted > 0 ? (item.actual / item.budgeted) * 100 : 0;
        const isExceeded = percentUsed > 100;
        const shouldAlert = percentUsed > 80;

        return (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {isExceeded ? (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                ) : shouldAlert ? (
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} className="text-yellow-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{item.categoryName}</p>
                  <p className="text-xs text-slate-500">
                    ₹{item.actual.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹{item.budgeted.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${isExceeded ? 'text-red-600' : 'text-slate-900'}`}>
                  {percentUsed.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">
                  {isExceeded
                    ? `+₹${(item.actual - item.budgeted).toLocaleString('en-IN', { maximumFractionDigits: 0 })} over`
                    : `₹${(item.budgeted - item.actual).toLocaleString('en-IN', { maximumFractionDigits: 0 })} left`}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isExceeded
                    ? 'bg-red-600'
                    : shouldAlert
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
              {percentUsed > 100 && (
                <div
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-red-600"
                  style={{ opacity: 0.3 }}
                />
              )}
            </div>

            {/* Status Message */}
            {isExceeded && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <TrendingDown size={12} />
                Budget exceeded! Consider reducing expenses in this category.
              </p>
            )}
            {shouldAlert && !isExceeded && (
              <p className="text-xs text-yellow-600 mt-2">
                ⚠️ Warning: You&apos;ve used {percentUsed.toFixed(0)}% of your budget
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
  
