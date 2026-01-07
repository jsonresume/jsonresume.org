import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSessionId,
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from './sessionUtils';

// Mock localStorage
const mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockStorage[key];
  }),
  key: vi.fn((index) => Object.keys(mockStorage)[index] || null),
  get length() {
    return Object.keys(mockStorage).length;
  },
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  }),
};

// Mock crypto.randomUUID
const mockUUID = 'test-uuid-1234-5678-90ab-cdef';
vi.stubGlobal('crypto', { randomUUID: vi.fn(() => mockUUID) });

describe('sessionUtils', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', mockLocalStorage);
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('getSessionId', () => {
    it('returns null when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      const result = getSessionId();
      expect(result).toBeNull();
    });

    it('returns existing session ID from localStorage', () => {
      vi.stubGlobal('window', {});
      mockStorage['pathways_session_id'] = 'existing-session-id';

      const result = getSessionId();

      expect(result).toBe('existing-session-id');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'pathways_session_id'
      );
    });

    it('creates new session ID if none exists', () => {
      vi.stubGlobal('window', {});

      const result = getSessionId();

      expect(result).toBe(mockUUID);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pathways_session_id',
        mockUUID
      );
    });
  });

  describe('clearSessionId', () => {
    it('does nothing when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      clearSessionId();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it('removes session ID from localStorage', () => {
      vi.stubGlobal('window', {});
      clearSessionId();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'pathways_session_id'
      );
    });
  });

  describe('getLocalJobStates', () => {
    it('returns empty object when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      const result = getLocalJobStates();
      expect(result).toEqual({});
    });

    it('returns empty object when no job states exist', () => {
      vi.stubGlobal('window', {});
      const result = getLocalJobStates();
      expect(result).toEqual({});
    });

    it('extracts job states from localStorage', () => {
      vi.stubGlobal('window', {});
      mockStorage['pathways_job_123'] = 'applied';
      mockStorage['pathways_job_456'] = 'saved';
      mockStorage['other_key'] = 'ignored';

      const result = getLocalJobStates();

      expect(result).toEqual({
        123: 'applied',
        456: 'saved',
      });
    });
  });

  describe('clearLocalJobStates', () => {
    it('does nothing when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      clearLocalJobStates({ 123: 'applied' });
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it('removes specified job states from localStorage', () => {
      vi.stubGlobal('window', {});
      const states = { 123: 'applied', 456: 'saved' };

      clearLocalJobStates(states);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'pathways_job_123'
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'pathways_job_456'
      );
    });

    it('handles empty states object', () => {
      vi.stubGlobal('window', {});
      clearLocalJobStates({});
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});
