// Truncate text to specified length
const truncate = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const JobNodeContent = ({ jobData }) => (
  <div className="job-card-content">
    <div className="job-title">{truncate(jobData?.title, 35) || 'Unknown'}</div>
    <div className="company-name">
      {truncate(jobData?.company, 25) || 'Unknown'}
    </div>
    {jobData?.type && <div className="job-type-badge">{jobData.type}</div>}
  </div>
);
