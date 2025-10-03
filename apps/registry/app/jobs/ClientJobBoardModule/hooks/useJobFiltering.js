import { useState, useEffect, useMemo } from 'react';
import {
  categorizeJobType,
  categorizeExperience,
  categorizeSalary,
  categorizeLocation,
} from '../utils/categorization';
import { parseJobContent, getLocationString } from '../utils/jobParser';

/**
 * Hook to manage job filtering
 * @param {Array} jobs - List of jobs
 * @returns {Object} Filter state and filtered jobs
 */
export const useJobFiltering = (jobs) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    location: '',
    salary: '',
    company: '',
  });

  // Extract and categorize unique values for each filter
  const filterOptions = useMemo(() => {
    const options = {
      jobType: new Set(),
      experience: new Set(),
      location: new Set(),
      salary: new Set(),
      company: new Set(),
    };

    jobs.forEach((job) => {
      const gptContent = parseJobContent(job);

      if (gptContent.type) {
        options.jobType.add(categorizeJobType(gptContent.type));
      }
      if (gptContent.experience) {
        options.experience.add(categorizeExperience(gptContent.experience));
      }
      if (gptContent.location) {
        const location = getLocationString(gptContent);
        if (location) {
          options.location.add(categorizeLocation(location));
        }
      }
      if (gptContent.salary) {
        options.salary.add(categorizeSalary(gptContent.salary));
      }
      if (gptContent.company) {
        options.company.add(gptContent.company);
      }
    });

    return {
      jobType: Array.from(options.jobType).sort(),
      experience: Array.from(options.experience).sort(),
      location: Array.from(options.location).sort(),
      salary: Array.from(options.salary).sort(),
      company: Array.from(options.company).sort(),
    };
  }, [jobs]);

  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((job) => {
        const gptContent = parseJobContent(job);

        return (
          gptContent.title?.toLowerCase().includes(searchLower) ||
          gptContent.company?.toLowerCase().includes(searchLower) ||
          gptContent.description?.toLowerCase().includes(searchLower) ||
          gptContent.requirements?.some((req) =>
            req.toLowerCase().includes(searchLower)
          ) ||
          gptContent.responsibilities?.some((resp) =>
            resp.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((job) => {
          const gptContent = parseJobContent(job);

          switch (key) {
            case 'jobType':
              return categorizeJobType(gptContent.type) === value;
            case 'experience':
              return categorizeExperience(gptContent.experience) === value;
            case 'location':
              const jobLocation = getLocationString(gptContent);
              return categorizeLocation(jobLocation) === value;
            case 'salary':
              return categorizeSalary(gptContent.salary) === value;
            case 'company':
              return gptContent.company === value;
            default:
              return true;
          }
        });
      }
    });

    setFilteredJobs(result);
  }, [searchTerm, filters, jobs]);

  const clearFilters = () => {
    setFilters({
      jobType: '',
      experience: '',
      location: '',
      salary: '',
      company: '',
    });
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
