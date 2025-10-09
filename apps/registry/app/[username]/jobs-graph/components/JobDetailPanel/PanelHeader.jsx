import { highlightText } from '../../utils/textUtils';
import { Button } from '@repo/ui';
import { Check } from 'lucide-react';

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
        <Button
          onClick={onMarkAsRead}
          variant={isRead ? 'default' : 'secondary'}
          size="sm"
          className={`ml-4 rounded-full ${isRead ? 'shadow-md' : ''}`}
        >
          <Check
            className={`w-4 h-4 mr-1.5 ${isRead ? 'animate-bounce-once' : ''}`}
          />
          {isRead ? 'Read' : 'Mark as Read'}
        </Button>
      </div>
    </div>
  );
}
