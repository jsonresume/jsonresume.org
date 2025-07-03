import { streamText, smoothStream, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
// Define the update_resume tool with Zod schema
export const updateResume = tool({
  // name inferred as key when passed in array; ensure matches 'updateResume'
  name: 'updateResume',
  description: 'Update specific sections of the resume with new information',
  parameters: z.object({
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
});

export const runtime = 'edge';

const errorHandler = (err) => err?.message || 'Something went wrong';

export async function POST(request) {
  try {
    const { messages, currentResume } = await request.json();

    // Prepend system context including resume (optional)
    const systemMessages = [
      {
        role: 'system',
        content: `You are a helpful career copilot. When the user requests changes, generally ADD SAMPLE DATA directly instead of asking follow-up questions, unless absolutely necessary. The current resume JSON: ${JSON.stringify(
          currentResume || {},
          null,
          2
        )}`,
      },
    ];

    const result = await streamText({
      model: openai('gpt-4.1'),
      messages: [...systemMessages, ...messages],
      tools: { updateResume },
      experimental_transform: smoothStream({
        delayInMs: 20,
        chunking: 'word',
      }),
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: errorHandler(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
