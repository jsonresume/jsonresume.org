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
            <p>+1 (555) 123-4567</p>
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

  describe('Contact Information check', () => {
    const findCheck = (result) =>
      result.checks.find((c) => c.name === 'Contact Information');

    it('flags a resume with no email or phone in selectable text', () => {
      const html = `
        <html lang="en">
        <body>
          <header><h1>John Doe</h1></header>
          <section><h2>Work</h2><p>Software Engineer</p></section>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const contact = findCheck(result);

      expect(contact.passed).toBe(false);
      expect(
        contact.issues.some(
          (i) => i.severity === 'error' && i.message.includes('email')
        )
      ).toBe(true);
      expect(contact.issues.some((i) => i.message.includes('phone'))).toBe(
        true
      );
    });

    it('passes when email and phone exist as plain text', () => {
      const html = `
        <html lang="en">
        <body>
          <header>
            <h1>Jane Doe</h1>
            <p>jane.doe@example.com</p>
            <p>+1 (555) 987-6543</p>
          </header>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const contact = findCheck(result);

      expect(contact.passed).toBe(true);
      expect(contact.issues).toHaveLength(0);
    });

    it('accepts mailto: and tel: links as parseable contact info', () => {
      const html = `
        <html lang="en">
        <body>
          <header>
            <h1>Jane Doe</h1>
            <p>
              <a href="mailto:jane@example.com">Email</a>
              <a href="tel:+15559876543">Call</a>
            </p>
          </header>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const contact = findCheck(result);

      expect(contact.passed).toBe(true);
      expect(contact.issues).toHaveLength(0);
    });

    it('does not treat a year range as a phone number', () => {
      const html = `
        <html lang="en">
        <body>
          <h1>Jane Doe</h1>
          <p>jane@example.com</p>
          <section><h2>Work</h2><p>Engineer 2015 to 2020. Born 1990.</p></section>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const contact = findCheck(result);

      // Email present, so no email error; phone genuinely missing -> warning.
      expect(contact.issues.some((i) => i.message.includes('email'))).toBe(
        false
      );
      expect(
        contact.issues.some(
          (i) => i.severity === 'warning' && i.message.includes('phone')
        )
      ).toBe(true);
    });
  });

  describe('Special Characters check', () => {
    const findCheck = (result) =>
      result.checks.find((c) => c.name === 'Special Characters');

    it('detects icon-font classes (Font Awesome, Material Icons)', () => {
      const html = `
        <html lang="en">
        <body>
          <header>
            <h1>John Doe</h1>
            <p><i class="fa fa-envelope"></i> john@example.com</p>
            <p><i class="fas fa-phone"></i> 555-123-4567</p>
            <span class="material-icons">home</span>
          </header>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const check = findCheck(result);

      expect(check.passed).toBe(false);
      expect(
        check.issues.some((i) => i.message.toLowerCase().includes('icon font'))
      ).toBe(true);
    });

    it('does not flag ordinary class names that merely start with icon tokens', () => {
      const html = `
        <html lang="en">
        <body>
          <h1>Jane Doe</h1>
          <p>jane@example.com 555-123-4567</p>
          <div class="fancy biography section-header"><h2>About</h2></div>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const check = findCheck(result);

      expect(check.passed).toBe(true);
      expect(check.issues).toHaveLength(0);
    });

    it('flags excessive emoji used as decorative markers', () => {
      const html = `
        <html lang="en">
        <body>
          <h1>Jane Doe</h1>
          <p>jane@example.com 555-123-4567</p>
          <h2>Skills 🚀 ✨ 🔥 💯 ⭐ 🎯</h2>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const check = findCheck(result);

      expect(check.passed).toBe(false);
      expect(
        check.issues.some(
          (i) => i.severity === 'warning' && i.message.includes('emoji')
        )
      ).toBe(true);
    });

    it('flags private-use Unicode glyphs leaked from icon fonts', () => {
      const glyph = String.fromCharCode(0xe001); // Private Use Area glyph (icon-font leak)
      const html = `
        <html lang="en">
        <body>
          <h1>Jane Doe</h1>
          <p>jane@example.com</p>
          <p>Contact: ${glyph} 555-123-4567</p>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const check = findCheck(result);

      expect(check.passed).toBe(false);
      expect(
        check.issues.some(
          (i) => i.severity === 'error' && i.message.includes('Private-use')
        )
      ).toBe(true);
    });

    it('passes clean plain-text resumes (standard bullets allowed)', () => {
      const html = `
        <html lang="en">
        <body>
          <h1>Jane Doe</h1>
          <p>jane@example.com — 555-123-4567</p>
          <ul><li>• Shipped feature A</li><li>• Led team B</li></ul>
        </body>
        </html>
      `;

      const result = validateATS(html);
      const check = findCheck(result);

      expect(check.passed).toBe(true);
      expect(check.issues).toHaveLength(0);
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
