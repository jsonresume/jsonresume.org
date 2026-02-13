import { z } from 'zod';
import crypto from 'crypto';

/**
 * Create a hash of content for cache invalidation
 */
export function hashContent(content) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(content))
    .digest('hex')
    .slice(0, 16);
}

export const insightsSchema = z.object({
  bullets: z.array(
    z.object({
      emoji: z.string().describe('A relevant emoji for this point'),
      title: z.string().describe('Short bold title (2-4 words)'),
      description: z.string().describe('Brief explanation (1-2 sentences)'),
    })
  ),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall match percentage based on skills and experience'),
  summary: z
    .string()
    .describe('One sentence summary of why this could be a good fit'),
});

export const SYSTEM_PROMPT = `You are a career advisor helping a job seeker understand why they might be a good fit for a specific role.

Analyze the resume and job posting, then provide:
1. 4-6 specific bullet points explaining why this person could be a strong candidate
2. Focus on concrete skill matches, relevant experience, and potential growth areas
3. Be honest but encouraging - mention any gaps constructively
4. Each bullet should have a relevant emoji, a short title, and a brief description

Consider:
- Direct skill matches between resume and job requirements
- Relevant experience and projects
- Transferable skills
- Company culture fit indicators
- Growth opportunities this role offers`;

/**
 * Build the user prompt from resume and job data
 */
export function buildInsightsPrompt(resume, job) {
  const parts = [
    `RESUME:\n${JSON.stringify(resume, null, 2)}`,
    `\nJOB POSTING:`,
    `Title: ${job.title}`,
    `Company: ${job.company}`,
  ];

  if (job.description) parts.push(`Description: ${job.description}`);

  if (job.skills?.length) {
    const names = job.skills
      .map((s) => (typeof s === 'string' ? s : s.name))
      .join(', ');
    parts.push(`Required Skills: ${names}`);
  }

  if (job.bonusSkills?.length) {
    const names = job.bonusSkills
      .map((s) => (typeof s === 'string' ? s : s.name))
      .join(', ');
    parts.push(`Bonus Skills: ${names}`);
  }

  if (job.location) {
    const loc =
      typeof job.location === 'string'
        ? job.location
        : `${job.location.city || ''}, ${job.location.region || ''}`;
    parts.push(`Location: ${loc}`);
  }

  if (job.remote) parts.push('Remote: Yes');

  if (job.salaryMin && job.salaryMax) {
    parts.push(
      `Salary Range: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
    );
  }

  parts.push(
    '\nProvide specific, actionable insights about why this person could be a good fit for this role.'
  );

  return parts.join('\n');
}
