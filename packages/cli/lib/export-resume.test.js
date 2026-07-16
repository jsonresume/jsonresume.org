const exportResume = require('./export-resume');
const { ThemeNotFoundError } = require('./theme-errors');

describe('exportResume', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('surfaces ThemeNotFoundError from the PDF path for unresolvable themes', (done) => {
    // PDF export resolves the theme (via the shared renderHTML resolver)
    // before puppeteer is ever launched, so a missing theme fails fast with a
    // typed error instead of a raw require() stack trace.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    exportResume(
      {
        resume: { basics: { name: 'test' } },
        fileName: 'out.pdf',
        theme: 'jsonresume-theme-definitely-not-installed',
        format: 'pdf',
      },
      (error, fileName, format) => {
        try {
          expect(error).toBeInstanceOf(ThemeNotFoundError);
          expect(error.theme).toBe('jsonresume-theme-definitely-not-installed');
          expect(fileName).toBe('out');
          expect(format).toBe('.pdf');
          // ThemeNotFoundError is reported by the caller; no raw dump here.
          expect(errorSpy).not.toHaveBeenCalled();
          done();
        } catch (assertion) {
          done(assertion);
        }
      },
    );
  });

  it('surfaces ThemeNotFoundError from the HTML path for unresolvable themes', (done) => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    exportResume(
      {
        resume: { basics: { name: 'test' } },
        fileName: 'out.html',
        theme: 'jsonresume-theme-definitely-not-installed',
        format: 'html',
      },
      (error) => {
        try {
          expect(error).toBeInstanceOf(ThemeNotFoundError);
          done();
        } catch (assertion) {
          done(assertion);
        }
      },
    );
  });
});
