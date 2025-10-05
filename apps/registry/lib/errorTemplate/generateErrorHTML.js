export const generateErrorHTML = (error, index) => {
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
            <span class="error-path">${readablePath || 'Document root'}</span>
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

export const generateErrorsHTML = (errors) => {
  return errors.map((error, index) => generateErrorHTML(error, index)).join('');
};
