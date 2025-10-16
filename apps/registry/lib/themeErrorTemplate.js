import { errorStyles } from './errorTemplate/errorStyles.js';

/**
 * Generate a user-friendly HTML error page for theme-related errors
 *
 * @param {Object} errorObject - Error object from buildError()
 * @returns {string} HTML error page
 */
function themeErrorTemplate(errorObject) {
  const { code, message, extra } = errorObject;

  // Determine the specific error type and customize the response
  let title = '⚠️ Theme Error';
  let helpText = message;
  let detailsHTML = '';

  if (code === 'TEMPLATE_MISSING') {
    title = '🎨 Theme Not Found';
    helpText = `
      <p>The theme <strong>"${
        extra?.themeName || 'unknown'
      }"</strong> could not be loaded.</p>
      <p>This might be because:</p>
      <ul class="help-list">
        <li>The theme package doesn't exist on npm</li>
        <li>The theme has been deprecated or removed</li>
        <li>The theme name is misspelled</li>
      </ul>
      <p>
        📚 <a href="https://github.com/jsonresume/jsonresume.org/issues/36" target="_blank">
          Request support for this theme
        </a> or check the
        <a href="https://jsonresume.org/themes/" target="_blank">available themes</a>.
      </p>
    `;
  } else if (code === 'UNKNOWN_TEMPLATE_ERROR') {
    title = '💥 Theme Rendering Error';
    helpText = `
      <p>The theme <strong>"${
        extra?.themeName || 'unknown'
      }"</strong> encountered an error while rendering your resume.</p>
      <p>This is usually caused by:</p>
      <ul class="help-list">
        <li>Missing required fields in your resume that the theme expects</li>
        <li>A bug in the theme code itself</li>
        <li>Incompatible resume data format</li>
      </ul>
    `;

    // Include the actual error message and stack trace if available
    if (extra?.error) {
      detailsHTML = `
        <div class="error-details-box">
          <h3>Error Details</h3>
          <div class="error-message-box">
            <strong>Error Message:</strong>
            <pre>${escapeHTML(
              extra.error.message || extra.error.toString()
            )}</pre>
          </div>
          ${
            extra.error.stack
              ? `
            <details class="stack-trace">
              <summary>Stack Trace (for developers)</summary>
              <pre>${escapeHTML(extra.error.stack)}</pre>
            </details>
          `
              : ''
          }
        </div>
        <p class="help-text">
          💡 Try using a different theme to see if your resume data is valid, or
          <a href="https://github.com/jsonresume/jsonresume.org/issues" target="_blank">
            report this issue
          </a> if you believe it's a theme bug.
        </p>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${errorStyles}
        <style>
          .help-list {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          .help-list li {
            margin: 0.5rem 0;
          }
          .error-details-box {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
          .error-details-box h3 {
            margin-top: 0;
            color: #d32f2f;
          }
          .error-message-box {
            background: #fff;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
          }
          .error-message-box pre {
            margin: 0.5rem 0 0 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #c62828;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
          }
          .stack-trace {
            margin-top: 1rem;
          }
          .stack-trace summary {
            cursor: pointer;
            color: #1976d2;
            font-weight: 500;
          }
          .stack-trace summary:hover {
            color: #1565c0;
          }
          .stack-trace pre {
            margin-top: 0.5rem;
            background: #263238;
            color: #aed581;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.85rem;
            line-height: 1.5;
          }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>${title}</h1>
            <div class="help-text">
                ${helpText}
            </div>
            ${detailsHTML}
        </div>
    </body>
    </html>
  `;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default themeErrorTemplate;
