import Link from 'next/link';

export function JobActions({ job, makeCoverletter }) {
  return (
    <div className="mt-4 flex gap-4">
      <button
        className="bg-secondary-500 text-white py-2 px-4 rounded hover:bg-secondary-700 transition-colors duration-200"
        onClick={() => makeCoverletter(job.raw)}
      >
        Make Cover Letter
      </button>
      <a
        href={job.raw?.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
      >
        View Original Job
      </a>

      <Link
        href={`/jobs/${job.raw.uuid}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
      >
        View Job Candiates
      </Link>
    </div>
  );
}
