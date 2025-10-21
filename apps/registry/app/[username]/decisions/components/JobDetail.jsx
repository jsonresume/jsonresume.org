/**
 * JobDetail Component
 * Expanded view of a selected job with AI summary and actions
 */

'use client';

import { useState } from 'react';
import { colors } from '../config/designSystem';

// Helper function to safely extract location string
function getLocationString(location) {
  if (!location) return 'Location TBD';
  if (typeof location === 'string') return location;
  // Handle location object
  const parts = [location.city, location.region, location.country]
    .filter(Boolean)
    .join(', ');
  return parts || 'Location TBD';
}

export function JobDetail({ job, matchResult, onBack, user, onDecision }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};

  // Handle Pass or Interested decision
  const handleDecision = async (decision) => {
    if (!user) {
      alert('Please log in to save job decisions');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/decisions/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          jobId: job.id,
          decision,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save decision');
      }

      // Call onDecision callback to refetch jobs
      if (onDecision) {
        await onDecision();
      }
    } catch (error) {
      console.error('Error saving decision:', error);
      alert('Failed to save decision. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with back button */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          aria-label="Back to jobs list"
        >
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {gptJob.title || job.title}
          </h2>
          <p className="text-sm text-slate-600">
            {gptJob.company || job.company}
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
        {/* AI Match Summary */}
        {matchResult && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              AI Match Analysis
            </h3>
            {matchResult.outcome === 'loading' ? (
              // Loading state with animations
              <div className="relative p-6 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                {/* Animated background gradient */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      'linear-gradient(45deg, transparent 25%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.1) 75%)',
                    backgroundSize: '30px 30px',
                    animation: 'slide 2s linear infinite',
                  }}
                />

                {/* Content */}
                <div className="relative">
                  {/* Spinning loader icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full"
                      style={{
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <div className="font-semibold text-lg text-slate-900">
                      {matchResult.bucket}
                    </div>
                  </div>

                  {/* Loading steps with pulsing dots */}
                  <div className="space-y-3">
                    {matchResult.reasons.map(([criterion, reasoning], idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm"
                        style={{
                          animation: `fadeIn 0.5s ease-in-out ${
                            idx * 0.1
                          }s both`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"
                          style={{
                            animation: 'pulse 1.5s ease-in-out infinite',
                            animationDelay: `${idx * 0.2}s`,
                          }}
                        />
                        <div className="flex-1">
                          <span className="font-medium text-slate-900">
                            {criterion}
                          </span>
                          <div className="text-slate-600 mt-0.5">
                            {reasoning}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{
                        animation: 'progress 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                </div>

                {/* CSS animations */}
                <style jsx>{`
                  @keyframes spin {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                  @keyframes pulse {
                    0%,
                    100% {
                      opacity: 1;
                      transform: scale(1);
                    }
                    50% {
                      opacity: 0.5;
                      transform: scale(1.3);
                    }
                  }
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  @keyframes slide {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(30px);
                    }
                  }
                  @keyframes progress {
                    0% {
                      width: 0%;
                      opacity: 0.6;
                    }
                    50% {
                      width: 70%;
                      opacity: 1;
                    }
                    100% {
                      width: 100%;
                      opacity: 0.6;
                    }
                  }
                `}</style>
              </div>
            ) : (
              // Normal result state - collapsible
              <div
                className="p-4 rounded-lg border-2"
                style={{
                  backgroundColor:
                    matchResult.outcome === 'strongMatch'
                      ? colors.outcomes.strongMatch.bg
                      : matchResult.outcome === 'possibleMatch'
                      ? colors.outcomes.possibleMatch.bg
                      : colors.outcomes.noMatch.bg,
                  borderColor:
                    matchResult.outcome === 'strongMatch'
                      ? colors.outcomes.strongMatch.border
                      : matchResult.outcome === 'possibleMatch'
                      ? colors.outcomes.possibleMatch.border
                      : colors.outcomes.noMatch.border,
                }}
              >
                <div className="font-semibold text-slate-900 mb-2">
                  {matchResult.bucket}
                  {matchResult.score !== undefined && (
                    <span className="ml-2 text-sm font-mono">
                      ({Math.round(matchResult.score)}% match)
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {(isExpanded
                    ? matchResult.reasons
                    : matchResult.reasons.slice(0, 2)
                  ).map(([criterion, reasoning], idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-slate-900">
                        {criterion}:
                      </span>{' '}
                      <span className="text-slate-700">{reasoning}</span>
                    </div>
                  ))}
                </div>
                {matchResult.reasons.length > 2 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 w-full text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Show Less
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show All {matchResult.reasons.length} Criteria
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Job Description */}
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

        {/* Required Skills */}
        {gptJob.skills && gptJob.skills.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {gptJob.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Bonus Skills */}
        {gptJob.bonusSkills && gptJob.bonusSkills.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Bonus Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {gptJob.bonusSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full border border-slate-200"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Job Requirements */}
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
                    <span className="text-green-700">
                      ✓ Remote work allowed
                    </span>
                  ) : (
                    <span className="text-orange-700">
                      ✗ In-office required
                    </span>
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
                  <div>
                    📅 Must start within {gptJob.startWithinWeeks} weeks
                  </div>
                )}
              </div>
            </div>

            {/* Compensation */}
            {gptJob.salary && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-slate-900 mb-1">
                  Compensation
                </div>
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
                    <span className="text-green-700">
                      ✓ Sponsorship available
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Action Buttons (Fixed at bottom) */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            onClick={() => handleDecision('pass')}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Pass'}
          </button>
          <button
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            onClick={() => handleDecision('interested')}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Interested'}
          </button>
        </div>
        <button
          className="w-full mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          onClick={() => window.open(job.url, '_blank')}
        >
          View Full Job Posting
        </button>
      </div>
    </div>
  );
}
