import { describe, it, expect } from 'vitest';
import {
  isReservedUsername,
  isReservedSubRoute,
  getReservedUsernameError,
  RESERVED_ROUTES,
  RESERVED_SUB_ROUTES,
} from './reservedRoutes';

describe('reservedRoutes', () => {
  describe('isReservedUsername', () => {
    it('returns true for reserved top-level routes', () => {
      expect(isReservedUsername('api')).toBe(true);
      expect(isReservedUsername('auth')).toBe(true);
      expect(isReservedUsername('editor')).toBe(true);
      expect(isReservedUsername('explore')).toBe(true);
      expect(isReservedUsername('login')).toBe(true);
      expect(isReservedUsername('settings')).toBe(true);
    });

    it('returns false for non-reserved usernames', () => {
      expect(isReservedUsername('thomasdavis')).toBe(false);
      expect(isReservedUsername('john-doe')).toBe(false);
      expect(isReservedUsername('user123')).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(isReservedUsername('API')).toBe(true);
      expect(isReservedUsername('Editor')).toBe(true);
      expect(isReservedUsername('EXPLORE')).toBe(true);
    });

    it('handles whitespace', () => {
      expect(isReservedUsername(' api ')).toBe(true);
      expect(isReservedUsername(' editor  ')).toBe(true);
    });

    it('returns false for invalid inputs', () => {
      expect(isReservedUsername('')).toBe(false);
      expect(isReservedUsername(null)).toBe(false);
      expect(isReservedUsername(undefined)).toBe(false);
      expect(isReservedUsername(123)).toBe(false);
    });
  });

  describe('isReservedSubRoute', () => {
    it('returns true for reserved sub-routes', () => {
      expect(isReservedSubRoute('ats')).toBe(true);
      expect(isReservedSubRoute('decisions')).toBe(true);
      expect(isReservedSubRoute('interview')).toBe(true);
      expect(isReservedSubRoute('jobs')).toBe(true);
      expect(isReservedSubRoute('timeline')).toBe(true);
    });

    it('returns false for non-reserved paths', () => {
      expect(isReservedSubRoute('custom-page')).toBe(false);
      expect(isReservedSubRoute('my-route')).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(isReservedSubRoute('ATS')).toBe(true);
      expect(isReservedSubRoute('Interview')).toBe(true);
    });

    it('handles invalid inputs', () => {
      expect(isReservedSubRoute('')).toBe(false);
      expect(isReservedSubRoute(null)).toBe(false);
      expect(isReservedSubRoute(undefined)).toBe(false);
    });
  });

  describe('getReservedUsernameError', () => {
    it('returns a descriptive error message', () => {
      const error = getReservedUsernameError('api');
      expect(error).toContain('api');
      expect(error).toContain('reserved');
      expect(error.length).toBeGreaterThan(20);
    });
  });

  describe('RESERVED_ROUTES constant', () => {
    it('contains expected system routes', () => {
      expect(RESERVED_ROUTES).toContain('api');
      expect(RESERVED_ROUTES).toContain('auth');
      expect(RESERVED_ROUTES).toContain('editor');
      expect(RESERVED_ROUTES).toContain('explore');
      expect(RESERVED_ROUTES).toContain('login');
      expect(RESERVED_ROUTES).toContain('settings');
      expect(RESERVED_ROUTES).toContain('privacy');
      expect(RESERVED_ROUTES).toContain('signup');
    });

    it('is an array', () => {
      expect(Array.isArray(RESERVED_ROUTES)).toBe(true);
    });
  });

  describe('RESERVED_SUB_ROUTES constant', () => {
    it('contains expected user sub-routes', () => {
      expect(RESERVED_SUB_ROUTES).toContain('ats');
      expect(RESERVED_SUB_ROUTES).toContain('decisions');
      expect(RESERVED_SUB_ROUTES).toContain('interview');
      expect(RESERVED_SUB_ROUTES).toContain('jobs');
      expect(RESERVED_SUB_ROUTES).toContain('timeline');
      expect(RESERVED_SUB_ROUTES).toContain('json');
    });

    it('is an array', () => {
      expect(Array.isArray(RESERVED_SUB_ROUTES)).toBe(true);
    });
  });

  describe('Real-world collision scenarios', () => {
    it('would catch username "jobs" collision', () => {
      // If a user has GitHub username "jobs"
      expect(isReservedUsername('jobs')).toBe(false); // Not a top-level route
      // But "jobs" IS a reserved sub-route under /[username]/jobs
      expect(isReservedSubRoute('jobs')).toBe(true);
    });

    it('would catch username "api" collision', () => {
      // If a user has GitHub username "api"
      expect(isReservedUsername('api')).toBe(true); // Blocked!
    });

    it('would catch username "editor" collision', () => {
      expect(isReservedUsername('editor')).toBe(true); // Blocked!
    });

    it('allows normal GitHub usernames', () => {
      expect(isReservedUsername('levino')).toBe(false); // Original issue reporter
      expect(isReservedUsername('thomasdavis')).toBe(false);
      expect(isReservedUsername('john-doe-123')).toBe(false);
    });
  });
});
