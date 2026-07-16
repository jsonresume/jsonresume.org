/**
 * Embedding generation for the jobs matcher — resume embeddings and HyDE
 * (hypothetical document embeddings) blended toward the ideal job posting.
 */
import { embed, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { interpolate } from './vectorMath';

/** Generate a HyDE embedding from resume text */
export async function generateHydeEmbedding(resumeText) {
  const { text: hydePosting } = await generateText({
    model: openai('gpt-4.1-mini'),
    system: `You are a job posting generator. Given a candidate's background, write a realistic job posting that would be their IDEAL next role. Write it like a real HN "Who is Hiring" post. Include: company type, role title, tech stack, requirements, location, salary range, remote policy. Output ONLY the job posting text. Make it specific and keyword-rich.`,
    prompt: `Candidate background:\n${resumeText}`,
    maxTokens: 400,
  });

  const [resumeResult, hydeResult] = await Promise.all([
    embed({
      model: openai.embedding('text-embedding-3-large'),
      value: resumeText,
    }),
    embed({
      model: openai.embedding('text-embedding-3-large'),
      value: hydePosting,
    }),
  ]);

  return interpolate(hydeResult.embedding, resumeResult.embedding, 0.35);
}

export async function getResumeEmbedding(resume) {
  const text = [
    resume.basics?.label,
    resume.basics?.summary,
    ...(resume.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
    ...(resume.work || []).map(
      (w) => `${w.position} at ${w.name}: ${w.summary || ''}`
    ),
    ...(resume.education || []).map((e) =>
      `${e.studyType || ''} ${e.area || ''} at ${e.institution || ''}`.trim()
    ),
    ...(resume.projects || []).map(
      (p) =>
        `${p.name || ''}: ${p.description || ''} ${(p.highlights || []).join(
          ', '
        )}`
    ),
    ...(resume.certificates || []).map((c) => c.name || ''),
    ...(resume.languages || []).map((l) => `${l.language}: ${l.fluency || ''}`),
  ]
    .filter(Boolean)
    .join('\n');

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });
  return { embedding, text };
}
