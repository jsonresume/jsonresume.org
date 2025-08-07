const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Module name mapping for imports
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',

    // Handle image and other asset imports
    '\\.(jpg|jpeg|png|gif|svg|ico)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Test directories and file patterns
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],

  // Ignore Playwright tests
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/', // Playwright tests
  ],

  // Coverage settings
  collectCoverage: false,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/node_modules/**',
    '!app/**/*.config.{js,ts}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Test timeout
  testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
