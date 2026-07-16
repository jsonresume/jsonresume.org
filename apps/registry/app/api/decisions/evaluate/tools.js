import { tool } from 'ai';
import { z } from 'zod';

/**
 * Zod tool schemas for each decision criterion.
 * AI SDK v5 uses the tool() helper with inputSchema.
 */
export const tools = {
  checkRequiredSkills: tool({
    description:
      "Evaluate the candidate's skill match percentage with required job skills. Calculate what percentage of required skills they have. IMPORTANT: Search the ENTIRE resume including work.highlights, work.summary, projects.highlights, and education - not just the skills array. Skills and technologies can be mentioned anywhere. Be realistic - candidates can learn missing skills.",
    inputSchema: z.object({
      matchPercentage: z
        .number()
        .min(0)
        .max(1)
        .describe(
          'Percentage of required skills the candidate has (0.0 to 1.0). E.g., 0.75 means 75% match. >=0.8 is excellent, >=0.5 is acceptable, <0.5 is insufficient.'
        ),
      matchedSkills: z
        .array(z.string())
        .describe('List of required skills the candidate HAS'),
      missingSkills: z
        .array(z.string())
        .describe('List of required skills the candidate is missing'),
      reasoning: z
        .string()
        .describe(
          'Brief explanation of the skill match percentage and what it means'
        ),
    }),
  }),

  checkExperience: tool({
    description:
      'Evaluate if the candidate has enough years of experience for the role.',
    inputSchema: z.object({
      hasEnoughExperience: z
        .boolean()
        .describe('True if experience meets or exceeds requirement'),
      candidateYears: z.number().describe('Total years of relevant experience'),
      requiredYears: z.number().describe('Years of experience required by job'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkWorkRights: tool({
    description:
      'Check if the candidate has legal work authorization if required by the job.',
    inputSchema: z.object({
      hasWorkRights: z
        .boolean()
        .describe('True if work rights verified or not required'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkLocation: tool({
    description:
      'Evaluate location compatibility considering remote work options.',
    inputSchema: z.object({
      locationCompatible: z
        .boolean()
        .describe('True if location is compatible'),
      isRemote: z.boolean().describe('True if job allows remote work'),
      candidateLocation: z.string().describe('Candidate location'),
      jobLocation: z.string().describe('Job location'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkTimezone: tool({
    description:
      'Check timezone compatibility if location failed. Only relevant for remote positions with timezone requirements.',
    inputSchema: z.object({
      timezoneCompatible: z
        .boolean()
        .describe('True if timezones are compatible'),
      candidateTimezone: z.string().describe('Candidate timezone'),
      requiredTimezone: z.string().describe('Required timezone'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkAvailability: tool({
    description: 'Check if candidate can start within the required timeframe.',
    inputSchema: z.object({
      availableInTime: z
        .boolean()
        .describe('True if available within required timeframe'),
      candidateWeeks: z.number().describe('Weeks until candidate is available'),
      requiredWeeks: z
        .number()
        .describe('Maximum weeks job is willing to wait'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkSalary: tool({
    description: 'Evaluate if salary expectations align with the job offer.',
    inputSchema: z.object({
      salaryAligned: z
        .boolean()
        .describe('True if salary expectations are compatible'),
      candidateExpectation: z
        .number()
        .optional()
        .describe('Candidate salary expectation'),
      jobRange: z
        .object({
          min: z.number(),
          max: z.number(),
        })
        .optional()
        .describe('Job salary range'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),
};
