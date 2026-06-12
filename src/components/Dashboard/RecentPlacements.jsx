import { studentsData } from '../../data/studentsData';

export default function RecentPlacements() {
  const recent = studentsData.slice(0, 5);
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Placements</h3>
      <div className="space-y-3">
        {recent.map(s => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
              {s.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
              <p className="text-xs text-gray-400">{s.company}</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
              ₹{s.package} LPA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}