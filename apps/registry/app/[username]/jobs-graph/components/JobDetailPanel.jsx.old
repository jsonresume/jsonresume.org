import { highlightText } from '../utils/textUtils';

export const JobDetailPanel = ({
  selectedNode,
  filterText,
  username,
  readJobs,
  onMarkAsRead,
}) => {
  if (!selectedNode || !selectedNode.data.jobInfo) return null;

  const jobInfo = selectedNode.data.jobInfo;
  const isRead = readJobs.has(`${username}_${selectedNode.id}`);

  return (
    <div className="absolute top-4 right-4 max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 divide-y divide-gray-100">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {filterText
                ? highlightText(jobInfo.title, filterText)
                : jobInfo.title}
            </h3>
            <p className="text-indigo-600 font-medium mt-1">
              {filterText
                ? highlightText(jobInfo.company, filterText)
                : jobInfo.company}
            </p>
            <div className="flex gap-3 mt-2">
              {jobInfo.type && (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {jobInfo.type}
                </span>
              )}
              {jobInfo.remote && (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                  {jobInfo.remote} Remote
                </span>
              )}
              {jobInfo.salary && (
                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/10">
                  {jobInfo.salary}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onMarkAsRead(selectedNode.id)}
            className={`ml-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              isRead
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md'
            }`}
          >
            <svg
              className={`w-4 h-4 ${isRead ? 'animate-bounce-once' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {isRead ? 'Read' : 'Mark as Read'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {jobInfo.location && (
          <div className="flex items-start gap-2 text-gray-600">
            <svg
              className="w-5 h-5 mt-0.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {jobInfo.location.city}
              {jobInfo.location.region && `, ${jobInfo.location.region}`}
            </span>
          </div>
        )}

        {jobInfo.description && (
          <div className="text-gray-600 text-sm leading-relaxed">
            {filterText
              ? highlightText(jobInfo.description, filterText)
              : jobInfo.description}
          </div>
        )}

        {jobInfo.skills && jobInfo.skills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {jobInfo.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {filterText
                    ? highlightText(skill.name, filterText)
                    : skill.name}
                  {skill.level && (
                    <span className="ml-1 text-gray-400">
                      •{' '}
                      {filterText
                        ? highlightText(skill.level, filterText)
                        : skill.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {jobInfo.qualifications && jobInfo.qualifications.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Qualifications
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {jobInfo.qualifications.map((qual, index) => (
                <li key={index}>
                  {filterText ? highlightText(qual, filterText) : qual}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end">
        <a
          href={`/jobs/${selectedNode.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
        >
          View Job Details
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};
