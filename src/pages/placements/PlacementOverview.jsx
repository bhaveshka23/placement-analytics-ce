import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { studentsData } from '../../data/studentsData';
import { TrendingUp, Users, Building2, Award, Filter, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316'];

const ALL_COMPANIES = [...new Set(studentsData.map(s => s.company))].sort();
const ALL_SKILLS    = [...new Set(studentsData.flatMap(s => s.skills))].sort();
const ALL_LOCATIONS = [...new Set(studentsData.map(s => s.location))].sort();

const PACKAGE_RANGES = [
  { label: 'All',        min: 0,  max: Infinity },
  { label: '< 5 LPA',   min: 0,  max: 5 },
  { label: '5–10 LPA',  min: 5,  max: 10 },
  { label: '10–20 LPA', min: 10, max: 20 },
  { label: '20+ LPA',   min: 20, max: Infinity },
];

function getPackageBucket(pkg) {
  if (pkg < 5)  return '< 5 LPA';
  if (pkg < 8)  return '5–8 LPA';
  if (pkg < 12) return '8–12 LPA';
  if (pkg < 20) return '12–20 LPA';
  return '20+ LPA';
}

export default function PlacementOverview() {
  const [filters, setFilters] = useState({
    year: 'All', company: 'All', packageRange: 'All', skill: 'All', location: 'All',
  });

  const filtered = useMemo(() => {
    const pkgRange = PACKAGE_RANGES.find(r => r.label === filters.packageRange) || PACKAGE_RANGES[0];
    return studentsData.filter(s => {
      if (filters.year !== 'All' && s.year !== parseInt(filters.year)) return false;
      if (filters.company !== 'All' && s.company !== filters.company) return false;
      if (filters.skill !== 'All' && !s.skills.includes(filters.skill)) return false;
      if (filters.location !== 'All' && s.location !== filters.location) return false;
      if (s.package < pkgRange.min || s.package >= pkgRange.max) return false;
      return true;
    });
  }, [filters]);

  const totalPlaced     = filtered.length;
  const avgPackage      = totalPlaced ? (filtered.reduce((s, r) => s + r.package, 0) / totalPlaced).toFixed(1) : 0;
  const highestPkg      = totalPlaced ? Math.max(...filtered.map(s => s.package)) : 0;
  const uniqueCompanies = [...new Set(filtered.map(s => s.company))].length;

  const byYear = useMemo(() => {
    const map = {};
    filtered.forEach(s => { map[s.year] = (map[s.year] || 0) + 1; });
    return [2023, 2024, 2025].map(y => ({ year: String(y), placed: map[y] || 0 }));
  }, [filtered]);

  const pkgDist = useMemo(() => {
    const buckets = {};
    filtered.forEach(s => { const b = getPackageBucket(s.package); buckets[b] = (buckets[b] || 0) + 1; });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [filtered]);

  const byCompany = useMemo(() => {
    const map = {};
    filtered.forEach(s => { map[s.company] = (map[s.company] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [filtered]);

  const avgByCompany = useMemo(() => {
    const map = {};
    filtered.forEach(s => {
      if (!map[s.company]) map[s.company] = { total: 0, count: 0 };
      map[s.company].total += s.package;
      map[s.company].count += 1;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, avg: parseFloat((v.total / v.count).toFixed(1)) }))
      .sort((a, b) => b.avg - a.avg).slice(0, 8);
  }, [filtered]);

  const byLocation = useMemo(() => {
    const map = {};
    filtered.forEach(s => { map[s.location] = (map[s.location] || 0) + 1; });
    return Object.entries(map).map(([location, count]) => ({ location, count })).sort((a, b) => b.count - a.count);
  }, [filtered]);

  const bySkill = useMemo(() => {
    const map = {};
    filtered.forEach(s => s.skills.forEach(sk => { map[sk] = (map[sk] || 0) + 1; }));
    return Object.entries(map).map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [filtered]);

  const activeCount = Object.values(filters).filter(v => v !== 'All').length;
  const resetFilters = () => setFilters({ year: 'All', company: 'All', packageRange: 'All', skill: 'All', location: 'All' });

  const kpis = [
    { label: 'Students Placed',  value: totalPlaced,          icon: Users,     color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Avg Package',      value: `₹${avgPackage} LPA`, icon: Award,     color: 'bg-amber-50 text-amber-600' },
    { label: 'Highest Package',  value: `₹${highestPkg} LPA`, icon: TrendingUp,color: 'bg-green-50 text-green-600' },
    { label: 'Companies',        value: uniqueCompanies,       icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Placement Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Computer Engineering Department – all batches</p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2 text-gray-500 pb-1.5">
              <Filter size={15} />
              <span className="text-sm font-medium">Filters</span>
              {activeCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeCount}</span>
              )}
            </div>

            {[
              { key: 'year',         label: 'Year',     options: ['All', '2025', '2024', '2023'] },
              { key: 'company',      label: 'Company',  options: ['All', ...ALL_COMPANIES] },
              { key: 'packageRange', label: 'Package',  options: PACKAGE_RANGES.map(r => r.label) },
              { key: 'skill',        label: 'Skill',    options: ['All', ...ALL_SKILLS] },
              { key: 'location',     label: 'Location', options: ['All', ...ALL_LOCATIONS] },
            ].map(({ key, label, options }) => (
              <div key={key} className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-400">{label}</label>
                <select
                  value={filters[key]}
                  onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 min-w-[110px]"
                >
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            {activeCount > 0 && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 pb-1.5">
                <X size={14} /> Reset
              </button>
            )}

            <div className="ml-auto pb-1.5 text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{filtered.length}</span> / {studentsData.length} students
            </div>
          </div>

          {/* Active chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
              {Object.entries(filters).map(([key, val]) =>
                val !== 'All' ? (
                  <span key={key} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                    <span className="capitalize">{key === 'packageRange' ? 'Package' : key}:</span> {val}
                    <button onClick={() => setFilters(f => ({ ...f, [key]: 'All' }))} className="ml-0.5 hover:text-indigo-900">
                      <X size={11} />
                    </button>
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* ── KPI Cards ── */}
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

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 text-sm">No students match the selected filters.</p>
            <button onClick={resetFilters} className="mt-3 text-indigo-600 text-sm hover:underline">Reset filters</button>
          </div>
        )}

        {filtered.length > 0 && (
          <>
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Placements by Year</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip formatter={v => [v, 'Students']} />
                    <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Placed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Package Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pkgDist} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} innerRadius={42} paddingAngle={3}>
                      {pkgDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Students per Company</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={byCompany} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={105} />
                    <Tooltip formatter={v => [v, 'Students']} />
                    <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Avg Package per Company (LPA)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={avgByCompany} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit=" L" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={105} />
                    <Tooltip formatter={v => [`₹${v} LPA`, 'Avg Package']} />
                    <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg LPA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Placements by Location</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byLocation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip formatter={v => [v, 'Students']} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Skills (Filtered Students)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={bySkill} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip formatter={v => [v, 'Students']} />
                    <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Student Records</h3>
                <span className="text-xs text-gray-400">{filtered.length} results</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Student</th>
                      <th className="px-5 py-3 text-left">Company</th>
                      <th className="px-5 py-3 text-left">Skills</th>
                      <th className="px-5 py-3 text-left">Package</th>
                      <th className="px-5 py-3 text-left">Location</th>
                      <th className="px-5 py-3 text-left">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shrink-0">
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
                        <td className="px-5 py-3 text-gray-500">{s.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
