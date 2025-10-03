'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useJobFiltering } from './hooks/useJobFiltering';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { JobList } from './components/JobList';

const ClientJobBoard = ({ initialJobs }) => {
  const [jobs] = useState(initialJobs);

  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filterOptions,
    clearFilters,
    activeFilterCount,
  } = useJobFiltering(jobs);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-80">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="sticky top-4">
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}{' '}
            found
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Clear all filters
              <X className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        <JobList jobs={filteredJobs} />
      </div>
    </div>
  );
};

export default ClientJobBoard;
