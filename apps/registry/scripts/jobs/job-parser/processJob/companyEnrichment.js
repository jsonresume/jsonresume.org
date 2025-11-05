const { generateObject } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { jobDescriptionSchema } = require('../openaiFunction');
const { getCompanyContextPrompt } = require('../prompts');
const { getCompanyData } = require('../database');

/**
 * Enrich job with company data using Vercel AI SDK with structured outputs
 */
async function companyEnrichment(supabase, job, messages, company) {
  const companyDetails = await getCompanyData(supabase, company);

  if (companyDetails) {
    const companyContext = getCompanyContextPrompt(companyDetails);
    messages.push({
      role: 'system',
      content: companyContext,
    });
  }

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
  });

  return jobJson2;
}

module.exports = { companyEnrichment };
