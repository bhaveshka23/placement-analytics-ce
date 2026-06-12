import { TrendingUp, Users, Building2, Award } from 'lucide-react';

function buildCards(kpis) {
  return [
    {
      label: 'Students Placed',
      value: kpis?.students_placed ?? '--',
      sub: 'Unique students with placement offers',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Placement Rate',
      value: Number.isFinite(kpis?.placement_rate) ? `${kpis.placement_rate}%` : '--',
      sub: 'Computed from analytics dataset',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Avg Package',
      value: Number.isFinite(kpis?.avg_package) ? `₹${kpis.avg_package} LPA` : '--',
      sub: 'Average package across offers',
      icon: Award,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Companies Visited',
      value: kpis?.companies_visited ?? '--',
      sub: 'Distinct companies in records',
      icon: Building2,
      color: 'bg-purple-50 text-purple-600',
    },
  ];
}

export default function KPISection({ kpis }) {
  const cards = buildCards(kpis);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{c.value}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> {c.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${c.color}`}>
              <c.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}