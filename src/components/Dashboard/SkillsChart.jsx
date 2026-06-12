import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { skillsData } from '../../data/skillsData';

export default function SkillsChart() {
  const top8 = skillsData.slice(0, 8);
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Skills Among Placed Students</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={top8} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={90} />
          <Tooltip />
          <Bar dataKey="students" fill="#22c55e" radius={[0, 4, 4, 0]} name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}