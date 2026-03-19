import { studentsData } from '../../data/studentsData';

export default function PlacementTable({ limit = 8 }) {
  const rows = studentsData.slice(0, limit);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Placement Records</h3>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.rollNo}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700">{s.company}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.skills.slice(0, 2).map(sk => (
                      <span key={sk} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{sk}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-semibold text-gray-800">₹{s.package} LPA</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{s.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
