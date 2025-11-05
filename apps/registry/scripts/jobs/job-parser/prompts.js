// Re-export all prompt generators
const { getJobProcessingPrompt } = require('./prompts/jobProcessingPrompt');
const { getCompanyContextPrompt } = require('./prompts/companyContextPrompt');
const { getNaturalLanguagePrompt } = require('./prompts/naturalLanguagePrompt');

module.exports = {
  getJobProcessingPrompt,
  getCompanyContextPrompt,
  getNaturalLanguagePrompt,
};
