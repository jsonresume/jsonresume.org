import { describe, it, expect } from 'vitest';
import {
  FetchError,
  UpdateError,
  EmbeddingError,
  ChatError,
  ResumeNotFoundError,
  JobDataError,
  isPathwaysError,
  getErrorMessage,
} from '../../errors';

describe('Pathways Errors', () => {
  describe('FetchError', () => {
    it('should create error with message and url', () => {
      const error = new FetchError({
        message: 'Network error',
        url: '/api/test',
      });

      expect(error.message).toBe('Network error');
      expect(error.url).toBe('/api/test');
      expect(error._tag).toBe('FetchError');
    });

    it('should create error with status', () => {
      const error = new FetchError({
        message: 'Not found',
        url: '/api/test',
        status: 404,
      });

      expect(error.status).toBe(404);
    });

    it('should create from Response', () => {
      const response = {
        statusText: 'Not Found',
        status: 404,
      } as Response;

      const error = FetchError.fromResponse('/api/test', response);

      expect(error.message).toBe('Failed to fetch: Not Found');
      expect(error.url).toBe('/api/test');
      expect(error.status).toBe(404);
    });

    it('should create from Error', () => {
      const originalError = new Error('Connection refused');
      const error = FetchError.fromError('/api/test', originalError);

      expect(error.message).toBe('Connection refused');
      expect(error.url).toBe('/api/test');
    });

    it('should handle unknown error type', () => {
      const error = FetchError.fromError('/api/test', 'string error');

      expect(error.message).toBe('Unknown fetch error');
    });
  });

  describe('UpdateError', () => {
    it('should create error with entity', () => {
      const error = new UpdateError({
        message: 'Failed to update',
        entity: 'resume',
      });

      expect(error.message).toBe('Failed to update');
      expect(error.entity).toBe('resume');
      expect(error._tag).toBe('UpdateError');
    });

    it('should include details', () => {
      const error = new UpdateError({
        message: 'Validation failed',
        entity: 'job',
        details: { field: 'title', reason: 'required' },
      });

      expect(error.details).toEqual({ field: 'title', reason: 'required' });
    });
  });

  describe('EmbeddingError', () => {
    it('should create error', () => {
      const error = new EmbeddingError({
        message: 'Failed to generate embedding',
      });

      expect(error.message).toBe('Failed to generate embedding');
      expect(error._tag).toBe('EmbeddingError');
    });

    it('should include resumeId', () => {
      const error = new EmbeddingError({
        message: 'Model unavailable',
        resumeId: 'resume-123',
      });

      expect(error.resumeId).toBe('resume-123');
    });
  });

  describe('ChatError', () => {
    it('should create recoverable error', () => {
      const error = new ChatError({
        message: 'Temporary failure',
        recoverable: true,
      });

      expect(error.recoverable).toBe(true);
      expect(error._tag).toBe('ChatError');
    });

    it('should create non-recoverable error', () => {
      const error = new ChatError({
        message: 'API key invalid',
        recoverable: false,
      });

      expect(error.recoverable).toBe(false);
    });
  });

  describe('ResumeNotFoundError', () => {
    it('should create error with username', () => {
      const error = new ResumeNotFoundError({
        username: 'testuser',
      });

      expect(error.username).toBe('testuser');
      expect(error._tag).toBe('ResumeNotFoundError');
    });
  });

  describe('JobDataError', () => {
    it('should create error', () => {
      const error = new JobDataError({
        message: 'Invalid job data',
      });

      expect(error.message).toBe('Invalid job data');
      expect(error._tag).toBe('JobDataError');
    });

    it('should include jobId', () => {
      const error = new JobDataError({
        message: 'Missing title',
        jobId: 'job-456',
      });

      expect(error.jobId).toBe('job-456');
    });
  });

  describe('isPathwaysError', () => {
    it('should return true for FetchError', () => {
      const error = new FetchError({ message: 'test', url: '/api' });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return true for UpdateError', () => {
      const error = new UpdateError({ message: 'test', entity: 'test' });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return true for EmbeddingError', () => {
      const error = new EmbeddingError({ message: 'test' });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return true for ChatError', () => {
      const error = new ChatError({ message: 'test', recoverable: true });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return true for ResumeNotFoundError', () => {
      const error = new ResumeNotFoundError({ username: 'test' });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return true for JobDataError', () => {
      const error = new JobDataError({ message: 'test' });
      expect(isPathwaysError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('test');
      expect(isPathwaysError(error)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isPathwaysError(null)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isPathwaysError('error')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should get message from PathwaysError', () => {
      const error = new FetchError({ message: 'Network failed', url: '/api' });
      expect(getErrorMessage(error)).toBe('Network failed');
    });

    it('should get message from regular Error', () => {
      const error = new Error('Something broke');
      expect(getErrorMessage(error)).toBe('Something broke');
    });

    it('should return default for unknown', () => {
      expect(getErrorMessage('string error')).toBe(
        'An unexpected error occurred'
      );
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(getErrorMessage(123)).toBe('An unexpected error occurred');
    });
  });
});
