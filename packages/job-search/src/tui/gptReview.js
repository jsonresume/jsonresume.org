/**
 * GPT-backed review actions (job fit summary + batch ranking).
 * Pure async functions: build the prompt, call the model, return the text.
 * The hook layers loading/error state on top.
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import {
  buildSummaryResumeText,
  buildSummaryJobText,
  buildBatchJobsList,
} from './aiHelpers.js';

const SUMMARY_SYSTEM =
  'You are a career advisor. Given a job posting and resume, provide a concise fit analysis in 4-5 bullet points. Cover: why it fits, skill gaps, salary assessment, and remote compatibility. Be direct and opinionated.';

const BATCH_SYSTEM =
  'You are a career advisor. Rank these jobs by fit for the candidate. For each, give a 1-line verdict. Be direct.';

// Single-job fit analysis.
export async function runJobSummary(resume, job) {
  const resumeText = buildSummaryResumeText(resume);
  const jobText = buildSummaryJobText(job);
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: SUMMARY_SYSTEM,
    prompt: `Resume:\n${resumeText}\n\nJob:\n${jobText}`,
    maxTokens: 400,
  });
  return text;
}

// Ranked verdicts across a batch of jobs.
export async function runBatchReview(resume, jobs) {
  const resumeText = [resume?.basics?.label, resume?.basics?.summary]
    .filter(Boolean)
    .join('\n');
  const jobsList = buildBatchJobsList(jobs);
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: BATCH_SYSTEM,
    prompt: `Resume:\n${resumeText}\n\nJobs:\n${jobsList}`,
    maxTokens: 600,
  });
  return text;
}
