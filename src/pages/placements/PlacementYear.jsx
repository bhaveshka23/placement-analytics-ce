import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Users, Building2, Award, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getPlacementYears, getPlacementYearDetail } from '../../services/placementsApi';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

export default function PlacementYear() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadYears() {
      try {
        const yearsResponse = await getPlacementYears();
        if (mounted) {
          setYears(yearsResponse.years || []);
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
        const response = await getPlacementYearDetail(year);
        if (mounted) {
          setData(response);
          if ((response.years || []).length > 0) {
            setYears(response.years);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to fetch placement year data.');
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
      navigate(`/placements/${years[0]}`, { replace: true });
    }
  }, [years, year, navigate]);

  const packageDistribution = data?.package_distribution || [];
  const topCompanies = data?.top_companies || [];
  const records = data?.records || [];

  const kpis = [
    { label: 'Students Placed', value: data?.summary?.students_placed ?? 0, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Avg Package', value: `₹${data?.summary?.avg_package ?? 0} LPA`, icon: Award, color: 'bg-amber-50 text-amber-600' },
    { label: 'Highest Package', value: `₹${data?.summary?.highest_package ?? 0} LPA`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Companies Visited', value: data?.summary?.companies ?? 0, icon: Building2, color: 'bg-purple-50 text-purple-600' },
  ];

  if (!loading && !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-medium">No data for year {year}</p>
          <Link to="/placements/overview" className="mt-3 text-indigo-600 text-sm hover:underline">Back to Overview</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Placements – {year}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Detailed placement data for batch {year}</p>
          </div>
          <div className="flex gap-2">
            {years.map(y => (
              <Link
                key={y}
                to={`/placements/${y}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${String(year) === String(y) ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Loading placement year data...
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

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Package Distribution</h3>
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie data={packageDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={130} innerRadius={70} paddingAngle={3}>
                {packageDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
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
                {topCompanies.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.name || c.company__name}</td>
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
        {records.length > 0 && (
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
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {records.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-5 py-3 text-gray-600">{s.company}</td>
                      <td className="px-5 py-3 font-semibold text-green-600">₹{s.package} LPA</td>
                      <td className="px-5 py-3 text-gray-500">{s.location}</td>
                     
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
