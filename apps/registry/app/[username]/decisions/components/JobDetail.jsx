/**
 * JobDetail Component
 * Expanded view of a selected job with AI summary and actions
 */

'use client';

import { useState } from 'react';
import { parseGptJob } from './jobDetailUtils';
import { MatchSummary } from './MatchSummary';
import {
  JobDescription,
  SkillSections,
  JobRequirements,
} from './JobDetailSections';

export function JobDetail({ job, matchResult, onBack, user, onDecision }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const gptJob = parseGptJob(job);

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
        <MatchSummary
          matchResult={matchResult}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <JobDescription job={job} />
        <SkillSections gptJob={gptJob} />
        <JobRequirements gptJob={gptJob} />
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
