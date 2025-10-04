import { parseJobContent } from '../../utils/jobParser';

/**
 * Filter jobs by search term
 */
export const filterBySearchTerm = (jobs, searchTerm) => {
  if (!searchTerm) return jobs;

  const searchLower = searchTerm.toLowerCase();

  return jobs.filter((job) => {
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
};
