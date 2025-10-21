/**
 * PreferencesPanel Component
 * User preferences for job evaluation criteria
 */

'use client';

import { useState, useEffect } from 'react';

// Default criteria with their types and configurations
const DEFAULT_CRITERIA = [
  {
    id: 'salary',
    label: 'Salary Range',
    type: 'range',
    icon: '💰',
    defaultValue: { min: 80000, max: 200000 },
  },
  {
    id: 'location',
    label: 'Location Match',
    type: 'boolean',
    icon: '📍',
    defaultValue: {},
  },
  {
    id: 'remote',
    label: 'Remote Work',
    type: 'boolean',
    icon: '🏠',
    defaultValue: {},
  },
  {
    id: 'skills',
    label: 'Skills Match',
    type: 'boolean',
    icon: '⚡',
    defaultValue: {},
  },
  {
    id: 'experience',
    label: 'Years of Experience',
    type: 'number',
    icon: '📊',
    defaultValue: { min: 0, max: 20 },
  },
  {
    id: 'timezone',
    label: 'Timezone',
    type: 'boolean',
    icon: '🕐',
    defaultValue: {},
  },
];

export function PreferencesPanel({ user, onChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const response = await fetch(
          `/api/decisions/preferences?userId=${user.id}`
        );
        if (!response.ok) throw new Error('Failed to load preferences');

        const data = await response.json();

        // Convert array to object keyed by criterion
        const prefsMap = {};
        data.forEach((pref) => {
          prefsMap[pref.criterion] = {
            enabled: pref.enabled,
            value: pref.value,
          };
        });

        // Merge with defaults
        const merged = {};
        DEFAULT_CRITERIA.forEach((criterion) => {
          merged[criterion.id] = prefsMap[criterion.id] || {
            enabled: true,
            value: criterion.defaultValue,
          };
        });

        setPreferences(merged);
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Initialize with defaults on error
        const defaults = {};
        DEFAULT_CRITERIA.forEach((criterion) => {
          defaults[criterion.id] = {
            enabled: true,
            value: criterion.defaultValue,
          };
        });
        setPreferences(defaults);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preference to backend
  const savePreference = async (criterion, enabled, value) => {
    if (!user) return;

    try {
      const response = await fetch('/api/decisions/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          criterion,
          enabled,
          value,
        }),
      });

      if (!response.ok) throw new Error('Failed to save preference');

      // Notify parent component
      if (onChange) {
        onChange(criterion, enabled, value);
      }
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  // Toggle criterion enabled/disabled
  const handleToggle = async (criterionId) => {
    const current = preferences[criterionId];
    const newEnabled = !current.enabled;

    setPreferences((prev) => ({
      ...prev,
      [criterionId]: { ...current, enabled: newEnabled },
    }));

    await savePreference(criterionId, newEnabled, current.value);
  };

  // Update criterion value
  const handleValueChange = async (criterionId, newValue) => {
    const current = preferences[criterionId];

    setPreferences((prev) => ({
      ...prev,
      [criterionId]: { ...current, value: newValue },
    }));

    await savePreference(criterionId, current.enabled, newValue);
  };

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
                <div
                  key={criterion.id}
                  className={`p-3 rounded-lg border transition ${
                    pref.enabled
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Toggle Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{criterion.icon}</span>
                      <span
                        className={`text-sm font-medium ${
                          pref.enabled ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {criterion.label}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(criterion.id)}
                      className={`relative w-11 h-6 rounded-full transition ${
                        pref.enabled ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                          pref.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Value Controls */}
                  {pref.enabled && criterion.type === 'range' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span>
                          Min: ${(pref.value.min || 0).toLocaleString()}
                        </span>
                        <span>
                          Max: ${(pref.value.max || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <input
                          type="range"
                          min="0"
                          max="300000"
                          step="5000"
                          value={pref.value.min || 0}
                          onChange={(e) =>
                            handleValueChange(criterion.id, {
                              ...pref.value,
                              min: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <input
                          type="range"
                          min="0"
                          max="300000"
                          step="5000"
                          value={pref.value.max || 0}
                          onChange={(e) =>
                            handleValueChange(criterion.id, {
                              ...pref.value,
                              max: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {pref.enabled && criterion.type === 'number' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span>Min: {pref.value.min || 0} years</span>
                        <span>Max: {pref.value.max || 0} years</span>
                      </div>
                      <div className="space-y-1">
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          value={pref.value.min || 0}
                          onChange={(e) =>
                            handleValueChange(criterion.id, {
                              ...pref.value,
                              min: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          value={pref.value.max || 0}
                          onChange={(e) =>
                            handleValueChange(criterion.id, {
                              ...pref.value,
                              max: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
