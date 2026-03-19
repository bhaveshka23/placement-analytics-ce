import DashboardLayout from '../components/Layout/DashboardLayout';
import { skillsData, skillsByDomain } from '../data/skillsData';
import { yearlyComparison } from '../data/placementsData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6'];

export default function Analytics() {
  const radarData = skillsData.slice(0, 6).map(s => ({ skill: s.skill, demand: s.demand, students: Math.round(s.students / 2.5) }));

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Deep-dive analytics and skill insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Skill Demand vs Student Proficiency</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                <Radar name="Demand" dataKey="demand" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Radar name="Students" dataKey="students" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Skills by Domain</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={skillsByDomain} dataKey="value" nameKey="domain" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {skillsByDomain.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">5-Year Placement Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="placed" stroke="#6366f1" strokeWidth={2} name="Students Placed" dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} name="Avg Package (LPA)" dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} name="Placement Rate %" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Skills – Student Count</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={skillsData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
              <Bar dataKey="demand" fill="#22c55e" radius={[4, 4, 0, 0]} name="Demand Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
