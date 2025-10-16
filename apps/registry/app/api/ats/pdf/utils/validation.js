/**
 * Request validation utilities for PDF analysis endpoint
 */

/**
 * Validate PDF analysis request body
 * @param {Object} body - Request body
 * @returns {Object} Validation result {valid, error, data}
 */
export function validatePDFRequest(body) {
  const { resume, username, theme } = body;

  // Check resume exists
  if (!resume) {
    return {
      valid: false,
      error: 'Resume data is required',
      status: 400,
    };
  }

  // Check resume is valid object
  if (typeof resume !== 'object' || Array.isArray(resume)) {
    return {
      valid: false,
      error: 'Resume must be a valid object',
      status: 400,
    };
  }

  // Check username
  if (!username) {
    return {
      valid: false,
      error: 'Username is required for PDF analysis',
      status: 400,
    };
  }

  return {
    valid: true,
    data: {
      resume,
      username,
      theme: theme || 'professional',
    },
  };
}
