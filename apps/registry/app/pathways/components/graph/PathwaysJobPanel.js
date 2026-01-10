import { useState, useRef, useEffect } from 'react';
import { Button, Badge } from '@repo/ui';
import {
  ExternalLink,
  Check,
  MapPin,
  Briefcase,
  X,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Send,
} from 'lucide-react';
import WhyMatch from '../WhyMatch';

const SENTIMENTS = [
  { value: 'dismissed', label: 'Quick dismiss', icon: Check },
  { value: 'not_interested', label: 'Not interested', icon: ThumbsDown },
  { value: 'interested', label: 'Interested', icon: ThumbsUp },
  { value: 'applied', label: 'Applied', icon: Send },
];

/**
 * Job detail panel for Pathways graph
 */
export function PathwaysJobPanel({
  selectedNode,
  filterText,
  readJobIds,
  onMarkAsRead,
  onClose,
  onPromptFeedback,
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNode || !selectedNode.data?.jobInfo) return null;

  const jobInfo = selectedNode.data.jobInfo;
  const isRead = readJobIds.has(selectedNode.id);
  const hasLongDescription = jobInfo.description?.length > 300;
  const hasMoreSkills = jobInfo.skills?.length > 8;

  const displayedSkills = showAllSkills
    ? jobInfo.skills
    : jobInfo.skills?.slice(0, 8);

  const hnUrl = `https://news.ycombinator.com/item?id=${selectedNode.id}`;

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">
              {highlightText(jobInfo.title, filterText)}
            </h3>
            <p className="text-sm text-gray-600">
              {highlightText(jobInfo.company, filterText)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {jobInfo.salary && (
            <Badge className="bg-green-100 text-green-700 border-0">
              {jobInfo.salary}
            </Badge>
          )}
          {jobInfo.type && (
            <Badge variant="secondary" className="gap-1">
              <Briefcase className="w-3 h-3" />
              {jobInfo.type}
            </Badge>
          )}
          {jobInfo.experience && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              {jobInfo.experience}
            </Badge>
          )}
          {jobInfo.remote && (
            <Badge variant="secondary" className="gap-1 text-blue-600">
              <Globe className="w-3 h-3" />
              Remote
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
        {/* Location */}
        {jobInfo.location && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
            <span>
              {[jobInfo.location.city, jobInfo.location.region]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Description */}
        {jobInfo.description && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {showFullDescription || !hasLongDescription
                ? highlightText(jobInfo.description, filterText)
                : highlightText(
                    jobInfo.description.slice(0, 300) + '...',
                    filterText
                  )}
            </p>
            {hasLongDescription && (
              <button
                type="button"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Skills */}
        {jobInfo.skills?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Skills {hasMoreSkills && `(${jobInfo.skills.length})`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                >
                  {highlightText(skill.name || skill, filterText)}
                </span>
              ))}
            </div>
            {hasMoreSkills && (
              <button
                type="button"
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="text-xs text-indigo-600 hover:text-indigo-700 mt-2"
              >
                {showAllSkills
                  ? 'Show fewer'
                  : `+${jobInfo.skills.length - 8} more`}
              </button>
            )}
          </div>
        )}

        {/* Why Match AI Analysis */}
        <WhyMatch
          job={{
            id: selectedNode.id,
            title: jobInfo.title,
            company: jobInfo.company,
            description: jobInfo.description,
            skills: jobInfo.skills,
            bonusSkills: jobInfo.bonusSkills,
            location: jobInfo.location,
            remote: jobInfo.remote,
            salaryMin: jobInfo.salaryMin,
            salaryMax: jobInfo.salaryMax,
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 flex items-center gap-2">
        {/* Mark as Read dropdown */}
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="flex">
            <Button
              variant={isRead ? 'secondary' : 'default'}
              size="sm"
              onClick={() => onMarkAsRead(selectedNode.id)}
              className="flex-1 rounded-r-none"
            >
              {isRead ? (
                <>
                  <Check className="w-4 h-4 mr-1" /> Read
                </>
              ) : (
                'Mark as Read'
              )}
            </Button>
            <Button
              variant={isRead ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-2 rounded-l-none border-l border-white/20"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {showDropdown && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {SENTIMENTS.map((sentiment) => {
                const Icon = sentiment.icon;
                return (
                  <button
                    key={sentiment.value}
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      if (sentiment.value === 'dismissed') {
                        onMarkAsRead(selectedNode.id);
                      } else if (onPromptFeedback) {
                        onPromptFeedback(
                          {
                            id: selectedNode.id,
                            title: jobInfo.title,
                            company: jobInfo.company,
                          },
                          sentiment.value
                        );
                      }
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-gray-500" />
                    {sentiment.label}
                    {sentiment.value !== 'dismissed' && (
                      <MessageSquare className="w-3 h-3 ml-auto text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={hnUrl} target="_blank" rel="noopener noreferrer">
            Apply on HN
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
}

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
