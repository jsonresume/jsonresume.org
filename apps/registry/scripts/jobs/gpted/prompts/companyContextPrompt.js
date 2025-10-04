/**
 * Generates the prompt for company context enrichment
 */
function getCompanyContextPrompt(companyDetails) {
  return `Here is more information about the company;

        ${companyDetails}
        `;
}

module.exports = { getCompanyContextPrompt };
