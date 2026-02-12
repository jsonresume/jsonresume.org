import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import WhyMatch from '../../WhyMatch';
import { highlightText } from './highlightText';

export function JobPanelContent({ jobInfo, selectedNode, filterText }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const hasLongDescription = jobInfo.description?.length > 300;
  const hasMoreSkills = jobInfo.skills?.length > 8;
  const displayedSkills = showAllSkills
    ? jobInfo.skills
    : jobInfo.skills?.slice(0, 8);

  return (
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
  );
}
