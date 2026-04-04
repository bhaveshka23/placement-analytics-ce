import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Search } from 'lucide-react';
import { getCompanies } from '../../services/placementsApi';

export default function Companies() {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadCompanies() {
      try {
        setLoading(true);
        setError('');
        const response = await getCompanies(search);
        if (mounted) {
          setCompanies(response.companies || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to fetch companies.');
          setCompanies([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCompanies();
    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Companies</h1>
          <p className="text-sm text-gray-500 mt-0.5">All companies that visited for placements</p>
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
          <span className="text-xs text-gray-400 ml-auto">{companies.length} companies</span>
        </div>

        {loading && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Loading companies...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Students Placed</th>
                  <th className="px-5 py-3 text-left">Avg Package</th>
                  <th className="px-5 py-3 text-left">Years Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{c.studentsPlaced}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{c.avgPackage} LPA</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(c.yearsVisited || []).map(y => (
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
