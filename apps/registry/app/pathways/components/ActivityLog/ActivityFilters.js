'use client';

import { ACTIVITY_FILTERS } from './activityConfig';

export default function ActivityFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {ACTIVITY_FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            activeFilter === filter.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
