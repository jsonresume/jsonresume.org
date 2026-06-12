/**
 * Pure presentation helpers for JobDetail.
 */

// Safely render a job location, which may be a string or an object.
export function getLocationString(location) {
  if (!location) return 'Location TBD';
  if (typeof location === 'string') return location;
  const parts = [location.city, location.region, location.country]
    .filter(Boolean)
    .join(', ');
  return parts || 'Location TBD';
}

// Parse the GPT-enriched job content blob. Matches the original behavior:
// returns {} when absent, parses otherwise (throwing on invalid JSON).
export function parseGptJob(job) {
  return job?.gpt_content ? JSON.parse(job.gpt_content) : {};
}
