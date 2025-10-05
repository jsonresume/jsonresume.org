function errorTemplate(errorObject) {
  const generateErrorHTML = (error, index) => {
    // Make property path more readable
    const propertyPath = error.property || 'root';
    const readablePath = propertyPath
      .replace(/^instance\./, '')
      .replace(/\./g, ' → ');

    // Create a more user-friendly error message
    const friendlyMessage = error.message;
    const hasInstance = error.instance !== undefined && error.instance !== null;

    return `
        <li class="error-item">
            <div class="error-header">
                <span class="error-number">${index + 1}.</span>
                <span class="error-path">${
                  readablePath || 'Document root'
                }</span>
            </div>
            <div class="error-message">${friendlyMessage}</div>
            ${
              hasInstance
                ? `
                <div class="error-value">
                    <strong>Current value:</strong>
                    <code>${JSON.stringify(error.instance)}</code>
                </div>
            `
                : ''
            }
            <details class="error-details">
                <summary>Technical details</summary>
                <div class="technical-info">
                    <div><strong>Property:</strong> ${error.property}</div>
                    ${
                      error.schema
                        ? `<div><strong>Expected schema:</strong> <code>${JSON.stringify(
                            error.schema,
                            null,
                            2
                          )}</code></div>`
                        : ''
                    }
                    ${
                      error.stack
                        ? `<div><strong>Stack:</strong> ${error.stack}</div>`
                        : ''
                    }
                </div>
            </details>
        </li>
    `;
  };

  const generateErrorsHTML = (errors) => {
    return errors
      .map((error, index) => generateErrorHTML(error, index))
      .join('');
  };

  const styles = `
        <style>
            * {
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }

            .error-container {
                max-width: 800px;
                margin: 0 auto;
                background: #fff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }

            h1 {
                color: #d32f2f;
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 28px;
            }

            .help-text {
                color: #666;
                margin-bottom: 30px;
                line-height: 1.6;
            }

            .help-text a {
                color: #667eea;
                text-decoration: none;
            }

            .help-text a:hover {
                text-decoration: underline;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .error-item {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-left: 4px solid #d32f2f;
                padding: 20px;
                margin-bottom: 16px;
                border-radius: 6px;
                transition: box-shadow 0.2s;
            }

            .error-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .error-header {
                display: flex;
                align-items: baseline;
                margin-bottom: 12px;
            }

            .error-number {
                font-weight: bold;
                color: #d32f2f;
                margin-right: 8px;
                font-size: 18px;
            }

            .error-path {
                font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                background: #f5f5f5;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
                color: #333;
            }

            .error-message {
                color: #d32f2f;
                font-size: 16px;
                margin-bottom: 12px;
                line-height: 1.5;
            }

            .error-value {
                background: #f9f9f9;
                padding: 12px;
                border-radius: 4px;
                margin: 12px 0;
                font-size: 14px;
            }

            .error-value code {
                background: #fff;
                padding: 2px 6px;
                border-radius: 3px;
                border: 1px solid #e0e0e0;
                font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                font-size: 13px;
            }

            details {
                margin-top: 12px;
            }

            summary {
                cursor: pointer;
                color: #667eea;
                font-size: 14px;
                user-select: none;
            }

            summary:hover {
                text-decoration: underline;
            }

            .technical-info {
                background: #f5f5f5;
                padding: 12px;
                margin-top: 8px;
                border-radius: 4px;
                font-size: 13px;
                font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            }

            .technical-info div {
                margin: 8px 0;
            }

            .technical-info code {
                background: #fff;
                padding: 8px;
                display: block;
                border-radius: 3px;
                border: 1px solid #e0e0e0;
                margin-top: 4px;
                overflow-x: auto;
                white-space: pre;
            }
        </style>
    `;

  const errorsHTML = generateErrorsHTML(errorObject.extra.validation);
  const errorCount = errorObject.extra.validation.length;

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume Validation Errors</title>
            ${styles}
        </head>
        <body>
            <div class="error-container">
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
