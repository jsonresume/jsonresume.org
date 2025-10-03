export const parseGptContent = (job) => {
  if (!job?.gpt_content || job.gpt_content === 'FAILED') {
    return {};
  }
  try {
    return JSON.parse(job.gpt_content);
  } catch {
    return {};
  }
};

export const formatLocation = (location) => {
  if (!location) return '';
  return [location.city, location.region, location.countryCode]
    .filter(Boolean)
    .join(', ');
};

export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  return `$${Number(salary).toLocaleString()}/year`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
