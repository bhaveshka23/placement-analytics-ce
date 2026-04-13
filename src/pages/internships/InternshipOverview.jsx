import { useMemo, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { internshipsData } from '../../data/internshipsData';
import { Users, Building2, TrendingUp, Award } from 'lucide-react';
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

const DEFAULT_LOCATIONS = ['Pune', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi', 'Remote'];
const DEFAULT_MENTORS = ['Dr. Patil', 'Prof. Kulkarni', 'Prof. Joshi', 'Dr. Shah', 'Prof. Iyer'];
const DEFAULT_MODES = ['offline', 'hybrid', 'online'];

function getStipendRange(stipend) {
  if (!stipend || stipend <= 0) return 'No Stipend';
  if (stipend < 10000) return '< 10K';
  if (stipend < 20000) return '10-20K';
  if (stipend < 40000) return '20-40K';
  if (stipend < 80000) return '40-80K';
  return '80K+';
}

function makeInternshipRecords() {
  return Object.entries(internshipsData).flatMap(([year, payload]) =>
    (payload.students || []).map((student, idx) => {
      const generatedLocation = DEFAULT_LOCATIONS[(idx + Number(year)) % DEFAULT_LOCATIONS.length];
      const generatedMentor = DEFAULT_MENTORS[(idx + Number(year)) % DEFAULT_MENTORS.length];
      const generatedMode = DEFAULT_MODES[(idx + Number(year)) % DEFAULT_MODES.length];
      const baseStipend = Number(student.stipend || 0);
      const stipend = idx % 5 === 0 ? 0 : baseStipend;

      return {
        ...student,
        year: Number(year),
        location: generatedLocation,
        mentor: generatedMentor,
        mode: generatedMode,
        stipend,
        hasPlacement: Boolean(student.converted),
      };
    })
  );
}

export default function InternshipOverview() {
  const records = useMemo(() => makeInternshipRecords(), []);
  const years = useMemo(
    () => [...new Set(records.map(item => item.year))].sort((a, b) => a - b),
    [records]
  );

  const [filters, setFilters] = useState({
    year: 'all',
    company: 'all',
    stipend: 'all',
    location: 'all',
    mode: 'all',
    mentor: 'all',
  });

  const filterOptions = useMemo(() => ({
    companies: [...new Set(records.map(item => item.company))].sort(),
    locations: [...new Set(records.map(item => item.location))].sort(),
    modes: [...new Set(records.map(item => item.mode))].sort(),
    mentors: [...new Set(records.map(item => item.mentor))].sort(),
  }), [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      const yearOk = filters.year === 'all' || String(item.year) === filters.year;
      const companyOk = filters.company === 'all' || item.company === filters.company;
      const locationOk = filters.location === 'all' || item.location === filters.location;
      const modeOk = filters.mode === 'all' || item.mode === filters.mode;
      const mentorOk = filters.mentor === 'all' || item.mentor === filters.mentor;

      const stipendOk =
        filters.stipend === 'all' ||
        (filters.stipend === 'paid' && item.stipend > 0) ||
        (filters.stipend === 'non-paid' && item.stipend <= 0);

      return yearOk && companyOk && locationOk && modeOk && mentorOk && stipendOk;
    });
  }, [records, filters]);

  const internVsYear = useMemo(() => {
    return years.map(year => {
      const yearData = filteredRecords.filter(item => item.year === year);
      return {
        year: String(year),
        interns: yearData.length,
      };
    });
  }, [filteredRecords, years]);

  const stipendDistribution = useMemo(() => {
    const bins = ['No Stipend', '< 10K', '10-20K', '20-40K', '40-80K', '80K+'];
    const counts = Object.fromEntries(bins.map(bin => [bin, 0]));

    filteredRecords.forEach(item => {
      counts[getStipendRange(item.stipend)] += 1;
    });

    return bins.map(range => ({ range, count: counts[range] }));
  }, [filteredRecords]);

  const stipendVsNonStipend = useMemo(() => {
    return years.map(year => {
      const yearData = filteredRecords.filter(item => item.year === year);
      const paid = yearData.filter(item => item.stipend > 0).length;
      const nonPaid = yearData.filter(item => item.stipend <= 0).length;

      return {
        year: String(year),
        paid,
        nonPaid,
      };
    });
  }, [filteredRecords, years]);

  const topCompanies = useMemo(() => {
    const companyMap = {};
    filteredRecords.forEach(item => {
      if (!companyMap[item.company]) {
        companyMap[item.company] = { name: item.company, interns: 0, stipendSum: 0 };
      }
      companyMap[item.company].interns += 1;
      companyMap[item.company].stipendSum += item.stipend;
    });

    return Object.values(companyMap)
      .sort((a, b) => b.interns - a.interns)
      .slice(0, 8)
      .map(row => ({
        ...row,
        avgStipend: row.interns ? Math.round(row.stipendSum / row.interns) : 0,
      }));
  }, [filteredRecords]);

  const kpiData = useMemo(() => {
    const totalInterns = filteredRecords.length;
    const paidInternships = filteredRecords.filter(item => item.stipend > 0);
    const avgStipend = paidInternships.length
      ? Math.round(paidInternships.reduce((sum, item) => sum + item.stipend, 0) / paidInternships.length)
      : 0;
    const companies = new Set(filteredRecords.map(item => item.company)).size;
    const placementCount = filteredRecords.filter(item => item.hasPlacement).length;
    const placementRate = totalInterns ? Number(((placementCount / totalInterns) * 100).toFixed(1)) : 0;

    return {
      totalInterns,
      avgStipend,
      companies,
      placementRate,
      placementCount,
    };
  }, [filteredRecords]);

  const kpis = [
    {
      label: 'Total Interns',
      value: kpiData.totalInterns,
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Avg Stipend (Paid)',
      value: kpiData.avgStipend ? `₹${(kpiData.avgStipend / 1000).toFixed(0)}K/mo` : '₹0',
      icon: Award,
      color: 'bg-cyan-50 text-cyan-700',
    },
    {
      label: 'Companies',
      value: kpiData.companies,
      icon: Building2,
      color: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Internship with Placement',
      value: `${kpiData.placementRate}% (${kpiData.placementCount})`,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Internship Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Internship statistics, filters, and placement-linked insights across batches</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.year}
              onChange={e => handleFilterChange('year', e.target.value)}
            >
              <option value="all">Year: All</option>
              {years.map(year => (
                <option key={year} value={String(year)}>{`Year: ${year}`}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.company}
              onChange={e => handleFilterChange('company', e.target.value)}
            >
              <option value="all">Company: All</option>
              {filterOptions.companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.stipend}
              onChange={e => handleFilterChange('stipend', e.target.value)}
            >
              <option value="all">Stipend: All</option>
              <option value="paid">Paid only</option>
              <option value="non-paid">Non-stipend only</option>
            </select>

            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.location}
              onChange={e => handleFilterChange('location', e.target.value)}
            >
              <option value="all">Location: All</option>
              {filterOptions.locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.mode}
              onChange={e => handleFilterChange('mode', e.target.value)}
            >
              <option value="all">Mode: All</option>
              {filterOptions.modes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              value={filters.mentor}
              onChange={e => handleFilterChange('mentor', e.target.value)}
            >
              <option value="all">Mentor: All</option>
              {filterOptions.mentors.map(mentor => (
                <option key={mentor} value={mentor}>{mentor}</option>
              ))}
            </select>
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
                <Bar dataKey="nonPaid" name="Non-Stipend" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Companies */}
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
                    <td className="px-5 py-3 font-semibold text-indigo-600">₹{(c.avgStipend / 1000).toFixed(0)}K</td>
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
