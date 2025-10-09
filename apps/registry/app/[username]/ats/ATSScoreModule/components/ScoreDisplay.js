'use client';

import React from 'react';

/**
 * Get color class based on score
 */
const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get background color class based on score
 */
const getScoreBgColor = (score) => {
  if (score >= 90) return 'bg-green-100';
  if (score >= 75) return 'bg-blue-100';
  if (score >= 60) return 'bg-yellow-100';
  if (score >= 40) return 'bg-orange-100';
  return 'bg-red-100';
};

/**
 * Display ATS score with visual indicator
 */
export const ScoreDisplay = ({ score, rating, summary }) => {
  const scoreColor = getScoreColor(score);
  const scoreBgColor = getScoreBgColor(score);
  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-lg p-6 ${scoreBgColor}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className={`text-5xl font-bold mb-2 ${scoreColor}`}>
            {score}/100
          </div>
          <div className="text-2xl font-semibold mb-2">{rating}</div>
          <p className="text-gray-700">{summary}</p>
        </div>

        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-300"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={scoreColor}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
