import { tool } from 'ai';
import { z } from 'zod';

/**
 * Tool to filter/mark multiple jobs based on criteria
 */
export const filterJobs = tool({
  description: `Mark multiple jobs based on criteria like company name, industry keywords,
    salary range, or job type. Use this when users say things like "mark all gambling jobs as read"
    or "hide all jobs below $100k" or "I'm interested in all remote jobs".`,
  inputSchema: z.object({
    criteria: z
      .object({
        companies: z
          .array(z.string())
          .optional()
          .describe('Company names to match (partial match)'),
        keywords: z
          .array(z.string())
          .optional()
          .describe('Keywords to search in title, description, skills'),
        industries: z
          .array(z.string())
          .optional()
          .describe('Industry keywords like "gambling", "crypto", "finance"'),
        salaryMin: z
          .number()
          .optional()
          .describe('Minimum salary in thousands (e.g., 100 for $100k)'),
        salaryMax: z
          .number()
          .optional()
          .describe('Maximum salary in thousands'),
        remoteOnly: z.boolean().optional().describe('Only match remote jobs'),
        jobTypes: z
          .array(z.string())
          .optional()
          .describe('Job types like "Full-time", "Contract", "Part-time"'),
      })
      .describe('Criteria to match jobs'),
    action: z
      .enum(['mark_read', 'mark_interested', 'mark_hidden', 'unmark'])
      .describe('Action to perform on matching jobs'),
  }),
  execute: async ({ criteria, action }) => {
    return {
      success: true,
      criteria,
      action,
      message: `Ready to ${action.replace(
        '_',
        ' '
      )} jobs matching your criteria`,
    };
  },
});

/**
 * Tool to focus/highlight specific jobs in the graph
 */
export const showJobs = tool({
  description: `Focus the graph view on jobs matching a search query. Use this when users
    want to see specific types of jobs or explore opportunities. Examples: "show me all
    senior roles", "find Python jobs", "what React positions are available?"`,
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        'Search query to filter jobs (searches title, company, skills, description)'
      ),
    sortBy: z
      .enum(['similarity', 'salary', 'date'])
      .optional()
      .describe('How to sort the results'),
  }),
  execute: async ({ query, sortBy }) => {
    return {
      success: true,
      query,
      sortBy: sortBy || 'similarity',
      message: `Filtering graph to show jobs matching "${query}"`,
    };
  },
});

/**
 * Tool to get job recommendations based on resume
 */
export const getJobInsights = tool({
  description: `Provide insights about the matched jobs. Use when users ask things like
    "what's the salary range?", "which companies are hiring?", "what skills are most in demand?"`,
  inputSchema: z.object({
    insightType: z
      .enum([
        'salary_range',
        'top_companies',
        'common_skills',
        'job_types',
        'locations',
      ])
      .describe('Type of insight to provide'),
  }),
  execute: async ({ insightType }) => {
    return {
      success: true,
      insightType,
      message: `Analyzing ${insightType.replace(
        '_',
        ' '
      )} from your matched jobs`,
    };
  },
});

/**
 * Tool to refresh the job graph with current resume
 */
export const refreshJobMatches = tool({
  description: `Refresh the job matches after resume updates. Use this after making
    significant resume changes to see updated job recommendations.`,
  inputSchema: z.object({
    reason: z.string().optional().describe('Why the refresh was requested'),
  }),
  execute: async ({ reason }) => {
    return {
      success: true,
      action: 'refresh_graph',
      reason,
      message: 'Refreshing job matches based on your updated resume',
    };
  },
});

/**
 * Tool to save feedback about a job and mark it as read
 */
export const saveJobFeedback = tool({
  description: `Save the user's feedback about a specific job and mark it as read.
    Use this after the user explains why they're marking a job as read/dismissed/interested.
    This captures their reasoning for future reference and learning.`,
  inputSchema: z.object({
    jobId: z.string().describe('The unique ID of the job'),
    jobTitle: z.string().optional().describe('The job title for context'),
    jobCompany: z.string().optional().describe('The company name for context'),
    feedback: z
      .string()
      .describe("The user's feedback/reasoning about the job"),
    sentiment: z
      .enum(['interested', 'not_interested', 'maybe', 'applied', 'dismissed'])
      .describe("The user's overall sentiment about the job"),
  }),
  execute: async ({ jobId, jobTitle, jobCompany, feedback, sentiment }) => {
    return {
      success: true,
      jobId,
      jobTitle,
      jobCompany,
      feedback,
      sentiment,
      action: 'save_feedback',
      message: `Feedback saved for ${jobTitle || jobId}`,
    };
  },
});

export const jobTools = {
  filterJobs,
  showJobs,
  getJobInsights,
  refreshJobMatches,
  saveJobFeedback,
};
