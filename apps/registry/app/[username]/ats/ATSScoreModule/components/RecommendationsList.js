'use client';

import React from 'react';

/**
 * Get severity badge color
 */
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get severity icon
 */
const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Display individual recommendation
 */
const RecommendationCard = ({ recommendation }) => {
  const severityColor = getSeverityColor(recommendation.severity);
  const severityIcon = getSeverityIcon(recommendation.severity);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded ${severityColor}`}>{severityIcon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border ${severityColor}`}
            >
              {recommendation.severity?.toUpperCase() || 'INFO'}
            </span>
            {recommendation.category && (
              <span className="text-xs text-gray-500">
                {recommendation.category}
              </span>
            )}
          </div>
          <p className="text-gray-800 mb-2">{recommendation.message}</p>
          {recommendation.fix && (
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mt-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">
                How to fix:
              </div>
              <div className="text-sm text-gray-700">{recommendation.fix}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Display list of all recommendations grouped by severity
 */
export const RecommendationsList = ({ recommendations }) => {
  // Group recommendations by severity
  const grouped = recommendations.reduce((acc, rec) => {
    const severity = rec.severity || 'info';
    if (!acc[severity]) acc[severity] = [];
    acc[severity].push(rec);
    return acc;
  }, {});

  const severityOrder = ['critical', 'warning', 'info'];
  const sortedSeverities = severityOrder.filter((s) => grouped[s]?.length > 0);

  return (
    <div className="space-y-6">
      {sortedSeverities.map((severity) => (
        <div key={severity}>
          <h3 className="text-lg font-semibold mb-3 capitalize">
            {severity} ({grouped[severity].length})
          </h3>
          <div className="space-y-3">
            {grouped[severity].map((rec, idx) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      ))}

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Great! No recommendations. Your resume is well-optimized for ATS.
        </div>
      )}
    </div>
  );
};
