import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Users, Building2, Award, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts';
import { getInternshipYearDetail, getInternshipYears } from '../../services/internshipsApi';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#06b6d4'];

export default function InternshipYear() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;

    async function loadYears() {
      try {
        const response = await getInternshipYears();
        if (mounted) {
          setYears(response.years || []);
        }
      } catch {
        if (mounted) {
          setYears([]);
        }
      }
    }

    loadYears();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadYearData() {
      try {
        setLoading(true);
        setError('');
        const response = await getInternshipYearDetail(year);
        if (mounted) {
          setData(response);
          if ((response.years || []).length > 0) {
            setYears(response.years);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to fetch internship year data.');
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (year) {
      loadYearData();
    }

    return () => {
      mounted = false;
    };
  }, [year]);

  useEffect(() => {
    if (years.length > 0 && year && !years.map(String).includes(String(year))) {
      navigate(`/internships/${years[0]}`, { replace: true });
    }
  }, [years, year, navigate]);

  const summary = data?.summary || {};
  const placementData = data?.placement_status || [];
  const stipendDistributionData = data?.stipend_distribution || [];
  const paidVsNonPaidData = data?.paid_vs_non_paid || [];
  const records = data?.records || [];

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedRecords = records.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [year, records.length]);

  useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage);
    }
  }, [page, clampedPage]);

  const kpis = useMemo(() => [
    { label: 'Total Interns', value: summary.total_interns ?? 0, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Highest Stipend', value: `₹${Math.round((summary.highest_stipend || 0) / 1000)}K/mo`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Conversion Rate', value: `${summary.conversion_rate ?? 0}%`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Companies', value: summary.companies ?? 0, icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ], [summary.companies, summary.conversion_rate, summary.highest_stipend, summary.total_interns]);

  if (!loading && !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-medium">No data for year {year}</p>
          <Link to="/internships/overview" className="mt-3 text-indigo-600 text-sm hover:underline">Back to Overview</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Internships – {year}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Internship data for batch {year}</p>
          </div>
          <div className="flex gap-2">
            {years.map(y => (
              <Link
                key={y}
                to={`/internships/${y}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${String(year) === String(y) ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Loading internship year data...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Internship with Placement</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Stipend Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stipendDistributionData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={78}
                  innerRadius={36}
                  paddingAngle={2}
                >
                  {stipendDistributionData.map((entry, i) => (
                    <Cell key={`${entry.range}-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Paid vs Non-Paid</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paidVsNonPaidData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
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
                  <th className="px-5 py-3 text-left">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedRecords.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-5 py-3 text-gray-600">{s.company}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{Math.round((Number(s.stipend) || 0) / 1000)}K</td>
                    
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
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing {records.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, records.length)} of {records.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={clampedPage === 1}
                className={`px-2.5 py-1 rounded-md border text-xs ${clampedPage === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                Prev
              </button>
              <span className="text-gray-600">Page {clampedPage} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={clampedPage === totalPages}
                className={`px-2.5 py-1 rounded-md border text-xs ${clampedPage === totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}