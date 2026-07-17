/**
 * Presentational sections for ResumePane: identity/quick-info and the
 * scrollable resume body (skills, work). Education-onward sections live in
 * ./ResumeSectionsExtra. Each renders nothing when its data is empty.
 */

'use client';

import { formatDate } from './resumeUtils';

export function ResumeIdentity({ basics, yearsOfExperience }) {
  return (
    <>
      {/* Name & Headline */}
      <div className="pb-3 border-b border-slate-200">
        <div className="text-lg font-bold text-slate-900">
          {basics.name || 'Unnamed Candidate'}
        </div>
        {basics.label && (
          <div className="text-sm text-slate-600 mt-1">{basics.label}</div>
        )}
        {basics.summary && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {basics.summary}
          </p>
        )}
      </div>

      {/* Quick Info */}
      <div className="space-y-2">
        {yearsOfExperience > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500">💼</span>
            <span className="text-slate-700">
              {yearsOfExperience} years experience
            </span>
          </div>
        )}
        {basics.location && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500">📍</span>
            <span className="text-slate-700">
              {basics.location.city || ''}
              {basics.location.city && basics.location.region && ', '}
              {basics.location.region || ''}
              {basics.location.country && `, ${basics.location.country}`}
            </span>
          </div>
        )}
        {basics.email && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500">📧</span>
            <span className="text-slate-700 text-xs break-all">
              {basics.email}
            </span>
          </div>
        )}
        {basics.phone && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500">📱</span>
            <span className="text-slate-700 text-xs">{basics.phone}</span>
          </div>
        )}
      </div>
    </>
  );
}

export function ResumeSkills({ skills }) {
  if (skills.length === 0) return null;
  return (
    <div className="pt-3 border-t border-slate-200">
      <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
        <span>⚡</span>
        <span>Skills</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-medium"
          >
            {typeof skill === 'string' ? skill : skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ResumeWork({ work }) {
  if (work.length === 0) return null;
  return (
    <div className="pt-3 border-t border-slate-200">
      <div className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <span>💼</span>
        <span>Work Experience</span>
      </div>
      <div className="space-y-3">
        {work.slice(0, 3).map((job, idx) => (
          <div key={idx} className="border-l-2 border-slate-200 pl-3">
            <div className="font-medium text-slate-900">{job.position}</div>
            <div className="text-xs text-slate-600">
              {job.name || job.company}
              {(job.startDate || job.endDate) && (
                <span className="text-slate-400">
                  {' • '}
                  {formatDate(job.startDate)} - {formatDate(job.endDate)}
                </span>
              )}
            </div>
            {job.summary && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {job.summary}
              </p>
            )}
            {job.highlights && job.highlights.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {job.highlights.slice(0, 2).map((highlight, hIdx) => (
                  <li
                    key={hIdx}
                    className="text-xs text-slate-600 flex items-start gap-1"
                  >
                    <span className="text-slate-400">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {work.length > 3 && (
          <div className="text-xs text-slate-500 italic">
            +{work.length - 3} more positions
          </div>
        )}
      </div>
    </div>
  );
}
