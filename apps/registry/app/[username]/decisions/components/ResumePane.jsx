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
  const education = resume.education || [];
  const languages = resume.languages || [];
  const certificates = resume.certificates || [];

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

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

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

        {/* Skills */}
        {skills.length > 0 && (
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
        )}

        {/* Work Experience */}
        {work.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span>💼</span>
              <span>Work Experience</span>
            </div>
            <div className="space-y-3">
              {work.slice(0, 3).map((job, idx) => (
                <div key={idx} className="border-l-2 border-slate-200 pl-3">
                  <div className="font-medium text-slate-900">
                    {job.position}
                  </div>
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
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>🎓</span>
              <span>Education</span>
            </div>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="font-medium text-slate-900 text-sm">
                    {edu.studyType} {edu.area && `in ${edu.area}`}
                  </div>
                  <div className="text-xs text-slate-600">
                    {edu.institution}
                    {edu.endDate && (
                      <span className="text-slate-400">
                        {' • '}
                        {formatDate(edu.endDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>🌍</span>
              <span>Languages</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span key={idx} className="text-xs text-slate-700">
                  {lang.language}
                  {lang.fluency && (
                    <span className="text-slate-500"> ({lang.fluency})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>📜</span>
              <span>Certifications</span>
            </div>
            <div className="space-y-1">
              {certificates.map((cert, idx) => (
                <div key={idx} className="text-xs text-slate-700">
                  {cert.name}
                  {cert.date && (
                    <span className="text-slate-500">
                      {' '}
                      ({formatDate(cert.date)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(basics.url || basics.profiles?.length > 0) && (
          <div className="pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span>🔗</span>
              <span>Links</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {basics.url && (
                <a
                  href={basics.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Website
                </a>
              )}
              {basics.profiles?.map((profile, idx) => (
                <a
                  key={idx}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  {profile.network}
                </a>
              ))}
            </div>
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
