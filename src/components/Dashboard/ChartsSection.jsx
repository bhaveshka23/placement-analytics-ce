import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { yearlyComparison } from '../../data/placementsData';
import { placementsData } from '../../data/placementsData';

export default function ChartsSection() {
  const monthly = placementsData[2025].monthlyTrend;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Monthly trend */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Placement Trend (2025)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="placed" stroke="#6366f1" fill="url(#colorPlaced)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Year-wise comparison */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Year-wise Placement Comparison</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={yearlyComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students Placed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
