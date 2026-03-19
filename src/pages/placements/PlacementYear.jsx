import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { placementsData } from '../../data/placementsData';
import { studentsData } from '../../data/studentsData';
import { Users, Building2, Award, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

export default function PlacementYear() {
  const { year } = useParams();
  const yr = parseInt(year);
  const data = placementsData[yr];

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-medium">No data for year {year}</p>
          <Link to="/placements/overview" className="mt-3 text-indigo-600 text-sm hover:underline">Back to Overview</Link>
        </div>
      </DashboardLayout>
    );
  }

  const yearStudents = studentsData.filter(s => s.year === yr);

  const kpis = [
    { label: 'Students Placed', value: data.totalPlaced, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Placement Rate', value: `${data.placementRate}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Avg Package', value: `₹${data.avgPackage} LPA`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Companies Visited', value: data.companiesVisited, icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Placements – {year}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Detailed placement data for batch {year}</p>
          </div>
          <div className="flex gap-2">
            {[2025, 2024, 2023].map(y => (
              <Link
                key={y}
                to={`/placements/${y}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${yr === y ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${k.color}`}><k.icon size={20} /></div>
              <div>
                <p className="text-xs text-gray-500">{k.label}</p>
                <p className="text-xl font-bold text-gray-800">{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Placement Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Placed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Package Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.packageDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                  {data.packageDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Top Recruiting Companies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Students Placed</th>
                  <th className="px-5 py-3 text-left">Avg Package (LPA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topCompanies.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.placed}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-indigo-600">₹{c.avg}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Students */}
        {yearStudents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Placed Students – {year}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Company</th>
                    <th className="px-5 py-3 text-left">Package</th>
                    <th className="px-5 py-3 text-left">Location</th>
                    <th className="px-5 py-3 text-left">CGPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {yearStudents.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-5 py-3 text-gray-600">{s.company}</td>
                      <td className="px-5 py-3 font-semibold text-green-600">₹{s.package} LPA</td>
                      <td className="px-5 py-3 text-gray-500">{s.location}</td>
                      <td className="px-5 py-3 text-gray-600">{s.cgpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
