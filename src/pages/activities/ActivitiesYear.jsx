import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { activitiesData } from '../../data/activitiesData';
import { Calendar, Users, Trophy } from 'lucide-react';

const categoryColors = {
  Hackathon: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Workshop: 'bg-green-50 text-green-600 border-green-100',
  'Guest Lecture': 'bg-amber-50 text-amber-600 border-amber-100',
  'Coding Contest': 'bg-pink-50 text-pink-600 border-pink-100',
  'Interview Prep': 'bg-teal-50 text-teal-600 border-teal-100',
};

export default function ActivitiesYear() {
  const { year } = useParams();
  const yr = parseInt(year);
  const activities = activitiesData[yr];

  if (!activities) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg font-medium">No activities for year {year}</p>
          <Link to="/activities/overview" className="mt-3 text-indigo-600 text-sm hover:underline">Back to Overview</Link>
        </div>
      </DashboardLayout>
    );
  }

  const totalParticipants = activities.reduce((sum, a) => sum + a.participants, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Activities – {year}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{activities.length} activities · {totalParticipants} total participants</p>
          </div>
          <div className="flex gap-2">
            {[2025, 2024, 2023].map(y => (
              <Link
                key={y}
                to={`/activities/${y}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${yr === y ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Activities', value: activities.length },
            { label: 'Total Participants', value: totalParticipants },
            { label: 'Categories', value: [...new Set(activities.map(a => a.category))].length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Activity cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map(a => (
            <div key={a.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={a.image} alt={a.title} className="w-full h-44 object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium backdrop-blur-sm bg-white/80 ${categoryColors[a.category] || 'bg-gray-100 text-gray-600'}`}>
                    {a.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{a.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>{a.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={12} />
                    <span>{a.participants}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Trophy size={12} className="text-amber-500" />
                    <span className="text-amber-600 font-medium">{a.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
