/**
 * LLM reranking for job matches — scores each job 1-10 against the candidate's
 * search context in small batches.
 */
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const RERANK_BATCH_SIZE = 5;

/** LLM reranking: score each job 1-10 against the search context. */
export async function rerankJobs(jobs, resumeText, searchPrompt) {
  const context = searchPrompt
    ? `The candidate is specifically looking for: ${searchPrompt}\n\nTheir background:\n${resumeText}`
    : `Candidate background:\n${resumeText}`;

  const batches = [];
  for (let i = 0; i < jobs.length; i += RERANK_BATCH_SIZE) {
    batches.push(jobs.slice(i, i + RERANK_BATCH_SIZE));
  }

  const allScores = [];
  for (const batch of batches) {
    const promises = batch.map(async (job) => {
      const skillStr = (job.skills || [])
        .map((s) => {
          const name = s.name || s;
          const kws = (s.keywords || []).join(', ');
          return kws ? `${name} (${kws})` : name;
        })
        .join(', ');
      const jobText = [
        `Title: ${job.title}`,
        `Company: ${job.company}`,
        job.location ? `Location: ${job.location}` : null,
        job.remote ? `Remote: ${job.remote}` : null,
        job.salary ? `Salary: ${job.salary}` : null,
        job.experience ? `Experience: ${job.experience}` : null,
        job.description ? `Description: ${job.description}` : null,
        skillStr ? `Skills: ${skillStr}` : null,
        job.qualifications?.length
          ? `Qualifications: ${job.qualifications.join('; ')}`
          : null,
        job.responsibilities?.length
          ? `Responsibilities: ${job.responsibilities.join('; ')}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      try {
        const { text } = await generateText({
          model: openai('gpt-4.1-mini'),
          system: `You are a job matching scorer. Given a candidate profile and a job posting, rate the match quality from 1-10. Consider: skill alignment, experience level, location/remote fit, salary expectations, industry match, and the candidate's stated preferences. Output ONLY a JSON object: {"score": N, "reason": "one sentence"}. Be strict — only 8+ for strong matches.`,
          prompt: `${context}\n\nJob posting:\n${jobText}`,
          maxTokens: 80,
        });
        const parsed = JSON.parse(text);
        return {
          id: job.id,
          rerank_score: Math.min(10, Math.max(1, parsed.score || 5)),
        };
      } catch {
        return { id: job.id, rerank_score: 5 };
      }
    });
    const results = await Promise.all(promises);
    allScores.push(...results);
  }

  return allScores;
}
