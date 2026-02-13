'use client';

import {
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { usePathways } from '../context/PathwaysContext';
import useMatchInsights from '../hooks/useMatchInsights';

export default function WhyMatch({ job, compact = false }) {
  const { resume, userId, sessionId } = usePathways();
  const effectiveUserId = userId || sessionId;

  const {
    insights,
    isLoading,
    error,
    isExpanded,
    generateInsights,
    toggleExpanded,
  } = useMatchInsights({ job, resume, effectiveUserId });

  if (!job) return null;

  if (compact && !insights && !isLoading) {
    return (
      <button
        onClick={() => generateInsights()}
        disabled={isLoading || !resume}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        Why me?
      </button>
    );
  }

  return (
    <div className="border border-indigo-100 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
      {/* Header */}
      <button
        onClick={toggleExpanded}
        disabled={isLoading || !resume}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {insights ? 'Why You Match' : 'Why might I be a good fit?'}
            </h3>
            {insights && (
              <p className="text-sm text-gray-500">
                {insights.matchScore}% match &bull;{' '}
                {insights.cached ? 'Cached' : 'Just generated'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {insights && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                generateInsights(true);
              }}
              disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh insights"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          )}
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          ) : insights ? (
            isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )
          ) : (
            <span className="text-sm font-medium text-indigo-600">
              {!resume ? 'Need resume' : 'Analyze'}
            </span>
          )}
        </div>
      </button>

      {/* Loading state */}
      {isLoading && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">
              Analyzing your resume against this role...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 pb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {insights && isExpanded && !isLoading && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-700 italic">
            &quot;{insights.summary}&quot;
          </p>
          <div className="space-y-3">
            {insights.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-xl flex-shrink-0">{bullet.emoji}</span>
                <div>
                  <span className="font-medium text-gray-900">
                    {bullet.title}
                  </span>
                  <span className="text-gray-600">
                    {' '}
                    &mdash; {bullet.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
