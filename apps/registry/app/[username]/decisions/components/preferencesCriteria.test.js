import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CRITERIA,
  buildDefaultPreferences,
  mergeWithDefaults,
} from './preferencesCriteria';

describe('DEFAULT_CRITERIA', () => {
  it('defines every criterion with an id, label, type, and default value', () => {
    expect(DEFAULT_CRITERIA.length).toBeGreaterThan(0);
    for (const c of DEFAULT_CRITERIA) {
      expect(c.id).toBeTruthy();
      expect(c.label).toBeTruthy();
      expect(['range', 'number', 'boolean']).toContain(c.type);
      expect(c.defaultValue).toBeDefined();
    }
  });

  it('has unique criterion ids', () => {
    const ids = DEFAULT_CRITERIA.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('buildDefaultPreferences', () => {
  it('enables every criterion at its default value', () => {
    const prefs = buildDefaultPreferences();
    expect(Object.keys(prefs)).toEqual(DEFAULT_CRITERIA.map((c) => c.id));
    for (const c of DEFAULT_CRITERIA) {
      expect(prefs[c.id]).toEqual({ enabled: true, value: c.defaultValue });
    }
  });
});

describe('mergeWithDefaults', () => {
  it('keeps saved preferences and fills gaps with defaults', () => {
    const saved = { salary: { enabled: false, value: { min: 1, max: 2 } } };
    const merged = mergeWithDefaults(saved);
    expect(merged.salary).toEqual({ enabled: false, value: { min: 1, max: 2 } });
    // Every criterion is present after merge
    expect(Object.keys(merged)).toEqual(DEFAULT_CRITERIA.map((c) => c.id));
    // A criterion not in `saved` falls back to its enabled default
    const other = DEFAULT_CRITERIA.find((c) => c.id !== 'salary');
    expect(merged[other.id]).toEqual({
      enabled: true,
      value: other.defaultValue,
    });
  });

  it('returns a full default map when given an empty object', () => {
    expect(mergeWithDefaults({})).toEqual(buildDefaultPreferences());
  });
});
