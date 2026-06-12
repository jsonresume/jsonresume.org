import { describe, it, expect } from 'vitest';
import { dossierStatus, seedDossierFlags } from './dossierCache.js';

describe('dossierStatus', () => {
  it('returns null for unknown jobs', () => {
    expect(dossierStatus(new Map(), 'x')).toBeNull();
  });
  it('returns generating while loading', () => {
    const m = new Map([['1', { loading: true, done: false }]]);
    expect(dossierStatus(m, '1')).toBe('generating');
  });
  it('returns done when finished', () => {
    const m = new Map([['1', { loading: false, done: true }]]);
    expect(dossierStatus(m, '1')).toBe('done');
  });
  it('returns null for a started-but-not-loading-or-done entry', () => {
    const m = new Map([['1', { loading: false, done: false }]]);
    expect(dossierStatus(m, '1')).toBeNull();
  });
});

describe('seedDossierFlags', () => {
  it('adds done entries for jobs flagged has_dossier', () => {
    const m = new Map();
    const changed = seedDossierFlags(m, [
      { id: '1', has_dossier: true },
      { id: '2', has_dossier: false },
    ]);
    expect(changed).toBe(true);
    expect(m.get('1')).toEqual({ text: '', done: true, loading: false });
    expect(m.has('2')).toBe(false);
  });

  it('does not overwrite existing entries and reports no change', () => {
    const m = new Map([['1', { text: 'keep', done: true, loading: false }]]);
    const changed = seedDossierFlags(m, [{ id: '1', has_dossier: true }]);
    expect(changed).toBe(false);
    expect(m.get('1').text).toBe('keep');
  });
});
