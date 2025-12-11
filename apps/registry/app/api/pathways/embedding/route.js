import { NextResponse } from 'next/server';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { logger } from '@/lib/logger';

/**
 * Generate a professional description from a resume
 */
function generateResumeDescription(resume) {
  const parts = [];

  if (resume.basics?.name) {
    parts.push(`${resume.basics.name}`);
  }
  if (resume.basics?.label) {
    parts.push(`${resume.basics.label}`);
  }
  if (resume.basics?.summary) {
    parts.push(resume.basics.summary);
  }

  // Add work experience
  if (resume.work?.length > 0) {
    const workDesc = resume.work
      .slice(0, 3)
      .map((w) => `${w.position} at ${w.name}`)
      .join(', ');
    parts.push(`Experience: ${workDesc}`);

    // Add highlights
    const highlights = resume.work
      .flatMap((w) => w.highlights || [])
      .slice(0, 5);
    if (highlights.length > 0) {
      parts.push(`Key achievements: ${highlights.join('. ')}`);
    }
  }

  // Add skills
  if (resume.skills?.length > 0) {
    const allKeywords = resume.skills.flatMap((s) => [
      s.name,
      ...(s.keywords || []),
    ]);
    parts.push(`Skills: ${allKeywords.slice(0, 15).join(', ')}`);
  }

  // Add education
  if (resume.education?.length > 0) {
    const eduDesc = resume.education
      .slice(0, 2)
      .map(
        (e) => `${e.studyType || 'Degree'} in ${e.area} from ${e.institution}`
      )
      .join('; ');
    parts.push(`Education: ${eduDesc}`);
  }

  return parts.join('. ');
}

/**
 * POST /api/pathways/embedding
 * Generate embedding for a resume
 */
export async function POST(request) {
  try {
    const { resume } = await request.json();

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      );
    }

    // Generate description
    const description = generateResumeDescription(resume);

    // Generate embedding
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: description,
    });

    logger.info(
      {
        descriptionLength: description.length,
        embeddingLength: embedding.length,
      },
      'Generated resume embedding'
    );

    return NextResponse.json({
      success: true,
      embedding,
      description,
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error generating embedding');
    return NextResponse.json(
      { error: 'Failed to generate embedding', details: error.message },
      { status: 500 }
    );
  }
}
