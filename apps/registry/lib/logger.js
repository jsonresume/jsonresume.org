const pino = require('pino');

/**
 * Create a structured logger using Pino
 *
 * In development:
 * - Pretty printed output with colors
 * - Includes timestamps and source location
 *
 * In production:
 * - JSON formatted logs
 * - Optimized for log aggregation services
 */
const logger = pino({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  // Browser compatibility
  browser: {
    asObject: true,
  },

  // Pretty print in development only
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Format options for production
  ...(process.env.NODE_ENV === 'production' && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  }),
});

module.exports = logger;
module.exports.default = logger;
