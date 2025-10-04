import { useMemo } from 'react';
import {
  categorizeJobType,
  categorizeExperience,
  categorizeSalary,
  categorizeLocation,
} from '../../utils/categorization';
import { parseJobContent, getLocationString } from '../../utils/jobParser';

/**
 * Extract and categorize unique filter options from jobs
 */
export const useFilterOptions = (jobs) => {
  return useMemo(() => {
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
};
