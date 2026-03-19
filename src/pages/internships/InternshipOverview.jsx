import DashboardLayout from '../../components/Layout/DashboardLayout';
import { internshipsData } from '../../data/internshipsData';
import { Users, Building2, TrendingUp, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const yearlyInternData = [
  { year: '2023', interns: 148, rate: 44.8, avgStipend: 20 },
  { year: '2024', interns: 172, rate: 49.9, avgStipend: 24 },
  { year: '2025', interns: 198, rate: 55.0, avgStipend: 28 },
];

export default function InternshipOverview() {
  const data = internshipsData[2025];

  const kpis = [
    { label: 'Total Interns (2025)', value: data.totalInterns, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Avg Stipend', value: `₹${(data.avgStipend / 1000).toFixed(0)}K/mo`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Companies', value: data.companiesVisited, icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Internship Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Internship statistics and trends across all batches</p>
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
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Interns by Year</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearlyInternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="interns" fill="#6366f1" radius={[4, 4, 0, 0]} name="Interns" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Stipend Distribution (2025)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.stipendDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Top Internship Providers (2025)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Interns</th>
                  <th className="px-5 py-3 text-left">Avg Stipend/mo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topCompanies.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.interns}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{(c.stipend / 1000).toFixed(0)}K</td>
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
