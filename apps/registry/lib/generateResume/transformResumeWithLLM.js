import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '../logger';

const SYSTEM_PROMPT = `You are a professional resume editor. Given a resume and user instructions, return ONLY a JSON object containing the fields that should be changed.

RULES:
1. Return ONLY the fields that need modification, not the entire resume
2. NEVER invent fake information - only modify existing content
3. Keep dates, company names, and facts accurate
4. You may rewrite summaries and descriptions to emphasize aspects
5. You may adjust the label/title to better match target roles

RESPONSE FORMAT:
Return a JSON object with only the changed fields. Use dot notation paths for nested fields.
Example: {"basics.label": "Senior Frontend Developer", "basics.summary": "New summary text..."}

For array items, use index: {"work.0.summary": "Updated summary for first job"}
To reorder skills, return the full skills array: {"skills": [...]}`;

/**
 * Deep set a value in an object using a dot-notation path
 */
function setByPath(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextArray = !isNaN(parseInt(nextKey, 10));

    if (!(key in current)) {
      current[key] = isNextArray ? [] : {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Apply changes from LLM response to the original resume
 */
function applyChanges(resume, changes) {
  // Deep clone the resume
  const result = JSON.parse(JSON.stringify(resume));

  for (const [path, value] of Object.entries(changes)) {
    if (path.includes('.')) {
      setByPath(result, path, value);
    } else {
      result[path] = value;
    }
  }

  return result;
}

/**
 * Transform a resume using an LLM based on a user prompt
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

    // Only send essential resume data to reduce tokens
    const essentialResume = {
      basics: resume.basics,
      work: resume.work?.slice(0, 5), // First 5 jobs
      skills: resume.skills?.slice(0, 10), // First 10 skills
      education: resume.education,
    };

    const result = await generateText({
      model: openai('gpt-4.1-mini'),
      system: SYSTEM_PROMPT,
      prompt: `Resume:\n${JSON.stringify(
        essentialResume,
        null,
        2
      )}\n\nRequest: ${prompt}\n\nReturn ONLY a JSON object with the changed fields.`,
    });

    const duration = Date.now() - startTime;
    logger.info(
      { duration, prompt: prompt.substring(0, 100) },
      'LLM transformation completed'
    );

    // Parse the changes JSON
    const text = result.text.trim();
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      text,
    ];
    const jsonStr = jsonMatch[1].trim();
    const changes = JSON.parse(jsonStr);

    // Apply changes to original resume
    return applyChanges(resume, changes);
  } catch (error) {
    logger.error(
      { error: error.message, prompt: prompt.substring(0, 100) },
      'LLM transformation failed'
    );
    return resume;
  }
}
