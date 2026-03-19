import { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { companiesData } from '../../data/companiesData';
import { Search } from 'lucide-react';

const typeColors = {
  Product: 'bg-indigo-50 text-indigo-600',
  Service: 'bg-green-50 text-green-600',
  Startup: 'bg-amber-50 text-amber-600',
};

export default function Companies() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = companiesData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === 'All' || c.type === filter;
    return matchSearch && matchType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Companies</h1>
          <p className="text-sm text-gray-500 mt-0.5">All companies that visited for placements</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Companies', value: companiesData.length },
            { label: 'Product Companies', value: companiesData.filter(c => c.type === 'Product').length },
            { label: 'Service Companies', value: companiesData.filter(c => c.type === 'Service').length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Product', 'Service', 'Startup'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Sector</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Students Placed</th>
                  <th className="px-5 py-3 text-left">Avg Package</th>
                  <th className="px-5 py-3 text-left">Highest Package</th>
                  <th className="px-5 py-3 text-left">Years Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.logo}</span>
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{c.sector}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[c.type] || 'bg-gray-100 text-gray-600'}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{c.studentsPlaced}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{c.avgPackage} LPA</td>
                    <td className="px-5 py-3 font-semibold text-green-600">₹{c.highestPackage} LPA</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {c.yearsVisited.map(y => (
                          <span key={y} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{y}</span>
                        ))}
                      </div>
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
