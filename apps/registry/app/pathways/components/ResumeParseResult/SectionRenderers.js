'use client';

import { Code, Calendar, MapPin } from 'lucide-react';

/**
 * Render details for the basics section
 */
export function renderBasicsDetails(data) {
  return (
    <div className="space-y-2">
      {data.name && (
        <div>
          <strong>Name:</strong> {data.name}
        </div>
      )}
      {data.label && (
        <div>
          <strong>Title:</strong> {data.label}
        </div>
      )}
      {data.email && (
        <div>
          <strong>Email:</strong> {data.email}
        </div>
      )}
      {data.phone && (
        <div>
          <strong>Phone:</strong> {data.phone}
        </div>
      )}
      {data.location && (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {data.location.city && data.location.region
            ? `${data.location.city}, ${data.location.region}`
            : data.location.city || data.location.region}
        </div>
      )}
      {data.summary && (
        <div className="mt-2">
          <strong>Summary:</strong>
          <p className="text-sm text-gray-600 mt-1">{data.summary}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Render details for the work section
 */
export function renderWorkDetails(data) {
  return (
    <div className="space-y-3">
      {data.map((job, index) => (
        <div key={index} className="border-l-2 border-gray-200 pl-3">
          <div className="font-medium">{job.position}</div>
          <div className="text-sm text-gray-600">{job.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job.startDate} {job.endDate && `- ${job.endDate}`}
          </div>
          {job.highlights && job.highlights.length > 0 && (
            <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
              {job.highlights.slice(0, 2).map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
              {job.highlights.length > 2 && (
                <li className="text-gray-400">
                  +{job.highlights.length - 2} more...
                </li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Render details for the education section
 */
export function renderEducationDetails(data) {
  return (
    <div className="space-y-2">
      {data.map((edu, index) => (
        <div key={index} className="border-l-2 border-gray-200 pl-3">
          <div className="font-medium">
            {edu.studyType} {edu.area && `in ${edu.area}`}
          </div>
          <div className="text-sm text-gray-600">{edu.institution}</div>
          {(edu.startDate || edu.endDate) && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Render details for the skills section
 */
export function renderSkillsDetails(data) {
  return (
    <div className="space-y-2">
      {data.map((skill, index) => (
        <div key={index} className="flex items-start gap-2">
          <Code className="w-3 h-3 mt-0.5 text-gray-400" />
          <div>
            <div className="font-medium text-sm">{skill.name}</div>
            {skill.keywords && skill.keywords.length > 0 && (
              <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                {skill.keywords.slice(0, 5).map((keyword, i) => (
                  <span key={i} className="bg-gray-100 px-1 rounded">
                    {keyword}
                  </span>
                ))}
                {skill.keywords.length > 5 && (
                  <span className="text-gray-400">
                    +{skill.keywords.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Render details for any section
 */
export function renderSectionDetails(section, data) {
  switch (section) {
    case 'basics':
      return renderBasicsDetails(data);
    case 'work':
      return renderWorkDetails(data);
    case 'education':
      return renderEducationDetails(data);
    case 'skills':
      return renderSkillsDetails(data);
    default:
      return (
        <div className="text-sm text-gray-600">
          {JSON.stringify(data, null, 2)}
        </div>
      );
  }
}
