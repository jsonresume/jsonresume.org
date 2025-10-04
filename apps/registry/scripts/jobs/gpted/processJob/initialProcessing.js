const jobDescriptionToSchemaFunction = require('../openaiFunction');
const { getJobProcessingPrompt } = require('../prompts');

/**
 * Perform initial job processing with OpenAI
 */
async function initialProcessing(openaiClient, job) {
  const messages = [
    {
      role: 'system',
      content: getJobProcessingPrompt(job.content),
    },
  ];

  console.log('Starting OpenAI processing for job:', job.id);
  const chat1 = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    temperature: 0.75,
    messages,
    functions: [jobDescriptionToSchemaFunction],
    function_call: 'auto',
  });

  const details1 = chat1.choices[0].message.function_call?.arguments;
  console.log(JSON.stringify(details1, null, 2));
  const jobJson = JSON.parse(details1);
  console.log({ jobId: job.id, jobJson });

  return { messages, details1, jobJson };
}

module.exports = { initialProcessing };
