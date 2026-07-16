import { describe, it, expect } from 'vitest';
import {
  applyStateChange,
  applyStateChanges,
  jobIdsInState,
} from './stateHelpers';

describe('applyStateChange', () => {
  it('sets a state under a string key', () => {
    expect(applyStateChange({}, 5, 'read')).toEqual({ 5: 'read' });
    expect(Object.keys(applyStateChange({}, 5, 'read'))).toEqual(['5']);
  });

  it('deletes a state when passed null', () => {
    expect(applyStateChange({ 5: 'read' }, 5, null)).toEqual({});
  });

  it('does not mutate the input', () => {
    const input = { 1: 'read' };
    applyStateChange(input, 2, 'interested');
    expect(input).toEqual({ 1: 'read' });
  });
});

describe('applyStateChanges', () => {
  it('applies a batch of sets and deletes', () => {
    const result = applyStateChanges({ 1: 'read', 2: 'read' }, [
      { jobId: 2, state: null },
      { jobId: 3, state: 'interested' },
    ]);
    expect(result).toEqual({ 1: 'read', 3: 'interested' });
  });

  it('does not mutate the input', () => {
    const input = { 1: 'read' };
    applyStateChanges(input, [{ jobId: 2, state: 'hidden' }]);
    expect(input).toEqual({ 1: 'read' });
  });
});

describe('jobIdsInState', () => {
  it('returns the set of ids in the target state', () => {
    const states = { 1: 'read', 2: 'read', 3: 'interested' };
    expect(jobIdsInState(states, 'read')).toEqual(new Set(['1', '2']));
    expect(jobIdsInState(states, 'interested')).toEqual(new Set(['3']));
    expect(jobIdsInState(states, 'hidden')).toEqual(new Set());
  });
});
