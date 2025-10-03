const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');

/**
 * Generates a professional description from resume data using AI
 * @param {Object} resume - The resume object
 * @returns {Promise<string>} Generated description
 */
export async function generateResumeDescription(resume) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
  }

  const { text: resumeDescription } = await generateText({
    model: openai('gpt-4o-mini', {
      apiKey: process.env.OPENAI_API_KEY,
    }),
    system:
      "You are a professional resume analyzer. Create a detailed professional summary that describes this candidate's background, skills, and experience in natural language. Focus on their expertise, achievements, and what makes them unique. Write it in a style similar to job descriptions to optimize for semantic matching. Do not include the candidates name. Make sure to include everything significant to the users career. Describe the type of industries they have experience in.",
    prompt: JSON.stringify(resume),
    temperature: 0.85,
  });

  console.log({ resumeDescription });
  return resumeDescription;
}
