import { highlightText } from '../../utils/textUtils';

export function PanelHeader({ jobInfo, filterText, isRead, onMarkAsRead }) {
  return (
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
          onClick={onMarkAsRead}
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
  );
}
