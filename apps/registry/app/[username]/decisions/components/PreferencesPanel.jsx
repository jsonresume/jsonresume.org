/**
 * PreferencesPanel Component
 * User preferences for job evaluation criteria
 */

'use client';

import { useState } from 'react';
import { DEFAULT_CRITERIA } from './preferencesCriteria';
import { PreferencesCriterionRow } from './PreferencesCriterionRow';
import { usePreferences } from '../hooks/usePreferences';

export function PreferencesPanel({ user, onChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const { preferences, loading, handleToggle, handleValueChange } =
    usePreferences(user, onChange);

  if (!user) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-sm text-slate-600 text-center">
          Log in to customize evaluation criteria
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-sm text-slate-600 text-center">
          Loading preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <span className="font-semibold text-sm text-slate-900">
            Evaluation Preferences
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
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
      </button>

      {/* Criteria List */}
      {isOpen && (
        <div className="border-t border-slate-200">
          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            {DEFAULT_CRITERIA.map((criterion) => {
              const pref = preferences[criterion.id] || {
                enabled: true,
                value: criterion.defaultValue,
              };

              return (
                <PreferencesCriterionRow
                  key={criterion.id}
                  criterion={criterion}
                  pref={pref}
                  onToggle={handleToggle}
                  onValueChange={handleValueChange}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
