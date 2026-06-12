import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { TrendingUp, Users, Building2, Award, Filter, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getPlacementOverview } from '../../services/placementsApi';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316'];

export default function PlacementOverview() {
  const [filters, setFilters] = useState({
    year: 'All', company: 'All', packageRange: 'All', location: 'All',
  });
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        setLoading(true);
        setError('');
        const data = await getPlacementOverview(filters);
        if (isMounted) {
          setOverviewData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load placement overview data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const records = overviewData?.records || [];
  const summary = overviewData?.summary || {};
  const byYear = overviewData?.placements_by_year || [];
  const pkgDist = overviewData?.package_distribution || [];
  const byLocation = overviewData?.placements_by_location || [];
  const filterOptions = overviewData?.filters || {};

  const activeCount = useMemo(
    () => Object.values(filters).filter((v) => v !== 'All').length,
    [filters]
  );
  const resetFilters = () => setFilters({ year: 'All', company: 'All', packageRange: 'All', location: 'All' });

  const kpis = [
    { label: 'Students Placed',  value: summary.students_placed ?? 0,                    icon: Users,      color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Avg Package',      value: `₹${summary.avg_package ?? 0} LPA`,              icon: Award,      color: 'bg-amber-50 text-amber-600' },
    { label: 'Highest Package',  value: `₹${summary.highest_package ?? 0} LPA`,          icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Companies',        value: summary.companies ?? 0,                           icon: Building2,  color: 'bg-purple-50 text-purple-600' },
  ];

  const totalRecords = filterOptions.total_records ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Placement Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Computer Engineering Department – all batches</p>
        </div>

        {loading && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Loading placement overview...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
              { key: 'year',         label: 'Year',     options: ['All', ...(filterOptions.years || [])] },
              { key: 'company',      label: 'Company',  options: ['All', ...(filterOptions.companies || [])] },
              { key: 'packageRange', label: 'Package',  options: ['All', ...(filterOptions.package_ranges || [])] },
              { key: 'location',     label: 'Location', options: ['All', ...(filterOptions.locations || [])] },
            ].map(({ key, label, options }) => (
              <div key={key} className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-400">{label}</label>
                <select
                  value={filters[key]}
                  onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 min-w-27.5"
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
              <span className="font-semibold text-gray-600">{records.length}</span> / {totalRecords} records
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
        {!loading && records.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 text-sm">No students match the selected filters.</p>
            <button onClick={resetFilters} className="mt-3 text-indigo-600 text-sm hover:underline">Reset filters</button>
          </div>
        )}

        {records.length > 0 && (
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
                    <Tooltip formatter={v => [v, 'Students']} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
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

            
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Student Records</h3>
                <span className="text-xs text-gray-400">{records.length} results</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Student</th>
                      <th className="px-5 py-3 text-left">Company</th>
                      
                      <th className="px-5 py-3 text-left">Package</th>
                      <th className="px-5 py-3 text-left">Location</th>
                      <th className="px-5 py-3 text-left">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.map(s => (
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