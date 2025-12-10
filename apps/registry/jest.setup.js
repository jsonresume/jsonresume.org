import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => require('next-router-mock/navigation'));

// Mock dynamic imports for Next.js
jest.mock('next/dynamic', () => (dynamicFunction, options) => {
  const dynamicActualComp = dynamicFunction();
  const RequiredComponent = dynamicActualComp.default || dynamicActualComp;
  RequiredComponent.preload = jest.fn(() => Promise.resolve());
  return RequiredComponent;
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Web APIs that may not be available in Jest environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getUserMedia for audio recording tests
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn(() =>
      Promise.resolve({
        getTracks: () => [
          {
            stop: jest.fn(),
            kind: 'audio',
            readyState: 'live',
          },
        ],
      })
    ),
  },
});

// Mock MediaRecorder
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: jest.fn(),
  onstop: jest.fn(),
  state: 'inactive',
}));

// Mock AudioContext for audio processing
global.AudioContext = jest.fn().mockImplementation(() => ({
  decodeAudioData: jest.fn(() =>
    Promise.resolve({
      length: 1000,
      numberOfChannels: 1,
      sampleRate: 44100,
      getChannelData: jest.fn(() => new Float32Array(1000)),
    })
  ),
}));

// Mock webkitAudioContext for Safari compatibility
global.webkitAudioContext = global.AudioContext;

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(() => Promise.resolve()),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  volume: 1,
  src: '',
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock Request and Response for API tests
global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  method: options?.method || 'GET',
  headers: options?.headers || {},
  body: options?.body,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  formData: jest.fn().mockResolvedValue(new FormData()),
}));

global.Response = jest.fn().mockImplementation((body, options) => ({
  body,
  status: options?.status || 200,
  statusText: options?.statusText || 'OK',
  headers: new Map(Object.entries(options?.headers || {})),
  ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(body || ''),
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
}));

// Mock FormData
global.FormData = jest.fn().mockImplementation(() => {
  const data = new Map();
  return {
    append: jest.fn((key, value, filename) => {
      data.set(key, { value, filename });
    }),
    get: jest.fn((key) => data.get(key)?.value),
    has: jest.fn((key) => data.has(key)),
    delete: jest.fn((key) => data.delete(key)),
    entries: jest.fn(() => data.entries()),
    forEach: jest.fn((callback) => {
      data.forEach((entry, key) => callback(entry.value, key));
    }),
  };
});

// Mock TransformStream for edge runtime APIs
global.TransformStream = jest.fn().mockImplementation(() => ({
  readable: {
    getReader: jest.fn(() => ({
      read: jest.fn(() => Promise.resolve({ done: true, value: undefined })),
      releaseLock: jest.fn(),
    })),
  },
  writable: {
    getWriter: jest.fn(() => ({
      write: jest.fn(() => Promise.resolve()),
      close: jest.fn(() => Promise.resolve()),
      releaseLock: jest.fn(),
    })),
  },
}));

// Mock ReadableStream
global.ReadableStream = jest.fn().mockImplementation(() => ({
  getReader: jest.fn(() => ({
    read: jest.fn(() => Promise.resolve({ done: true, value: undefined })),
    releaseLock: jest.fn(),
  })),
}));

// Mock WritableStream
global.WritableStream = jest.fn().mockImplementation(() => ({
  getWriter: jest.fn(() => ({
    write: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
    releaseLock: jest.fn(),
  })),
}));

// Mock console methods to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
