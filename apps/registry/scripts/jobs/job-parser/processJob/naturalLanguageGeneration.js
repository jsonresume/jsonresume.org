const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { getNaturalLanguagePrompt } = require('../prompts');

/**
 * Generate natural language description using Vercel AI SDK
 */
async function naturalLanguageGeneration(job, messages) {
  const systemPrompt = getNaturalLanguagePrompt();

  // Convert messages to AI SDK format (exclude system messages, add as system param)
  const userMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const { text: content } = await generateText({
    model: openai.responses('gpt-5-mini'),
    messages: userMessages,
    system: systemPrompt,
  });

  return content;
}

module.exports = { naturalLanguageGeneration };
