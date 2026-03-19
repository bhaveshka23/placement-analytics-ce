import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { internshipsData } from '../../data/internshipsData';
import { Users, Building2, Award, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

export default function InternshipYear() {
  const { year } = useParams();
  const yr = parseInt(year);
  const data = internshipsData[yr];

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-medium">No data for year {year}</p>
          <Link to="/internships/overview" className="mt-3 text-indigo-600 text-sm hover:underline">Back to Overview</Link>
        </div>
      </DashboardLayout>
    );
  }

  const kpis = [
    { label: 'Total Interns', value: data.totalInterns, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Avg Stipend', value: `₹${(data.avgStipend / 1000).toFixed(0)}K/mo`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Companies', value: data.companiesVisited, icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Internships – {year}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Internship data for batch {year}</p>
          </div>
          <div className="flex gap-2">
            {[2025, 2024, 2023].map(y => (
              <Link
                key={y}
                to={`/internships/${y}`}
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
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Intern Intake</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="interns" fill="#6366f1" radius={[4, 4, 0, 0]} name="Interns" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Stipend Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.stipendDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                  {data.stipendDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Intern Students – {year}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Stipend/mo</th>
                  <th className="px-5 py-3 text-left">Duration</th>
                  <th className="px-5 py-3 text-left">Skills</th>
                  <th className="px-5 py-3 text-left">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-5 py-3 text-gray-600">{s.company}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{(s.stipend / 1000).toFixed(0)}K</td>
                    <td className="px-5 py-3 text-gray-500">{s.duration}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.skills.map(sk => (
                          <span key={sk} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{sk}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.converted ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {s.converted ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
