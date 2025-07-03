import { streamText, smoothStream } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

const errorHandler = (err) => err?.message || 'Something went wrong';

export async function POST(request) {
  try {
    const { messages, currentResume } = await request.json();

    // Prepend system context including resume (optional)
    const systemMessages = [
      {
        role: 'system',
        content: `You are a helpful career copilot. The user resume JSON: ${JSON.stringify(
          currentResume || {},
          null,
          2
        )}`,
      },
    ];

    const result = await streamText({
      model: openai('gpt-4.1'),
      messages: [...systemMessages, ...messages],
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
