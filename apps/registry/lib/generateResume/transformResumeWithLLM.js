import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '../logger';

const SYSTEM_PROMPT = `You are a professional resume editor. Your task is to modify a JSON Resume based on user instructions.

IMPORTANT RULES:
1. ONLY modify content that is relevant to the user's request
2. NEVER invent fake information, companies, or experiences
3. Keep all dates, company names, and factual information accurate
4. You may rewrite summaries, highlights, and descriptions to emphasize certain aspects
5. You may reorder items to prioritize relevant experience
6. You may adjust the label/title to better match the target role
7. Preserve the overall structure and all existing sections
8. Make the changes sound natural and professional

Return the complete modified resume in JSON Resume format.`;

/**
 * Transform a resume using an LLM based on a user prompt
 * @param {Object} resume - The original JSON Resume object
 * @param {string} prompt - The user's transformation prompt
 * @returns {Promise<Object>} The transformed resume
 */
export async function transformResumeWithLLM(resume, prompt) {
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('OPENAI_API_KEY not set, skipping LLM transformation');
    return resume;
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return resume;
  }

  const startTime = Date.now();

  try {
    logger.info(
      { prompt: prompt.substring(0, 100) },
      'Starting LLM resume transformation'
    );

    const result = await generateText({
      model: openai('gpt-4.1-mini'),
      system: SYSTEM_PROMPT,
      prompt: `Here is the original resume:\n\n${JSON.stringify(
        resume,
        null,
        2
      )}\n\nUser request: ${prompt}\n\nPlease modify the resume according to the user's request and return the complete updated resume as valid JSON.`,
    });

    const duration = Date.now() - startTime;
    logger.info(
      { duration, prompt: prompt.substring(0, 100) },
      'LLM transformation completed'
    );

    // Parse the JSON from the response
    const text = result.text.trim();
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      text,
    ];
    const jsonStr = jsonMatch[1].trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error(
      { error: error.message, prompt: prompt.substring(0, 100) },
      'LLM transformation failed'
    );
    // Return original resume on error
    return resume;
  }
}
