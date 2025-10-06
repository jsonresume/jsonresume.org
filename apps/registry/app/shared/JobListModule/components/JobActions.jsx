import Link from 'next/link';
import { Button } from '@repo/ui';

export function JobActions({ job, makeCoverletter }) {
  return (
    <div className="mt-4 flex gap-4">
      <Button onClick={() => makeCoverletter(job.raw)}>
        Make Cover Letter
      </Button>
      <Button variant="secondary" asChild>
        <a href={job.raw?.url || '#'} target="_blank" rel="noopener noreferrer">
          View Original Job
        </a>
      </Button>

      <Button variant="secondary" asChild>
        <Link
          href={`/jobs/${job.raw.uuid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job Candidates
        </Link>
      </Button>
    </div>
  );
}
