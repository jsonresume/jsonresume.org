/* eslint-disable no-console */
const { generateObject } = require('ai');
const { openai } = require('@ai-sdk/openai');
const {
  jobDescriptionSchema,
  parseJobDescription,
  JOB_DESCRIPTION_SCHEMA_VERSION,
} = require('@jsonresume/job-schema');
const { getCompanyContextPrompt } = require('../prompts');
const { getCompanyData } = require('../database');

/**
 * Enrich job with company data using Vercel AI SDK with structured outputs
 */
async function companyEnrichment(supabase, job, messages, company) {
  const companyDetails = await getCompanyData(supabase, company);
  let companyContext = '';

  if (companyDetails) {
    console.log({ jobId: job.id, companyDetails });
    companyContext = getCompanyContextPrompt(companyDetails);
    messages.push({
      role: 'system',
      content: companyContext,
    });
  }

  console.log({ jobId: job.id, messages });

  // Build system prompt from all system messages
  const systemPrompts = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');

  const { object: jobJson2 } = await generateObject({
    model: openai('gpt-5-mini'),
    system: systemPrompts,
    prompt: 'Re-parse the job description with the additional company context',
    schema: jobDescriptionSchema,
    temperature: 0.75,
  });

  const parsedJob = parseJobDescription(jobJson2);
  const enrichedJob = {
    ...parsedJob,
    schemaVersion: JOB_DESCRIPTION_SCHEMA_VERSION,
    companyContext: companyContext || undefined,
  };

  console.log({ jobId: job.id, jobJson2: enrichedJob });

  return enrichedJob;
}

module.exports = { companyEnrichment };
