import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Users, Building2, TrendingUp, Award, Filter, X } from 'lucide-react';
import { getInternshipOverview } from '../../services/internshipsApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function InternshipOverview() {
  const [filters, setFilters] = useState({
    year: 'All',
    company: 'All',
    stipendRange: 'All',
    location: 'All',
    mentor: 'All',
    mode: 'All',
  });
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      setLoading(true);
      setError('');

      try {
        const data = await getInternshipOverview(filters);
        if (isMounted) {
          setOverviewData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load internship overview data.');
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

  const summary = overviewData?.summary || {};
  const internVsYear = overviewData?.interns_by_year || [];
  const stipendDistribution = overviewData?.stipend_distribution || [];
  const stipendVsNonStipend = overviewData?.paid_vs_not_paid_by_year || [];
  const topCompanies = overviewData?.top_companies || [];
  const filterOptions = overviewData?.filters || {};

  const activeCount = useMemo(
    () => Object.values(filters).filter((value) => value !== 'All').length,
    [filters]
  );

  const resetFilters = () => setFilters({
    year: 'All',
    company: 'All',
    stipendRange: 'All',
    location: 'All',
    mentor: 'All',
    mode: 'All',
  });

  const placementRate = useMemo(() => {
    const totalInterns = Number(summary.total_interns || 0);
    const withPlacement = Number(summary.internships_with_placement || 0);
    if (!totalInterns) {
      return 0;
    }
    return Number(((withPlacement / totalInterns) * 100).toFixed(1));
  }, [summary.total_interns, summary.internships_with_placement]);

  const kpis = [
    {
      label: 'Total Interns',
      value: Number(summary.total_interns || 0),
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Avg Stipend (Paid)',
      value: summary.avg_stipend ? `₹${(Number(summary.avg_stipend) / 1000).toFixed(0)}K/mo` : '₹0',
      icon: Award,
      color: 'bg-cyan-50 text-cyan-700',
    },
    {
      label: 'Companies',
      value: Number(summary.total_companies || 0),
      icon: Building2,
      color: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Internship with Placement',
      value: `${placementRate}% (${Number(summary.internships_with_placement || 0)})`,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Internship Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Internship statistics and placement-linked insights across batches</p>
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-sm text-gray-500">
            Loading internship overview...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

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
              { key: 'year', label: 'Year', options: ['All', ...(filterOptions.years || [])] },
              { key: 'company', label: 'Company', options: ['All', ...(filterOptions.companies || [])] },
              { key: 'stipendRange', label: 'Stipend', options: ['All', ...(filterOptions.stipend_ranges || [])] },
              { key: 'location', label: 'Location', options: ['All', ...(filterOptions.locations || [])] },
              { key: 'mentor', label: 'Mentor', options: ['All', ...(filterOptions.mentors || [])] },
              { key: 'mode', label: 'Mode', options: ['All', ...(filterOptions.modes || [])] },
            ].map(({ key, label, options }) => (
              <div key={key} className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-400">{label}</label>
                <select
                  value={filters[key]}
                  onChange={e => setFilters(current => ({ ...current, [key]: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 min-w-27.5"
                >
                  {options.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
            ))}

            {activeCount > 0 && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 pb-1.5">
                <X size={14} /> Reset
              </button>
            )}
          </div>

          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
              {Object.entries(filters).map(([key, value]) =>
                value !== 'All' ? (
                  <span key={key} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                    <span className="capitalize">{key === 'stipendRange' ? 'Stipend' : key}:</span> {value}
                    <button
                      onClick={() => setFilters(current => ({ ...current, [key]: 'All' }))}
                      className="ml-0.5 hover:text-indigo-900"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>
        

        {!loading && !error && (
          <>
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
                  <BarChart data={internVsYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="interns" fill="#6366f1" radius={[4, 4, 0, 0]} name="Interns" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Stipend Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stipendDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Paid vs Non-Stipend (Year-wise)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stipendVsNonStipend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="paid" name="Paid" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="not_paid" name="Non-Stipend" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Top Internship Providers</h3>
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
                    {topCompanies.map((c, i) => (
                      <tr key={`${c.name}-${i}`} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                        <td className="px-5 py-3 text-gray-600">{c.interns}</td>
                        <td className="px-5 py-3 font-semibold text-indigo-600">₹{(Number(c.avg_stipend || 0) / 1000).toFixed(0)}K</td>
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