/* eslint-disable no-console */
const { generateObject } = require('ai');
const { openai } = require('@ai-sdk/openai');
const {
  jobDescriptionSchema,
  parseJobDescription,
  JOB_DESCRIPTION_SCHEMA_VERSION,
} = require('@jsonresume/job-schema');
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

  const parsedJob = parseJobDescription(jobJson);
  const details1 = JSON.stringify({
    ...parsedJob,
    schemaVersion: JOB_DESCRIPTION_SCHEMA_VERSION,
  });

  console.log(JSON.stringify(parsedJob, null, 2));
  console.log({ jobId: job.id, jobJson: parsedJob });

  // Build messages array for next steps
  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: 'Parse this job description into structured data',
    },
  ];

  return { messages, details1, jobJson: parsedJob };
}

module.exports = { initialProcessing };
