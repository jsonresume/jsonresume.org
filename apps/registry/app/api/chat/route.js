import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { SYSTEM_PROMPT } from './config/systemPrompt';
import { RESUME_TOOL_SCHEMA } from './config/resumeToolSchema';
import { processToolResponse } from './utils/processToolResponse';

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const { messages, currentResume } = await req.json();

    const result = await generateText({
      model: openai('gpt-4', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      system: `${SYSTEM_PROMPT}\n\nCurrent resume state: ${JSON.stringify(
        currentResume,
        null,
        2
      )}`,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      tools: RESUME_TOOL_SCHEMA,
    });

    return processToolResponse(result);
  } catch (error) {
    logger.error({ error: error.message }, 'Chat API error');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
