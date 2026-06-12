import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const insights = [
  { icon: TrendingUp, color: 'text-green-600 bg-green-50', text: 'Placement rate increased by 2.9% compared to 2024. Highest in 5 years.' },
  { icon: Lightbulb, color: 'text-amber-600 bg-amber-50', text: 'Python and ML skills are most in-demand. 95% demand score among recruiters.' },
  { icon: CheckCircle, color: 'text-indigo-600 bg-indigo-50', text: '42% of interns received full-time offers from their internship companies.' },
  { icon: AlertCircle, color: 'text-red-500 bg-red-50', text: '13.3% students are yet to be placed. Focus on service sector drives recommended.' },
];

export default function Insights() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Key Insights</h3>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${ins.color}`}>
              <ins.icon size={15} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}