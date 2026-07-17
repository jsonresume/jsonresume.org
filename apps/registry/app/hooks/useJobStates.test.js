import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useJobStates } from './useJobStates';

// Mock the activity logger so the convenience methods don't hit the network
vi.mock('../pathways/utils/activityLogger', () => ({
  activityLogger: {
    jobRead: vi.fn(),
    jobInterested: vi.fn(),
    jobHidden: vi.fn(),
  },
}));

import { activityLogger } from '../pathways/utils/activityLogger';

// Mock global fetch
global.fetch = vi.fn();

const STORAGE_KEY_PREFIX = 'pathways_job_states';
const keyFor = (sessionId) => `${STORAGE_KEY_PREFIX}_${sessionId}`;

// Silence expected console.error noise from the hook's catch blocks
let consoleErrorSpy;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ states: {} }),
  });
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

const anonProps = {
  sessionId: 'sess-1',
  username: null,
  userId: null,
  isAuthenticated: false,
};

const authProps = {
  sessionId: 'sess-1',
  username: 'alice',
  userId: 'user-uuid-1',
  isAuthenticated: true,
};

describe('useJobStates — loading', () => {
  it('loads empty state for anonymous user with no localStorage', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.jobStates).toEqual({});
    expect(result.current.error).toBe(null);
    // Anonymous load must not hit the network
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('loads existing states from localStorage for anonymous user', async () => {
    localStorage.setItem(
      keyFor('sess-1'),
      JSON.stringify({ 100: 'read', 200: 'interested' })
    );

    const { result } = renderHook(() => useJobStates(anonProps));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.jobStates).toEqual({
      100: 'read',
      200: 'interested',
    });
  });

  it('loads states from the API for authenticated user', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ states: { 5: 'hidden' } }),
    });

    const { result } = renderHook(() => useJobStates(authProps));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/job-states?userId=user-uuid-1'
    );
    expect(result.current.jobStates).toEqual({ 5: 'hidden' });
  });

  it('falls back to localStorage and sets error when the API load fails', async () => {
    localStorage.setItem(keyFor('sess-1'), JSON.stringify({ 9: 'read' }));
    global.fetch.mockResolvedValueOnce({ ok: false });

    const { result } = renderHook(() => useJobStates(authProps));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch job states');
    expect(result.current.jobStates).toEqual({ 9: 'read' });
  });
});

describe('useJobStates — updateJobState', () => {
  it('optimistically sets a job state and persists to localStorage (anonymous)', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateJobState(42, 'interested');
    });

    expect(result.current.jobStates).toEqual({ 42: 'interested' });
    expect(JSON.parse(localStorage.getItem(keyFor('sess-1')))).toEqual({
      42: 'interested',
    });
    // Anonymous updates never POST
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('coerces numeric job ids to strings as keys', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateJobState(7, 'read');
    });

    expect(Object.keys(result.current.jobStates)).toEqual(['7']);
  });

  it('removes a job state when passed null', async () => {
    localStorage.setItem(keyFor('sess-1'), JSON.stringify({ 3: 'read' }));
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateJobState(3, null);
    });

    expect(result.current.jobStates).toEqual({});
    expect(JSON.parse(localStorage.getItem(keyFor('sess-1')))).toEqual({});
  });

  it('POSTs to /api/job-states for authenticated users', async () => {
    const { result } = renderHook(() => useJobStates(authProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    global.fetch.mockClear();

    await act(async () => {
      await result.current.updateJobState(11, 'read');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/job-states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-uuid-1',
        jobId: '11',
        state: 'read',
      }),
    });
  });
});

describe('useJobStates — updateJobStates (batch)', () => {
  it('applies multiple updates and persists to localStorage (anonymous)', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateJobStates([
        { jobId: 1, state: 'read' },
        { jobId: 2, state: 'interested' },
      ]);
    });

    expect(result.current.jobStates).toEqual({ 1: 'read', 2: 'interested' });
    expect(JSON.parse(localStorage.getItem(keyFor('sess-1')))).toEqual({
      1: 'read',
      2: 'interested',
    });
  });

  it('deletes states in a batch when state is null', async () => {
    localStorage.setItem(
      keyFor('sess-1'),
      JSON.stringify({ 1: 'read', 2: 'read' })
    );
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateJobStates([{ jobId: 1, state: null }]);
    });

    expect(result.current.jobStates).toEqual({ 2: 'read' });
  });

  it('POSTs a batch to /api/job-states/batch for authenticated users', async () => {
    const { result } = renderHook(() => useJobStates(authProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    global.fetch.mockClear();

    const updates = [{ jobId: 1, state: 'read' }];
    await act(async () => {
      await result.current.updateJobStates(updates);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/job-states/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-uuid-1', updates }),
    });
  });
});

describe('useJobStates — convenience methods', () => {
  it('markAsRead sets read state and logs activity', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.markAsRead(1, 'Engineer');
    });

    expect(result.current.jobStates).toEqual({ 1: 'read' });
    expect(activityLogger.jobRead).toHaveBeenCalledWith(1, 'Engineer');
  });

  it('markAsInterested sets interested state and logs activity', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.markAsInterested(2, 'Designer');
    });

    expect(result.current.jobStates).toEqual({ 2: 'interested' });
    expect(activityLogger.jobInterested).toHaveBeenCalledWith(2, 'Designer');
  });

  it('markAsHidden sets hidden state and logs activity', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.markAsHidden(3, 'PM');
    });

    expect(result.current.jobStates).toEqual({ 3: 'hidden' });
    expect(activityLogger.jobHidden).toHaveBeenCalledWith(3, 'PM');
  });

  it('unmarkJob and clearJobState both remove state', async () => {
    localStorage.setItem(
      keyFor('sess-1'),
      JSON.stringify({ 1: 'read', 2: 'read' })
    );
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.clearJobState).toBe(result.current.unmarkJob);

    await act(async () => {
      result.current.unmarkJob(1);
    });
    await act(async () => {
      result.current.clearJobState(2);
    });

    expect(result.current.jobStates).toEqual({});
  });
});

describe('useJobStates — queries and id sets', () => {
  it('getJobState / isRead / isInterested / isHidden reflect state', async () => {
    localStorage.setItem(
      keyFor('sess-1'),
      JSON.stringify({ 1: 'read', 2: 'interested', 3: 'hidden' })
    );
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getJobState(1)).toBe('read');
    expect(result.current.getJobState(999)).toBe(null);
    expect(result.current.isRead(1)).toBe(true);
    expect(result.current.isInterested(2)).toBe(true);
    expect(result.current.isHidden(3)).toBe(true);
    expect(result.current.isRead(2)).toBe(false);
  });

  it('exposes read/interested/hidden id sets for filtering', async () => {
    localStorage.setItem(
      keyFor('sess-1'),
      JSON.stringify({ 1: 'read', 2: 'read', 3: 'interested', 4: 'hidden' })
    );
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.readJobIds).toEqual(new Set(['1', '2']));
    expect(result.current.interestedJobIds).toEqual(new Set(['3']));
    expect(result.current.hiddenJobIds).toEqual(new Set(['4']));
  });
});

describe('useJobStates — migrateToUser', () => {
  it('returns error when there is no session id', async () => {
    const { result } = renderHook(() =>
      useJobStates({ ...anonProps, sessionId: null })
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let outcome;
    await act(async () => {
      outcome = await result.current.migrateToUser('new-user');
    });
    expect(outcome).toEqual({ success: false, error: 'No session ID' });
  });

  it('POSTs migration and clears localStorage on success', async () => {
    localStorage.setItem(keyFor('sess-1'), JSON.stringify({ 1: 'read' }));
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    global.fetch.mockResolvedValueOnce({ ok: true });

    let outcome;
    await act(async () => {
      outcome = await result.current.migrateToUser('new-user');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/job-states/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'sess-1', userId: 'new-user' }),
    });
    expect(outcome).toEqual({ success: true });
    expect(localStorage.getItem(keyFor('sess-1'))).toBe(null);
  });

  it('returns failure and keeps localStorage when migration fails', async () => {
    localStorage.setItem(keyFor('sess-1'), JSON.stringify({ 1: 'read' }));
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    global.fetch.mockResolvedValueOnce({ ok: false });

    let outcome;
    await act(async () => {
      outcome = await result.current.migrateToUser('new-user');
    });

    expect(outcome.success).toBe(false);
    expect(outcome.error).toBe('Migration failed');
    expect(localStorage.getItem(keyFor('sess-1'))).not.toBe(null);
  });
});

describe('useJobStates — public shape', () => {
  it('exposes the full documented interface', async () => {
    const { result } = renderHook(() => useJobStates(anonProps));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const keys = Object.keys(result.current).sort();
    expect(keys).toEqual(
      [
        'jobStates',
        'isLoading',
        'error',
        'updateJobState',
        'updateJobStates',
        'markAsRead',
        'markAsInterested',
        'markAsHidden',
        'unmarkJob',
        'clearJobState',
        'getJobState',
        'isRead',
        'isInterested',
        'isHidden',
        'readJobIds',
        'interestedJobIds',
        'hiddenJobIds',
        'migrateToUser',
      ].sort()
    );
  });
});
