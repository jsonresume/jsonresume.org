const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { jobDescriptionTool } = require('../openaiFunction');
const { getCompanyContextPrompt } = require('../prompts');
const { getCompanyData } = require('../database');

/**
 * Enrich job with company data using Vercel AI SDK
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

  const result = await generateText({
    model: openai('gpt-4'),
    system: systemPrompts,
    prompt: 'Re-parse the job description with the additional company context',
    tools: {
      jobDescriptionToSchema: jobDescriptionTool,
    },
    toolChoice: 'required',
    temperature: 0.75,
  });

  // Extract tool call result
  const toolCall = result.toolCalls[0];
  const jobJson2 = toolCall.args;
  console.log({ jobId: job.id, jobJson2 });

  return jobJson2;
}

module.exports = { companyEnrichment };
