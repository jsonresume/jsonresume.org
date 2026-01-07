import { Briefcase, Calendar } from 'lucide-react';
import { formatDate } from './utils';

export default function WorkSection({ work }) {
  if (!work || work.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-indigo-600" />
        Work Experience
      </h2>
      <div className="space-y-6">
        {work.map((job, idx) => (
          <div key={idx} className="relative pl-8">
            <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-600 rounded-full" />
            <div className="border-l-2 border-gray-200 absolute left-1 top-4 h-full -ml-px" />

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {job.position}
              </h3>
              <div className="text-gray-700 font-medium">
                {job.name}
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-indigo-600 text-sm hover:underline"
                  >
                    ↗
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(job.startDate)} -{' '}
                {job.endDate ? formatDate(job.endDate) : 'Present'}
              </div>
              {job.summary && (
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {job.summary}
                </p>
              )}
              {job.highlights && job.highlights.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {job.highlights.map((highlight, hidx) => (
                    <li key={hidx} className="text-gray-700 flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="flex-1">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
