import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'];

export function CategoryBreakdownChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="h-80 flex items-center justify-center"><p className="text-slate-500 text-sm">No expense data available</p></div>;
  }

  const chartData = data.map(item => ({ name: item.categoryName || 'Other', value: parseFloat(item.total || 0) }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={90} fill="#8884d8" dataKey="value">
          {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={value => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={value => { const item = chartData.find(d => d.name === value); return item ? `${value}: ₹${item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : value; }} />
      </PieChart>
    </ResponsiveContainer>
  );
}