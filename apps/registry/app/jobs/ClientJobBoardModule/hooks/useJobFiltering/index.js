import { useState, useEffect } from 'react';
import { useFilterOptions } from './filterOptions';
import { filterBySearchTerm } from './searchFilter';
import { applyCategoryFilters } from './categoryFilter';
import { DEFAULT_FILTERS } from './constants';

/**
 * Hook to manage job filtering
 * @param {Array} jobs - List of jobs
 * @returns {Object} Filter state and filtered jobs
 */
export const useJobFiltering = (jobs) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filterOptions = useFilterOptions(jobs);

  useEffect(() => {
    let result = jobs;

    // Apply search filter
    result = filterBySearchTerm(result, searchTerm);

    // Apply category filters
    result = applyCategoryFilters(result, filters);

    setFilteredJobs(result);
  }, [searchTerm, filters, jobs]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filterOptions,
    clearFilters,
    activeFilterCount,
  };
};
