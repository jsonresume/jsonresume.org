const jobSchema = require('../jobSchema');
const { getInstructions } = require('./jobProcessing/instructions');
const exampleJobData = require('./jobProcessing/exampleJobData');

/**
 * Generates the system prompt for initial job processing
 */
function getJobProcessingPrompt(jobDescription) {
  const instructions = getInstructions(jobSchema);
  const exampleJSON = JSON.stringify(exampleJobData, null, 2);

  return `${instructions}

### Example Output:
To help guide you, here is an example of a properly formatted job description in JSON:

${exampleJSON}

**Example Job Description**:
   Here is the job description for you to process:
   ${jobDescription}

### Final Output:
Using the instructions and example above, transform the provided job description into a structured JSON document.`;
}

module.exports = { getJobProcessingPrompt };
