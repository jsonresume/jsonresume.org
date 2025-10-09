'use client';

import React from 'react';

/**
 * Get icon for check status
 */
const getCheckIcon = (passed) => {
  return passed ? (
    <svg
      className="w-6 h-6 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
    <svg
      className="w-6 h-6 text-yellow-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
};

/**
 * Display individual check card
 */
const CheckCard = ({ check }) => {
  const percentage = Math.round((check.score / check.maxScore) * 100);
  const hasIssues = check.issues && check.issues.length > 0;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getCheckIcon(check.passed)}
          <h3 className="font-semibold text-lg">{check.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {check.score}/{check.maxScore}
          </div>
          <div
            className={`text-sm font-semibold ${
              check.passed ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full ${
            check.passed ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Issues list */}
      {hasIssues && (
        <div className="mt-3 space-y-2">
          {check.issues.slice(0, 3).map((issue, idx) => (
            <div
              key={idx}
              className="text-sm text-gray-700 flex items-start gap-2"
            >
              <span className="text-gray-400 mt-1">•</span>
              <span>{issue.message || issue}</span>
            </div>
          ))}
          {check.issues.length > 3 && (
            <div className="text-sm text-gray-500 italic">
              +{check.issues.length - 3} more issues
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Display list of all checks
 */
export const ChecksList = ({ checks }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {checks.map((check, index) => (
        <CheckCard key={index} check={check} />
      ))}
    </div>
  );
};
