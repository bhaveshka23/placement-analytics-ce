import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function ChartsSection({ yearVsCompanies = [], yearWisePlacements = [] }) {
  const yearCompanies = yearVsCompanies.map((item) => ({
    year: String(item.year),
    companiesVisited: item.companies,
  }));

  const placements = yearWisePlacements.map((item) => ({
    year: String(item.year),
    placed: item.students,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Year vs companies visited */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Year vs Companies Visited</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={yearCompanies}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="companiesVisited" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Companies Visited" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Year-wise comparison */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Year-wise Placement Comparison</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={placements}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students Placed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
