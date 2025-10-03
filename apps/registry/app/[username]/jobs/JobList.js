import React from 'react';
import { JobDescription } from '../../shared/JobListModule/components/JobDescription';

const JobList = ({ jobs, makeCoverletter }) => {
  const validJobs = jobs?.filter(
    (job) => job.gpt_content && job.gpt_content !== 'FAILED'
  );
  const fullJobs = validJobs?.map((job) => {
    const fullJob = JSON.parse(job.gpt_content);
    fullJob.raw = job;
    return fullJob;
  });

  return (
    <div className="flex flex-col gap-5">
      {fullJobs?.map((job, index) => (
        <JobDescription
          key={index}
          job={job}
          makeCoverletter={makeCoverletter}
        />
      ))}
    </div>
  );
};

export default JobList;
