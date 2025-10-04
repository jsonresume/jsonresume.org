export const JobNodeContent = ({ jobData }) => (
  <div className="job-card-content">
    <div className="job-title">{jobData?.title || 'Unknown Position'}</div>
    <div className="company-name">
      <svg
        className="company-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      {jobData?.company || 'Unknown Company'}
    </div>

    <div className="job-meta">
      <div className="meta-pills">
        {jobData?.type && <div className="meta-pill type">{jobData.type}</div>}
        {jobData?.remote && (
          <div className="meta-pill remote">{jobData.remote}</div>
        )}
        {jobData?.salary && (
          <div className="meta-pill salary">{jobData.salary}</div>
        )}
      </div>
    </div>
  </div>
);
