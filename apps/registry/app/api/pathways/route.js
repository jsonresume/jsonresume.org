import { streamText, smoothStream, tool, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { jobTools } from './tools/jobTools';

// Define the update_resume tool with simplified Zod schema
export const updateResume = tool({
  description:
    'Update specific sections of the resume with new information. Pass the changes object with the sections to update.',
  parameters: z.object({
    changes: z
      .record(z.any())
      .describe(
        'Object containing resume sections to update (basics, work, education, skills). Each section follows JSON Resume schema.'
      ),
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
1. **Resume Updates** - Modify the user's resume using the updateResume tool
2. **Job Filtering** - Mark jobs as read/interested/hidden based on criteria
3. **Job Search** - Focus the graph on specific jobs matching a query
4. **Job Insights** - Analyze salary ranges, top companies, required skills
5. **Refresh Matches** - Update job recommendations after resume changes

When updating the resume with updateResume, structure the changes object following JSON Resume schema:
- basics: { name, label, email, phone, url, summary, location: { city, region, countryCode }, profiles: [{ network, username, url }] }
- work: [{ name, position, startDate, endDate, summary, highlights: [], _delete: true to remove }]
- education: [{ institution, area, studyType, startDate, endDate, _delete: true to remove }]
- skills: [{ name, level, keywords: [], _delete: true to remove }]

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
