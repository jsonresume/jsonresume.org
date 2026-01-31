import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { logger } from '../logger';

// JSON Resume schema for structured output
const resumeSchema = z.object({
  basics: z
    .object({
      name: z.string().optional(),
      label: z.string().optional(),
      image: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      url: z.string().optional(),
      summary: z.string().optional(),
      location: z
        .object({
          address: z.string().optional(),
          postalCode: z.string().optional(),
          city: z.string().optional(),
          countryCode: z.string().optional(),
          region: z.string().optional(),
        })
        .optional(),
      profiles: z
        .array(
          z.object({
            network: z.string().optional(),
            username: z.string().optional(),
            url: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  work: z
    .array(
      z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        url: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),
  volunteer: z
    .array(
      z.object({
        organization: z.string().optional(),
        position: z.string().optional(),
        url: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string().optional(),
        url: z.string().optional(),
        area: z.string().optional(),
        studyType: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        score: z.string().optional(),
        courses: z.array(z.string()).optional(),
      })
    )
    .optional(),
  awards: z
    .array(
      z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        awarder: z.string().optional(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string().optional(),
        date: z.string().optional(),
        issuer: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .optional(),
  publications: z
    .array(
      z.object({
        name: z.string().optional(),
        publisher: z.string().optional(),
        releaseDate: z.string().optional(),
        url: z.string().optional(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().optional(),
        level: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string().optional(),
        fluency: z.string().optional(),
      })
    )
    .optional(),
  interests: z
    .array(
      z.object({
        name: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
    )
    .optional(),
  references: z
    .array(
      z.object({
        name: z.string().optional(),
        reference: z.string().optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        url: z.string().optional(),
      })
    )
    .optional(),
  meta: z
    .object({
      canonical: z.string().optional(),
      version: z.string().optional(),
      lastModified: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
});

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

    const result = await generateObject({
      model: openai('gpt-4.1-mini'),
      schema: resumeSchema,
      system: SYSTEM_PROMPT,
      prompt: `Here is the original resume:\n\n${JSON.stringify(
        resume,
        null,
        2
      )}\n\nUser request: ${prompt}\n\nPlease modify the resume according to the user's request and return the complete updated resume.`,
    });

    const duration = Date.now() - startTime;
    logger.info(
      { duration, prompt: prompt.substring(0, 100) },
      'LLM transformation completed'
    );

    return result.object;
  } catch (error) {
    logger.error(
      { error: error.message, prompt: prompt.substring(0, 100) },
      'LLM transformation failed'
    );
    // Return original resume on error
    return resume;
  }
}
