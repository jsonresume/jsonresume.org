const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { jobDescriptionTool } = require('../openaiFunction');
const { getJobProcessingPrompt } = require('../prompts');

/**
 * Perform initial job processing using Vercel AI SDK
 */
async function initialProcessing(job) {
  const systemPrompt = getJobProcessingPrompt(job.content);

  console.log('Starting AI processing for job:', job.id);
  const result = await generateText({
    model: openai('gpt-4'),
    system: systemPrompt,
    prompt: 'Parse this job description into structured data',
    tools: {
      jobDescriptionToSchema: jobDescriptionTool,
    },
    toolChoice: 'required',
    temperature: 0.75,
  });

  // Extract tool call result
  const toolCall = result.toolCalls[0];
  const jobJson = toolCall.args;
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
