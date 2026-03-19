import { useState } from 'react';
import { Filter } from 'lucide-react';

export default function FilterBar({ onFilter }) {
  const [year, setYear] = useState('All');
  const [type, setType] = useState('All');

  const handleApply = () => {
    if (onFilter) onFilter({ year, type });
  };

  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-gray-500">
        <Filter size={16} />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <select
        value={year}
        onChange={e => setYear(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
      >
        {['All', 2025, 2024, 2023].map(y => <option key={y}>{y}</option>)}
      </select>
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
      >
        {['All', 'Product', 'Service', 'Startup'].map(t => <option key={t}>{t}</option>)}
      </select>
      <button
        onClick={handleApply}
        className="ml-auto text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
}
