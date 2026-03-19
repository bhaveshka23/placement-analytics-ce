import { TrendingUp, Users, Building2, Award } from 'lucide-react';

const cards = [
  { label: 'Students Placed', value: '312', sub: '+8.4% vs last year', icon: Users, color: 'bg-indigo-50 text-indigo-600', trend: 'up' },
  { label: 'Placement Rate', value: '86.7%', sub: '+2.9% vs last year', icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: 'up' },
  { label: 'Avg Package', value: '₹8.4 LPA', sub: '+7.7% vs last year', icon: Award, color: 'bg-amber-50 text-amber-600', trend: 'up' },
  { label: 'Companies Visited', value: '78', sub: '+9.9% vs last year', icon: Building2, color: 'bg-purple-50 text-purple-600', trend: 'up' },
];

export default function KPISection() {
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
