/**
 * Secondary presentational sections for ResumePane: education, languages,
 * certificates and links. Split from ./ResumeSections to keep each file under
 * the 200-line policy.
 */

'use client';

import { formatDate } from './resumeUtils';

export function ResumeEducation({ education }) {
  if (education.length === 0) return null;
  return (
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
  );
}

export function ResumeLanguages({ languages }) {
  if (languages.length === 0) return null;
  return (
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
  );
}

export function ResumeCertificates({ certificates }) {
  if (certificates.length === 0) return null;
  return (
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
              <span className="text-slate-500"> ({formatDate(cert.date)})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResumeLinks({ basics }) {
  if (!(basics.url || basics.profiles?.length > 0)) return null;
  return (
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
  );
}
