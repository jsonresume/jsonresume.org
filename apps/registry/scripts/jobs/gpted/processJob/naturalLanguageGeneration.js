const { getNaturalLanguagePrompt } = require('../prompts');

/**
 * Generate natural language description
 */
async function naturalLanguageGeneration(openaiClient, job, messages) {
  messages.push({
    role: 'system',
    content: getNaturalLanguagePrompt(),
  });

  const chat3 = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    temperature: 0.75,
    messages,
  });

  const content = chat3.choices[0].message.content;
  console.log({ jobId: job.id, content });

  return content;
}

module.exports = { naturalLanguageGeneration };
