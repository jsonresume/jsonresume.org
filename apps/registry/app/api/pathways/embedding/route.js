import { NextResponse } from 'next/server';
import { generateText, embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '@/lib/logger';
import { retryWithBackoff } from '@/lib/retry';

/**
 * Generate a professional description from resume using AI
 */
async function generateResumeDescription(resume) {
  const { text: resumeDescription } = await generateText({
    model: openai('gpt-4o-mini'),
    system:
      "You are a professional resume analyzer. Create a detailed professional summary that describes this candidate's background, skills, and experience in natural language. Focus on their expertise, achievements, and what makes them unique. Write it in a style similar to job descriptions to optimize for semantic matching. Do not include the candidates name. Make sure to include everything significant to the users career. Describe the type of industries they have experience in.",
    prompt: JSON.stringify(resume),
    temperature: 0.85,
  });

  return resumeDescription;
}

/**
 * Create embedding from text
 */
async function createEmbedding(text) {
  const { embedding: rawEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });

  // Pad to 3072 dimensions if needed
  const desiredLength = 3072;
  let embedding = rawEmbedding;
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  return embedding;
}

/**
 * POST /api/pathways/embedding
 * Generate an embedding for a resume
 */
export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const { resume } = await request.json();

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      );
    }

    logger.info('Generating embedding for resume');

    // Generate description and embedding (with retry for transient failures)
    const description = await retryWithBackoff(
      () => generateResumeDescription(resume),
      { maxAttempts: 3 }
    );
    const embedding = await retryWithBackoff(
      () => createEmbedding(description),
      { maxAttempts: 3 }
    );

    logger.info(
      {
        descriptionLength: description.length,
        embeddingLength: embedding.length,
      },
      'Generated embedding from resume'
    );

    return NextResponse.json({ embedding, description });
  } catch (error) {
    logger.error({ error: error.message }, 'Error generating embedding');
    return NextResponse.json(
      { error: 'Failed to generate embedding', details: error.message },
      { status: 500 }
    );
  }
}
