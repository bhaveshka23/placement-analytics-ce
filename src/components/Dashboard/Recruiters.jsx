export default function Recruiters({ recruiters = [] }) {
  const top = recruiters.map((company, index) => ({
    id: `${company.company__name}-${index}`,
    name: company.company__name,
    studentsPlaced: company.count,
  }));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Recruiters</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {top.map(c => (
          <div key={c.id} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 text-center">{c.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.studentsPlaced} placed</p>
          </div>
        ))}
      </div>
    </div>
  );
}
