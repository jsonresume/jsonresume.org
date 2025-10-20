const { generateObject } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { jobDescriptionSchema } = require('../openaiFunction');
const { getJobProcessingPrompt } = require('../prompts');

/**
 * Perform initial job processing using Vercel AI SDK with structured outputs
 */
async function initialProcessing(job) {
  const systemPrompt = getJobProcessingPrompt(job.content);

  console.log('Starting AI processing for job:', job.id);
  const { object: jobJson } = await generateObject({
    model: openai('gpt-5-mini'),
    system: systemPrompt,
    prompt: 'Parse this job description into structured data',
    schema: jobDescriptionSchema,
    temperature: 0.75,
  });

  const details1 = JSON.stringify(jobJson);

  console.log(JSON.stringify(details1, null, 2));
  console.log({ jobId: job.id, jobJson });

  // Build messages array for next steps
  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: 'Parse this job description into structured data',
    },
  ];

  return { messages, details1, jobJson };
}

module.exports = { initialProcessing };
