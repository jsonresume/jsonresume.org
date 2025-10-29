import { describe, it, expect } from 'vitest';
import { validateATS, getRecommendations } from '../src/index.js';

describe('ATS Validator', () => {
  describe('validateATS()', () => {
    it('scores perfect HTML highly', () => {
      const perfectHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; }
            h1 { font-size: 36px; }
            h2 { font-size: 16px; }
          </style>
        </head>
        <body>
          <header>
            <h1>John Doe</h1>
            <p>john@example.com</p>
          </header>
          <section>
            <h2>Work Experience</h2>
            <p>Software Engineer at TechCorp</p>
          </section>
          <section>
            <h2>Education</h2>
            <p>BS Computer Science</p>
          </section>
          <section>
            <h2>Skills</h2>
            <p>JavaScript, Python, React</p>
          </section>
        </body>
        </html>
      `;

      const result = validateATS(perfectHTML);

      expect(result.score).toBeGreaterThan(80);
      expect(result.grade).toMatch(/[AB]/);
      expect(result.atsCompatibility).toMatch(/excellent|good/);
      expect(result.passed).toBeGreaterThan(result.failed);
    });

    it('detects missing semantic HTML', () => {
      const badHTML = `
        <html>
        <body>
          <div class="header">
            <span>John Doe</span>
          </div>
          <div>Work Experience</div>
          <div>Education</div>
        </body>
        </html>
      `;

      const result = validateATS(badHTML);

      // Check that semantic HTML check failed
      const semanticCheck = result.checks.find(
        (c) => c.name === 'Semantic HTML'
      );
      expect(semanticCheck.passed).toBe(false);
      expect(semanticCheck.issues.length).toBeGreaterThan(0);

      // Should have issues about missing header, sections, and h1
      const issueMessages = semanticCheck.issues
        .map((i) => i.message)
        .join(' ');
      expect(issueMessages).toMatch(/header|h1|section/i);
    });

    it('detects table layouts', () => {
      const tableHTML = `
        <html>
        <body>
          <table>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Address</td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>555-1234</td>
              <td>123 Main St</td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const result = validateATS(tableHTML);

      const tableCheck = result.checks.find(
        (c) => c.name === 'No Table Layouts'
      );
      expect(tableCheck.passed).toBe(false);
      expect(tableCheck.issues.some((i) => i.message.includes('table'))).toBe(
        true
      );
    });

    it('detects bad fonts', () => {
      const badFontHTML = `
        <html>
        <head>
          <style>
            body { font-family: 'Comic Sans MS', cursive; }
          </style>
        </head>
        <body>
          <h1>Resume</h1>
        </body>
        </html>
      `;

      const result = validateATS(badFontHTML);

      const fontCheck = result.checks.find(
        (c) => c.name === 'ATS-Friendly Fonts'
      );
      expect(
        fontCheck.issues.some((i) => i.message.includes('comic sans'))
      ).toBe(true);
    });

    it('warns about custom web fonts', () => {
      const webFontHTML = `
        <html>
        <head>
          <style>
            @font-face {
              font-family: 'CustomFont';
              src: url('/fonts/custom.woff2');
            }
            body { font-family: 'CustomFont', Arial, sans-serif; }
          </style>
        </head>
        <body><h1>Resume</h1></body>
        </html>
      `;

      const result = validateATS(webFontHTML);

      const fontCheck = result.checks.find(
        (c) => c.name === 'ATS-Friendly Fonts'
      );
      expect(
        fontCheck.issues.some((i) => i.message.includes('web fonts'))
      ).toBe(true);
    });

    it('detects multi-column layouts', () => {
      const multiColumnHTML = `
        <html>
        <head>
          <style>
            .content { column-count: 2; }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>John Doe</h1>
            <p>Content here</p>
          </div>
        </body>
        </html>
      `;

      const result = validateATS(multiColumnHTML);

      const layoutCheck = result.checks.find(
        (c) => c.name === 'Single-Column Layout'
      );
      expect(
        layoutCheck.issues.some((i) => i.message.includes('Multi-column'))
      ).toBe(true);
    });

    it('checks heading hierarchy', () => {
      const badHierarchyHTML = `
        <html>
        <body>
          <h1>Name</h1>
          <h4>Section</h4>
        </body>
        </html>
      `;

      const result = validateATS(badHierarchyHTML);

      const semanticCheck = result.checks.find(
        (c) => c.name === 'Semantic HTML'
      );
      expect(
        semanticCheck.issues.some((i) => i.message.includes('hierarchy'))
      ).toBe(true);
    });

    it('warns about multiple h1 tags', () => {
      const multipleH1HTML = `
        <html>
        <body>
          <h1>John Doe</h1>
          <h1>Another H1</h1>
        </body>
        </html>
      `;

      const result = validateATS(multipleH1HTML);

      const semanticCheck = result.checks.find(
        (c) => c.name === 'Semantic HTML'
      );
      expect(
        semanticCheck.issues.some((i) => i.message.includes('Multiple <h1>'))
      ).toBe(true);
    });

    it('detects very small fonts', () => {
      const smallFontHTML = `
        <html>
        <head>
          <style>
            .small { font-size: 6px; }
          </style>
        </head>
        <body>
          <h1>Resume</h1>
          <p class="small">Fine print</p>
        </body>
        </html>
      `;

      const result = validateATS(smallFontHTML);

      const fontSizeCheck = result.checks.find((c) => c.name === 'Font Sizes');
      expect(
        fontSizeCheck.issues.some((i) => i.message.includes('below 10px'))
      ).toBe(true);
    });

    it('checks for image alt text', () => {
      const noAltHTML = `
        <html>
        <body>
          <h1>Resume</h1>
          <img src="photo.jpg">
        </body>
        </html>
      `;

      const result = validateATS(noAltHTML);

      const imageCheck = result.checks.find(
        (c) => c.name === 'Image Accessibility'
      );
      expect(
        imageCheck.issues.some((i) => i.message.includes('alt text'))
      ).toBe(true);
    });

    it('checks for lang attribute', () => {
      const noLangHTML = `
        <html>
        <body>
          <h1>Resume</h1>
        </body>
        </html>
      `;

      const result = validateATS(noLangHTML);

      const a11yCheck = result.checks.find((c) => c.name === 'Accessibility');
      expect(
        a11yCheck.issues.some((i) => i.message.includes('lang attribute'))
      ).toBe(true);
    });

    it('returns proper result structure', () => {
      const html = '<html><body><h1>Test</h1></body></html>';
      const result = validateATS(html);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('grade');
      expect(result).toHaveProperty('totalScore');
      expect(result).toHaveProperty('maxScore');
      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('atsCompatibility');

      expect(Array.isArray(result.checks)).toBe(true);
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.grade).toMatch(/[ABCDF]/);
    });

    it('groups all issues from all checks', () => {
      const badHTML = `
        <html>
        <body>
          <table><tr><td>Bad layout</td></tr></table>
          <span>No headings</span>
        </body>
        </html>
      `;

      const result = validateATS(badHTML);

      expect(result.issues.length).toBeGreaterThan(0);

      // Should have issues from multiple checks
      const issueCategories = new Set(result.issues.map((i) => i.severity));
      expect(issueCategories.size).toBeGreaterThan(0);
    });
  });

  describe('getRecommendations()', () => {
    it('returns recommendations for poor scores', () => {
      const result = {
        score: 45,
        checks: [
          {
            name: 'Semantic HTML',
            score: 3,
            maxScore: 10,
            passed: false,
            issues: [],
          },
          { name: 'Fonts', score: 5, maxScore: 15, passed: false, issues: [] },
        ],
        issues: [
          { severity: 'error', message: 'Critical issue' },
          { severity: 'error', message: 'Another error' },
        ],
      };

      const recs = getRecommendations(result);

      expect(recs.length).toBeGreaterThan(0);
      expect(recs.some((r) => r.includes('Critical'))).toBe(true);
      expect(recs.some((r) => r.includes('2 critical error'))).toBe(true);
    });

    it('returns positive message for good scores', () => {
      const result = {
        score: 92,
        checks: [
          {
            name: 'Semantic HTML',
            score: 10,
            maxScore: 10,
            passed: true,
            issues: [],
          },
          { name: 'Fonts', score: 14, maxScore: 15, passed: true, issues: [] },
        ],
        issues: [],
      };

      const recs = getRecommendations(result);

      expect(recs.some((r) => r.includes('Great!'))).toBe(true);
    });

    it('lists failed check categories', () => {
      const result = {
        score: 65,
        checks: [
          {
            name: 'Semantic HTML',
            score: 5,
            maxScore: 10,
            passed: false,
            issues: [],
          },
          { name: 'Fonts', score: 14, maxScore: 15, passed: true, issues: [] },
          { name: 'Tables', score: 8, maxScore: 15, passed: false, issues: [] },
        ],
        issues: [],
      };

      const recs = getRecommendations(result);

      expect(recs.some((r) => r.includes('Semantic HTML'))).toBe(true);
      expect(recs.some((r) => r.includes('Tables'))).toBe(true);
      expect(recs.some((r) => r.includes('Fonts'))).toBe(false); // Passed
    });
  });
});
