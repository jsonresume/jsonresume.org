import { errorStyles } from './errorTemplate/errorStyles.js';
import { generateErrorsHTML } from './errorTemplate/generateErrorHTML.js';

function errorTemplate(errorObject) {
  const errorsHTML = generateErrorsHTML(errorObject.extra.validation);
  const errorCount = errorObject.extra.validation.length;

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume Validation Errors</title>
            ${errorStyles}
        </head>
        <body>
            <div class="error-container">
                <div class="cache-warning">
                    ℹ️ <strong>Seeing outdated errors?</strong> This page shows cached data for performance.
                    If you've recently fixed these errors in your gist,
                    <a href="https://registry.jsonresume.org/privacy" target="_blank">clear your cache</a>
                    to refresh with the latest data.
                </div>

                <h1>⚠️ Resume Validation Failed</h1>
                <p class="help-text">
                    Your resume.json file has <strong>${errorCount} validation ${
    errorCount === 1 ? 'error' : 'errors'
  }</strong>.
                    Please fix ${
                      errorCount === 1 ? 'this issue' : 'these issues'
                    } below and try again.
                    <br><br>
                    📖 Need help? Check the <a href="https://jsonresume.org/schema/" target="_blank">JSON Resume Schema documentation</a> for guidance.
                </p>
                <ul id="error-list">
                    ${errorsHTML}
                </ul>
            </div>
        </body>
        </html>
    `;
}

export default errorTemplate;
