import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { tools } from './tools';
import {
  buildJobContext,
  buildPreferencesInfo,
  buildEvaluationPrompt,
} from './prompt';

export async function POST(request) {
  try {
    const { resume, job, preferences = {} } = await request.json();

    if (!resume || !job) {
      return NextResponse.json(
        { error: 'Resume and job are required' },
        { status: 400 }
      );
    }

    // Parse job GPT content if available
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};

    // Prepare FULL resume context for AI - send everything!
    const resumeContext = JSON.stringify(resume, null, 2);
    const jobContext = JSON.stringify(buildJobContext(job, gptJob), null, 2);
    const preferencesInfo = buildPreferencesInfo(preferences);

    const prompt = buildEvaluationPrompt({
      resumeContext,
      jobContext,
      preferencesInfo,
      preferences,
    });

    // Call AI with tool definitions
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      tools,
      maxSteps: 10, // Allow multiple tool calls
    });

    // Process tool call results
    const decisions = {};
    if (result.toolCalls) {
      for (const toolCall of result.toolCalls) {
        decisions[toolCall.toolName] = toolCall.input; // Use .input instead of .args
      }
    } else {
      logger.warn(
        { job: job.title, company: job.company },
        'AI evaluation returned no tool calls'
      );
    }

    return NextResponse.json({ decisions });
  } catch (error) {
    logger.error(
      { error: error.message, stack: error.stack },
      'Error evaluating match'
    );
    return NextResponse.json(
      { error: 'Failed to evaluate match', details: error.message },
      { status: 500 }
    );
  }
}
