import { describe, it, expect } from 'vitest';
import themeErrorTemplate from './themeErrorTemplate';

describe('themeErrorTemplate', () => {
  it('generates HTML for missing theme error', () => {
    const errorObject = {
      code: 'TEMPLATE_MISSING',
      message: 'Theme is not supported',
      extra: {
        themeName: 'custom-theme',
      },
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).toContain('🎨 Theme Not Found');
    expect(html).toContain('custom-theme');
    expect(html).toContain('Request support for this theme');
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('generates HTML for theme runtime error', () => {
    const errorObject = {
      code: 'UNKNOWN_TEMPLATE_ERROR',
      message: 'Theme rendering failed',
      extra: {
        themeName: 'elegant',
        error: {
          message: 'Cannot read property "summary" of undefined',
          stack: 'Error: Cannot read property "summary"...\n    at render()',
        },
      },
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).toContain('💥 Theme Rendering Error');
    expect(html).toContain('elegant');
    // Error message is escaped in HTML
    expect(html).toContain(
      'Cannot read property &quot;summary&quot; of undefined'
    );
    expect(html).toContain('Stack Trace');
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('generates HTML for theme runtime error without stack trace', () => {
    const errorObject = {
      code: 'UNKNOWN_TEMPLATE_ERROR',
      message: 'Theme rendering failed',
      extra: {
        themeName: 'simple',
        error: {
          message: 'Rendering failed',
        },
      },
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).toContain('💥 Theme Rendering Error');
    expect(html).toContain('simple');
    expect(html).toContain('Rendering failed');
    expect(html).not.toContain('Stack Trace');
  });

  it('escapes HTML in error messages to prevent XSS', () => {
    const errorObject = {
      code: 'UNKNOWN_TEMPLATE_ERROR',
      message: 'Theme rendering failed',
      extra: {
        themeName: 'test',
        error: {
          message: '<script>alert("XSS")</script>',
        },
      },
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('alert(&quot;XSS&quot;)');
  });

  it('escapes the user-supplied theme name', () => {
    const html = themeErrorTemplate({
      code: 'TEMPLATE_MISSING',
      message: 'Theme is not supported',
      extra: { themeName: '<img src=x onerror=alert(1)>' },
    });

    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('renders non-theme errors with their message', () => {
    const html = themeErrorTemplate({
      code: 'INVALID_USERNAME',
      message: 'This is not a valid Github username',
    });

    expect(html).toContain('Resume Error');
    expect(html).toContain('This is not a valid Github username');
  });

  it('handles missing theme name gracefully', () => {
    const errorObject = {
      code: 'TEMPLATE_MISSING',
      message: 'Theme is not supported',
      extra: {},
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).toContain('unknown');
    expect(html).toContain('🎨 Theme Not Found');
  });

  it('includes proper HTML structure and styles', () => {
    const errorObject = {
      code: 'TEMPLATE_MISSING',
      message: 'Theme is not supported',
      extra: { themeName: 'test' },
    };

    const html = themeErrorTemplate(errorObject);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<meta charset="UTF-8">');
    expect(html).toContain('<meta name="viewport"');
    expect(html).toContain('<style>');
    expect(html).toContain('.error-container');
  });
});
