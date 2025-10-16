import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock logger before importing notifications
vi.mock('../logger.js', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import {
  notifyCriticalError,
  notifyDeployment,
  notifyUserSignup,
  notifyFeatureUsage,
} from './notifications.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('Discord Notifications', () => {
  beforeEach(() => {
    // Set webhook URL for tests
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test';
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.DISCORD_WEBHOOK_URL;
  });

  describe('notifyCriticalError', () => {
    it('sends error notification with basic error', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      const error = new Error('Test error message');
      await notifyCriticalError(error);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = global.fetch.mock.calls[0];

      expect(url).toBe('https://discord.com/api/webhooks/test');
      expect(options.method).toBe('POST');

      const payload = JSON.parse(options.body);
      expect(payload.embeds).toHaveLength(1);
      expect(payload.embeds[0].title).toBe('🚨 Critical Error');
      expect(payload.embeds[0].color).toBe(0xff0000); // Red
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Error Type',
            value: 'Error',
          }),
          expect.objectContaining({
            name: 'Message',
            value: 'Test error message',
          }),
        ])
      );
    });

    it('includes context information when provided', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      const error = new Error('API failure');
      const context = {
        endpoint: '/api/users',
        user: 'testuser',
      };

      await notifyCriticalError(error, context);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Endpoint',
            value: '/api/users',
          }),
          expect.objectContaining({
            name: 'User',
            value: 'testuser',
          }),
        ])
      );
    });

    it('includes stack trace when available', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      const error = new Error('Stack trace test');
      error.stack = 'Error: Stack trace test\n    at test.js:10:15';

      await notifyCriticalError(error);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const stackField = payload.embeds[0].fields.find(
        (f) => f.name === 'Stack Trace'
      );
      expect(stackField).toBeDefined();
      expect(stackField.value).toContain('Error: Stack trace test');
    });

    it('handles fetch errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const error = new Error('Test error');
      const result = await notifyCriticalError(error);

      expect(result).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyDeployment', () => {
    it('sends successful deployment notification', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyDeployment('success', {
        environment: 'production',
        commit: 'abc1234567',
        message: 'feat: add new feature',
        url: 'https://vercel.com/deployment/123',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.embeds[0].title).toBe('✅ Deployment Successful');
      expect(payload.embeds[0].color).toBe(0x00ff00); // Green
      expect(payload.embeds[0].url).toBe('https://vercel.com/deployment/123');
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Environment',
            value: 'production',
          }),
          expect.objectContaining({
            name: 'Commit',
            value: 'abc1234',
          }),
        ])
      );
    });

    it('sends failed deployment notification', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyDeployment('failure', {
        environment: 'staging',
      });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.embeds[0].title).toBe('❌ Deployment Failed');
      expect(payload.embeds[0].color).toBe(0xff0000); // Red
      expect(payload.embeds[0].description).toContain('please investigate');
    });
  });

  describe('notifyUserSignup', () => {
    it('sends user signup notification', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyUserSignup('johndoe', {
        method: 'GitHub OAuth',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.embeds[0].title).toBe('👤 New User Signup');
      expect(payload.embeds[0].color).toBe(0x00ff00); // Green
      expect(payload.embeds[0].url).toBe(
        'https://registry.jsonresume.org/johndoe'
      );
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Username',
            value: 'johndoe',
          }),
          expect.objectContaining({
            name: 'Method',
            value: 'GitHub OAuth',
          }),
        ])
      );
    });

    it('uses default method when not provided', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyUserSignup('testuser');

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const methodField = payload.embeds[0].fields.find(
        (f) => f.name === 'Method'
      );
      expect(methodField.value).toBe('GitHub OAuth');
    });
  });

  describe('notifyFeatureUsage', () => {
    it('sends feature usage notification', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyFeatureUsage('Cover Letter Generator', {
        username: 'johndoe',
        company: 'Acme Inc',
        position: 'Software Engineer',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.embeds[0].title).toBe('🎯 Cover Letter Generator Used');
      expect(payload.embeds[0].color).toBe(0x0099ff); // Blue
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'User',
            value: 'johndoe',
          }),
          expect.objectContaining({
            name: 'Company',
            value: 'Acme Inc',
          }),
          expect.objectContaining({
            name: 'Position',
            value: 'Software Engineer',
          }),
        ])
      );
    });

    it('handles feature usage without username', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      await notifyFeatureUsage('AI Chat', {
        sessionId: '12345',
      });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.embeds[0].fields).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'SessionId',
            value: '12345',
          }),
        ])
      );
    });
  });

  describe('Webhook configuration', () => {
    it('skips notification when webhook URL is not configured', async () => {
      delete process.env.DISCORD_WEBHOOK_URL;

      const result = await notifyUserSignup('testuser');

      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('handles HTTP error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const error = new Error('Test');
      await notifyCriticalError(error);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Field truncation', () => {
    it('truncates error messages exceeding Discord limit', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      const longMessage = 'A'.repeat(2000);
      const error = new Error(longMessage);

      await notifyCriticalError(error);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const messageField = payload.embeds[0].fields.find(
        (f) => f.name === 'Message'
      );
      expect(messageField.value.length).toBeLessThanOrEqual(1024);
    });

    it('truncates stack traces exceeding Discord limit', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true });

      const longStack = 'Stack trace line\n'.repeat(100);
      const error = new Error('Test');
      error.stack = longStack;

      await notifyCriticalError(error);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      const stackField = payload.embeds[0].fields.find(
        (f) => f.name === 'Stack Trace'
      );
      expect(stackField.value.length).toBeLessThanOrEqual(1024 + 10); // +10 for code block markers
    });
  });
});
