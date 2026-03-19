import DashboardLayout from '../../components/Layout/DashboardLayout';
import { activitiesData, activityCategories } from '../../data/activitiesData';
import { Calendar, Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const categoryColors = {
  Hackathon: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Workshop: 'bg-green-50 text-green-600 border-green-100',
  'Guest Lecture': 'bg-amber-50 text-amber-600 border-amber-100',
  'Coding Contest': 'bg-pink-50 text-pink-600 border-pink-100',
  'Interview Prep': 'bg-teal-50 text-teal-600 border-teal-100',
};

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

export default function ActivitiesOverview() {
  const allActivities = [
    ...activitiesData[2025],
    ...activitiesData[2024],
    ...activitiesData[2023],
  ];

  const totalParticipants = allActivities.reduce((sum, a) => sum + a.participants, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Activities Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">All department activities, events, and workshops</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Activities', value: allActivities.length },
            { label: 'Total Participants', value: totalParticipants },
            { label: 'Categories', value: activityCategories.length },
            { label: 'Years Covered', value: 3 },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category breakdown */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Activities by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={activityCategories} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                  {activityCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category cards */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {activityCategories.map(cat => (
                <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full border ${categoryColors[cat.category] || 'bg-gray-100 text-gray-600'}`}>
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(cat.count / 14) * 100}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-6 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Year links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[2025, 2024, 2023].map(y => (
            <Link
              key={y}
              to={`/activities/${y}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-800">{y}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{activitiesData[y].length} activities</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Calendar size={18} className="text-indigo-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activities */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">All Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allActivities.map(a => (
              <div key={a.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <img src={a.image} alt={a.title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[a.category] || 'bg-gray-100 text-gray-600'}`}>
                      {a.category}
                    </span>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">{a.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{a.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Users size={12} />
                    <span>{a.participants} participants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
