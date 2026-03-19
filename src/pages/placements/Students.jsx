import { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { studentsData } from '../../data/studentsData';
import { Search } from 'lucide-react';

export default function Students() {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const filtered = studentsData.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === 'All' || s.year === parseInt(yearFilter);
    return matchSearch && matchYear;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">All placed students across batches</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex gap-2">
            {['All', '2025', '2024', '2023'].map(y => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${yearFilter === y ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {y}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} students</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Skills</th>
                  <th className="px-5 py-3 text-left">Package</th>
                  <th className="px-5 py-3 text-left">Location</th>
                  <th className="px-5 py-3 text-left">Batch</th>
                  <th className="px-5 py-3 text-left">CGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{s.company}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.skills.map(sk => (
                          <span key={sk} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{sk}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-600">₹{s.package} LPA</td>
                    <td className="px-5 py-3 text-gray-500">{s.location}</td>
                    <td className="px-5 py-3 text-gray-600">{s.year}</td>
                    <td className="px-5 py-3 text-gray-600">{s.cgpa}</td>
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
