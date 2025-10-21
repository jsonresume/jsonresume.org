/**
 * ResumePane Component
 * Left pane - displays candidate resume
 */

'use client';

import { PreferencesPanel } from './PreferencesPanel';

// Component for displaying candidate resume

export function ResumePane({ resume, user, onPreferencesChange }) {
  if (!resume) {
    return (
      <div className="h-full bg-white rounded-2xl shadow-md p-6">
        <div className="text-center text-slate-500">No resume loaded</div>
      </div>
    );
  }

  const basics = resume.basics || {};
  const skills = resume.skills || [];
  const work = resume.work || [];

  // Calculate years of experience
  const totalMonths = work.reduce((total, job) => {
    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    if (!startDate) return total;
    const months = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return total + months;
  }, 0);
  const yearsOfExperience = Math.round(totalMonths / 12);

  // Extract highlights from work summary
  const highlights = work.flatMap((job) => job.highlights || []).slice(0, 3);

  return (
    <div className="h-full bg-white rounded-2xl shadow-md p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Candidate Resume
        </h2>
      </header>

      {/* Resume Content */}
      <div className="flex-1 overflow-y-auto space-y-4 text-sm mb-4">
        {/* Name & Headline */}
        <div>
          <div className="text-base font-semibold text-slate-900">
            {basics.name || 'Unnamed Candidate'}
          </div>
          {basics.label && (
            <div className="text-sm text-slate-600 mt-1">{basics.label}</div>
          )}
        </div>

        {/* Experience */}
        {yearsOfExperience > 0 && (
          <div>
            <span className="font-medium text-slate-900">Experience:</span>{' '}
            <span className="text-slate-700">{yearsOfExperience} years</span>
          </div>
        )}

        {/* Location */}
        {basics.location && (
          <div>
            <span className="font-medium text-slate-900">Location:</span>{' '}
            <span className="text-slate-700">
              {basics.location.city || ''}
              {basics.location.city && basics.location.region && ' • '}
              {basics.location.region || ''}
            </span>
          </div>
        )}

        {/* Email */}
        {basics.email && (
          <div>
            <span className="font-medium text-slate-900">Email:</span>{' '}
            <span className="text-slate-700 text-xs">{basics.email}</span>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <span className="font-medium text-slate-900 block mb-2">
              Key Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 12).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-slate-100 border border-slate-200 text-slate-700"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
              {skills.length > 12 && (
                <span className="px-2 py-1 text-xs text-slate-500">
                  +{skills.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        {(basics.url || basics.profiles?.length > 0) && (
          <div className="text-xs text-slate-600">
            {basics.url && (
              <a
                href={basics.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-900"
              >
                Website
              </a>
            )}
            {basics.url && basics.profiles?.length > 0 && <span> • </span>}
            {basics.profiles?.slice(0, 2).map((profile, idx) => (
              <span key={idx}>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-900"
                >
                  {profile.network}
                </a>
                {idx < Math.min(basics.profiles.length - 1, 1) && (
                  <span> • </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <div>
            <span className="font-medium text-slate-900 block mb-2">
              Highlights:
            </span>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              {highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Preferences Panel */}
      <div className="flex-shrink-0">
        <PreferencesPanel user={user} onChange={onPreferencesChange} />
      </div>
    </div>
  );
}
