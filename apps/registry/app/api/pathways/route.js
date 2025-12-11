import { streamText, smoothStream, tool, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { jobTools } from './tools/jobTools';

// Define the update_resume tool with strict JSON Resume schema
export const updateResume = tool({
  description: 'Update specific sections of the resume with new information',
  inputSchema: z.object({
    changes: z.object({
      basics: z
        .object({
          name: z.string().optional(),
          label: z.string().optional(),
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
            technologies: z.array(z.string()).optional(),
            _delete: z.boolean().optional(),
          })
        )
        .optional(),
      education: z
        .array(
          z.object({
            institution: z.string().optional(),
            area: z.string().optional(),
            studyType: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            score: z.string().optional(),
            _delete: z.boolean().optional(),
          })
        )
        .optional(),
      skills: z
        .array(
          z.object({
            name: z.string().optional(),
            level: z.string().optional(),
            keywords: z.array(z.string()).optional(),
            _delete: z.boolean().optional(),
          })
        )
        .optional(),
    }),
    explanation: z
      .string()
      .describe('Friendly explanation of the changes being made'),
  }),
  execute: async ({ changes, explanation }) => {
    // This will be handled client-side by the useResumeUpdater hook
    return {
      success: true,
      changes,
      explanation,
      message: explanation || 'Resume updated',
    };
  },
});

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a helpful career copilot that helps users navigate their job search.

You have access to the following capabilities:
1. **Resume Updates** - Modify the user's resume (basics, work, education, skills)
2. **Job Filtering** - Mark jobs as read/interested/hidden based on criteria
3. **Job Search** - Focus the graph on specific jobs matching a query
4. **Job Insights** - Analyze salary ranges, top companies, required skills
5. **Refresh Matches** - Update job recommendations after resume changes

When the user asks to update their resume, ADD SAMPLE DATA directly instead of asking
follow-up questions, unless absolutely necessary.

When the user wants to manage jobs (mark as read, hide, etc.), use the filterJobs tool.
When they want to find specific jobs, use the showJobs tool.
When they ask about job statistics, use the getJobInsights tool.
After significant resume changes, suggest refreshing job matches.

The matched jobs graph shows opportunities based on resume similarity. Users can:
- Use arrow keys to navigate between job nodes
- Press 'M' to mark a job as read
- Click jobs to see details

Current resume:
`;

const errorHandler = (err) => err?.message || 'Something went wrong';

export async function POST(request) {
  try {
    const { messages, currentResume } = await request.json();

    const result = await streamText({
      model: openai('gpt-4.1'),
      system: `${SYSTEM_PROMPT}${JSON.stringify(currentResume || {}, null, 2)}`,
      messages: convertToModelMessages(messages),
      tools: {
        updateResume,
        ...jobTools,
      },
      experimental_transform: smoothStream({
        delayInMs: 20,
        chunking: 'word',
      }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: errorHandler(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
