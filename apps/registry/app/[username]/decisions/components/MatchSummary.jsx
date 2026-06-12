/**
 * MatchSummary
 * AI match analysis section of the job detail: an animated loading state and a
 * collapsible result state.
 */

'use client';

import { colors } from '../config/designSystem';
import { LoadingSummary } from './MatchSummaryLoading';

function outcomeColor(outcome, key) {
  if (outcome === 'strongMatch') return colors.outcomes.strongMatch[key];
  if (outcome === 'possibleMatch') return colors.outcomes.possibleMatch[key];
  return colors.outcomes.noMatch[key];
}

function ResultSummary({ matchResult, isExpanded, setIsExpanded }) {
  const shownReasons = isExpanded
    ? matchResult.reasons
    : matchResult.reasons.slice(0, 2);

  return (
    <div
      className="p-4 rounded-lg border-2"
      style={{
        backgroundColor: outcomeColor(matchResult.outcome, 'bg'),
        borderColor: outcomeColor(matchResult.outcome, 'border'),
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
        {shownReasons.map(([criterion, reasoning], idx) => (
          <div key={idx} className="text-sm">
            <span className="font-medium text-slate-900">{criterion}:</span>{' '}
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
  );
}

export function MatchSummary({ matchResult, isExpanded, setIsExpanded }) {
  if (!matchResult) return null;
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        AI Match Analysis
      </h3>
      {matchResult.outcome === 'loading' ? (
        <LoadingSummary matchResult={matchResult} />
      ) : (
        <ResultSummary
          matchResult={matchResult}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      )}
    </section>
  );
}
