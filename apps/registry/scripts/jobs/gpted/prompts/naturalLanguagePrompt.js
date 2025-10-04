/**
 * Generates the prompt for natural language description
 */
function getNaturalLanguagePrompt() {
  return `Transform the structured job information into a comprehensive, natural-language job description. Write it as if it were a professional job posting that would appear on a career site. Include all details about the role, company, requirements, and benefits in a flowing narrative format. Focus on using industry-standard terminology and keywords that would naturally appear in relevant resumes. Make sure to incorporate all the technical skills, qualifications, and responsibilities in a way that would maximize semantic matching with candidate resumes.`;
}

module.exports = { getNaturalLanguagePrompt };
