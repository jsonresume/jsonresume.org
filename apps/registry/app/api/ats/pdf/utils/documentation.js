/**
 * API endpoint documentation
 */

/**
 * Get documentation for the PDF analysis endpoint
 * @returns {Object} API documentation object
 */
export function getEndpointDocumentation() {
  return {
    endpoint: '/api/ats/pdf',
    method: 'POST',
    description: 'Analyzes PDF parseability for ATS compatibility',
    notice: 'This endpoint simulates uploading your PDF to an ATS system',
    howItWorks: [
      '1. Generates PDF with specified theme',
      '2. Extracts text using PDF parsing',
      '3. Checks if all resume fields are extractable',
      '4. Returns parseability score (0-100)',
    ],
    requestBody: {
      resume: 'JSON Resume object (required)',
      username: 'Username for PDF generation (required)',
      theme: 'Theme to use for PDF (optional, default: professional)',
    },
    response: {
      score: 'Parseability score (0-100)',
      rating: 'Excellent | Good | Fair | Needs Improvement | Poor',
      analysis: {
        contactInfo: 'Contact field extraction results',
        sections: 'Work/education/skills extraction results',
        keywords: 'Keyword density metrics',
      },
      theme: 'Theme used for PDF generation',
      metadata: 'PDF pages and text length',
      summary: 'Human-readable summary',
    },
    scoringBreakdown: {
      'Contact Information': '30 points',
      'Work Experience': '25 points',
      Education: '20 points',
      Skills: '25 points',
    },
  };
}
