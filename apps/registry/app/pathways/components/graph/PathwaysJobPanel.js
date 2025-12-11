import { Button } from '@repo/ui';
import { ExternalLink, Check, MapPin, Briefcase } from 'lucide-react';

/**
 * Job detail panel for Pathways graph
 * Simplified version of JobDetailPanel that works with PathwaysContext
 */
export function PathwaysJobPanel({
  selectedNode,
  filterText,
  readJobIds,
  onMarkAsRead,
}) {
  if (!selectedNode || !selectedNode.data?.jobInfo) return null;

  const jobInfo = selectedNode.data.jobInfo;
  const isRead = readJobIds.has(selectedNode.id);

  return (
    <div className="absolute top-4 right-4 max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {highlightText(jobInfo.title, filterText)}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {highlightText(jobInfo.company, filterText)}
            </p>
          </div>
          <Button
            variant={isRead ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onMarkAsRead(selectedNode.id)}
            className="shrink-0"
          >
            {isRead ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Read
              </>
            ) : (
              'Mark Read'
            )}
          </Button>
        </div>

        {/* Salary and Type */}
        <div className="flex items-center gap-3 mt-2 text-sm">
          {jobInfo.salary && (
            <span className="text-green-600 font-medium">{jobInfo.salary}</span>
          )}
          {jobInfo.type && (
            <span className="flex items-center gap-1 text-gray-500">
              <Briefcase className="w-3 h-3" />
              {jobInfo.type}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {/* Location */}
        {jobInfo.location && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {[jobInfo.location.city, jobInfo.location.region]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Description */}
        {jobInfo.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {highlightText(
              jobInfo.description.length > 300
                ? jobInfo.description.slice(0, 300) + '...'
                : jobInfo.description,
              filterText
            )}
          </p>
        )}

        {/* Skills */}
        {jobInfo.skills?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {jobInfo.skills.slice(0, 8).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                >
                  {highlightText(skill.name || skill, filterText)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <a
          href={`/jobs/${selectedNode.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          View Full Details
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

/**
 * Highlight matching text
 */
function highlightText(text, filter) {
  if (!text || !filter) return text;

  const parts = text.split(new RegExp(`(${escapeRegex(filter)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === filter.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
