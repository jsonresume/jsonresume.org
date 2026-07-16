/**
 * Pure presentation helpers for ResumePane.
 */

// Format a resume date string as "Mon YYYY"; missing dates render as "Present".
export function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

// Estimate total years of experience by summing work date ranges.
// Ongoing roles (no endDate) count through today. Matches the original
// month-based rounding.
export function calcYearsOfExperience(work) {
  const totalMonths = work.reduce((total, job) => {
    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    if (!startDate) return total;
    const months = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return total + months;
  }, 0);
  return Math.round(totalMonths / 12);
}
