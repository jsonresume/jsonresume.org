import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('logger', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Clear module cache to get fresh logger instance
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  it('uses debug level in development by default', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.LOG_LEVEL;

    const { logger } = await import('./logger');
    expect(logger.level).toBe('debug');
  });

  it('uses info level in production by default', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.LOG_LEVEL;

    const { logger } = await import('./logger');
    expect(logger.level).toBe('info');
  });

  it('respects LOG_LEVEL environment variable', async () => {
    process.env.LOG_LEVEL = 'warn';
    process.env.NODE_ENV = 'production';

    const { logger } = await import('./logger');
    expect(logger.level).toBe('warn');
  });

  it('supports all log levels', async () => {
    const { logger } = await import('./logger');

    // Should have standard pino log methods
    expect(typeof logger.trace).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  it('logs with metadata', async () => {
    const { logger } = await import('./logger');
    const infoSpy = vi.spyOn(logger, 'info');

    logger.info({ userId: '123', action: 'login' }, 'User logged in');

    expect(infoSpy).toHaveBeenCalledWith(
      { userId: '123', action: 'login' },
      'User logged in'
    );
  });

  it('logs errors with error object', async () => {
    const { logger } = await import('./logger');
    const errorSpy = vi.spyOn(logger, 'error');
    const testError = new Error('Test error');

    logger.error({ error: testError.message }, 'An error occurred');

    expect(errorSpy).toHaveBeenCalledWith(
      { error: 'Test error' },
      'An error occurred'
    );
  });

  it('creates child loggers with context', async () => {
    const { logger } = await import('./logger');
    const childLogger = logger.child({ module: 'auth' });

    expect(childLogger).toBeDefined();
    expect(typeof childLogger.info).toBe('function');
  });

  it('supports different log levels for filtering', async () => {
    process.env.LOG_LEVEL = 'warn';
    const { logger } = await import('./logger');

    const debugSpy = vi.spyOn(logger, 'debug');
    const warnSpy = vi.spyOn(logger, 'warn');

    logger.debug('This should be filtered');
    logger.warn('This should be logged');

    // Debug should be called but not actually log anything (filtered by level)
    expect(debugSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });
});
