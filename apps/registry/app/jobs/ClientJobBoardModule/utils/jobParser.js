/**
 * Parse GPT content from job
 * @param {Object} job - Job object
 * @returns {Object} Parsed GPT content
 */
export const parseJobContent = (job) => {
  if (job.gpt_content && job.gpt_content !== 'FAILED') {
    return JSON.parse(job.gpt_content);
  }
  return {};
};

/**
 * Get location string from job
 * @param {Object} gptContent - Parsed GPT content
 * @returns {string} Location string
 */
export const getLocationString = (gptContent) => {
  return [
    gptContent.location?.city,
    gptContent.location?.region,
    gptContent.location?.countryCode,
  ]
    .filter(Boolean)
    .join(', ');
};
