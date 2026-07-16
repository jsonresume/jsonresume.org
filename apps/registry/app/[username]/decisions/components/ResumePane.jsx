/**
 * ResumePane Component
 * Left pane - displays candidate resume
 *
 * The resume-section presentational pieces live in ./ResumeSections and the
 * date/experience helpers in ./resumeUtils, keeping this shell focused on
 * layout + composition.
 */

'use client';

import { PreferencesPanel } from './PreferencesPanel';
import { calcYearsOfExperience } from './resumeUtils';
import { ResumeIdentity, ResumeSkills, ResumeWork } from './ResumeSections';
import {
  ResumeEducation,
  ResumeLanguages,
  ResumeCertificates,
  ResumeLinks,
} from './ResumeSectionsExtra';

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

  const yearsOfExperience = calcYearsOfExperience(work);

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
        <ResumeIdentity basics={basics} yearsOfExperience={yearsOfExperience} />
        <ResumeSkills skills={skills} />
        <ResumeWork work={work} />
        <ResumeEducation education={education} />
        <ResumeLanguages languages={languages} />
        <ResumeCertificates certificates={certificates} />
        <ResumeLinks basics={basics} />
      </div>

      {/* Preferences Panel */}
      <div className="flex-shrink-0">
        <PreferencesPanel user={user} onChange={onPreferencesChange} />
      </div>
    </div>
  );
}
