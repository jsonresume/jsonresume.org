'use client';

import { AnimatePresence } from 'framer-motion';
import { JobItem } from './JobItem';

export function JobList({ jobs }) {
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {jobs.map((job) => (
          <JobItem key={job.uuid} job={job} />
        ))}
      </AnimatePresence>
    </div>
  );
}
