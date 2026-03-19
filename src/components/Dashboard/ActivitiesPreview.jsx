import { activitiesData } from '../../data/activitiesData';
import { Calendar } from 'lucide-react';

const categoryColors = {
  Hackathon: 'bg-indigo-50 text-indigo-600',
  Workshop: 'bg-green-50 text-green-600',
  'Guest Lecture': 'bg-amber-50 text-amber-600',
  'Coding Contest': 'bg-pink-50 text-pink-600',
  'Interview Prep': 'bg-teal-50 text-teal-600',
};

export default function ActivitiesPreview() {
  const recent = activitiesData[2025].slice(0, 4);
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {recent.map(a => (
          <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="shrink-0 mt-0.5">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{a.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.date} · {a.participants} participants</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${categoryColors[a.category] || 'bg-gray-100 text-gray-600'}`}>
              {a.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
