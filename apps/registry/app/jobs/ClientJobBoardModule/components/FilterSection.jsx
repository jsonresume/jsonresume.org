import { X } from 'lucide-react';

export const FilterSection = ({
  title,
  options,
  value,
  onChange,
  icon: Icon,
}) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All {title}s</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
