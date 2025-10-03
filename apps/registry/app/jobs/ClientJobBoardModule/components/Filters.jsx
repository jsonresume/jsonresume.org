import {
  Filter,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  Building,
} from 'lucide-react';
import { FilterSection } from './FilterSection';

export const Filters = ({
  filters,
  setFilters,
  filterOptions,
  activeFilterCount,
}) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        {activeFilterCount > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>

      <FilterSection
        title="Job Type"
        options={filterOptions.jobType}
        value={filters.jobType}
        onChange={(value) => updateFilter('jobType', value)}
        icon={Briefcase}
      />

      <FilterSection
        title="Experience"
        options={filterOptions.experience}
        value={filters.experience}
        onChange={(value) => updateFilter('experience', value)}
        icon={Clock}
      />

      <FilterSection
        title="Location"
        options={filterOptions.location}
        value={filters.location}
        onChange={(value) => updateFilter('location', value)}
        icon={MapPin}
      />

      <FilterSection
        title="Salary"
        options={filterOptions.salary}
        value={filters.salary}
        onChange={(value) => updateFilter('salary', value)}
        icon={DollarSign}
      />

      <FilterSection
        title="Company"
        options={filterOptions.company}
        value={filters.company}
        onChange={(value) => updateFilter('company', value)}
        icon={Building}
      />
    </div>
  );
};
