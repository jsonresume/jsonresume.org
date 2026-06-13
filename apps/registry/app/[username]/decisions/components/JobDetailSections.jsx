/**
 * Presentational sections for JobDetail: description, skills and requirements.
 */

'use client';

import { getLocationString } from './jobDetailUtils';

export function JobDescription({ job }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Job Description
      </h3>
      <div className="prose prose-sm max-w-none text-slate-700">
        {job.description ? (
          <p className="whitespace-pre-wrap">{job.description}</p>
        ) : (
          <p className="text-slate-500 italic">No description available</p>
        )}
      </div>
    </section>
  );
}

function SkillPills({ skills, className }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className={className}>
          {typeof skill === 'string' ? skill : skill.name}
        </span>
      ))}
    </div>
  );
}

export function SkillSections({ gptJob }) {
  return (
    <>
      {gptJob.skills && gptJob.skills.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Required Skills
          </h3>
          <SkillPills
            skills={gptJob.skills}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
          />
        </section>
      )}

      {gptJob.bonusSkills && gptJob.bonusSkills.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Bonus Skills
          </h3>
          <SkillPills
            skills={gptJob.bonusSkills}
            className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200"
          />
        </section>
      )}
    </>
  );
}

export function JobRequirements({ gptJob }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Job Requirements
      </h3>
      <div className="space-y-3 text-sm">
        {/* Location & Remote */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="font-medium text-slate-900 mb-1">
            Location & Work Style
          </div>
          <div className="space-y-1 text-slate-700">
            <div>
              📍{' '}
              {gptJob.location
                ? getLocationString(gptJob.location)
                : 'Location not specified'}
            </div>
            <div>
              {gptJob.remote ? (
                <span className="text-green-700">✓ Remote work allowed</span>
              ) : (
                <span className="text-orange-700">✗ In-office required</span>
              )}
            </div>
            {gptJob.timezone && <div>🕐 Timezone: {gptJob.timezone}</div>}
          </div>
        </div>

        {/* Experience & Availability */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="font-medium text-slate-900 mb-1">
            Experience & Timeline
          </div>
          <div className="space-y-1 text-slate-700">
            {gptJob.minYearsExperience !== undefined && (
              <div>
                💼 {gptJob.minYearsExperience}+ years experience required
              </div>
            )}
            {gptJob.startWithinWeeks && (
              <div>📅 Must start within {gptJob.startWithinWeeks} weeks</div>
            )}
          </div>
        </div>

        {/* Compensation */}
        {gptJob.salary && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="font-medium text-slate-900 mb-1">Compensation</div>
            <div className="text-slate-700">
              💰 ${gptJob.salary.min?.toLocaleString()} - $
              {gptJob.salary.max?.toLocaleString()}
              {gptJob.salary.currency && ` ${gptJob.salary.currency}`}
            </div>
          </div>
        )}

        {/* Work Rights */}
        {gptJob.workRightsRequired !== undefined && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="font-medium text-slate-900 mb-1">
              Work Authorization
            </div>
            <div className="text-slate-700">
              {gptJob.workRightsRequired ? (
                <span className="text-orange-700">
                  ⚠️ Work authorization required
                </span>
              ) : (
                <span className="text-green-700">✓ Sponsorship available</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
