import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TrendsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
        <div className="h-80 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
     month: item.month || 'Unknown',
    income: parseFloat(item.income || 0),
    expense: parseFloat(item.expense || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          labelStyle={{ color: '#1f2937' }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
        />
        <Bar dataKey="income" fill="#10b981" name="income" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" name="expense" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
