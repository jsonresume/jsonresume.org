import {
  categorizeJobType,
  categorizeExperience,
  categorizeSalary,
  categorizeLocation,
} from '../../utils/categorization';
import { parseJobContent, getLocationString } from '../../utils/jobParser';

/**
 * Apply category filters to jobs
 */
export const applyCategoryFilters = (jobs, filters) => {
  let result = jobs;

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

  return result;
};
