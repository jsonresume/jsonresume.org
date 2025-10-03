import { JobItem } from './JobItem';

export const JobList = ({ jobs }) => {
  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobItem key={job.uuid} job={job} />
      ))}
    </div>
  );
};
