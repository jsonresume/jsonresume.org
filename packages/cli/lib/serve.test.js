jest.mock('browser-sync', () => ({
  create: jest.fn(() => ({
    watch: jest.fn(() => ({ on: jest.fn() })),
    init: jest.fn(),
    reload: jest.fn(),
  })),
}));

jest.mock('./builder', () =>
  jest.fn((theme, dir, resumeFilename, cb) => cb(null, '<html>ok</html>')),
);

const fs = require('fs');
const serve = require('./serve');

describe('serve', () => {
  let logSpy;

  const options = {
    port: 4000,
    theme: 'jsonresume-theme-even',
    silent: true,
    dir: 'public',
    resumeFilename: 'resume.json',
  };

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fs, 'writeFile')
      .mockImplementation((file, data, cb) => cb(null));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prints the preview URL', () => {
    serve(options);
    expect(logSpy).toHaveBeenCalledWith('Preview: http://localhost:4000');
  });

  it('does not emit leftover debug objects on rebuild', () => {
    serve(options);
    const objectArgs = logSpy.mock.calls
      .flat()
      .filter((arg) => typeof arg === 'object' && arg !== null);
    expect(objectArgs).toEqual([]);
  });
});
