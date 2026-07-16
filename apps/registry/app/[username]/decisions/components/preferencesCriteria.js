/**
 * Default job-evaluation criteria and preference-map helpers for the
 * PreferencesPanel.
 */

// Default criteria with their types and configurations
export const DEFAULT_CRITERIA = [
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

/** Build a preferences map with every criterion enabled at its default value. */
export function buildDefaultPreferences() {
  const defaults = {};
  DEFAULT_CRITERIA.forEach((criterion) => {
    defaults[criterion.id] = {
      enabled: true,
      value: criterion.defaultValue,
    };
  });
  return defaults;
}

/**
 * Merge a saved-preferences map (keyed by criterion id) with the defaults so
 * every criterion is always present.
 */
export function mergeWithDefaults(prefsMap) {
  const merged = {};
  DEFAULT_CRITERIA.forEach((criterion) => {
    merged[criterion.id] = prefsMap[criterion.id] || {
      enabled: true,
      value: criterion.defaultValue,
    };
  });
  return merged;
}
