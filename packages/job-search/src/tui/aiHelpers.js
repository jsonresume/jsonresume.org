/**
 * Pure helpers for the AI/dossier hook.
 * Prompt builders, stream-json parsing, enrichment extraction and filename
 * derivation are kept here so they can be unit-tested in isolation.
 */

// Compact resume text for the full dossier prompt.
export function buildResumeText(resume) {
  return [
    resume?.basics?.name,
    resume?.basics?.label,
    resume?.basics?.summary,
    ...(resume?.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
    ...(resume?.work || [])
      .slice(0, 5)
      .map(
        (w) =>
          `${w.position} at ${w.name}${
            w.startDate ? ` (${w.startDate})` : ''
          }: ${w.summary || ''}`
      ),
    ...(resume?.projects || [])
      .slice(0, 3)
      .map((p) => `Project: ${p.name} — ${p.description || ''}`),
  ]
    .filter(Boolean)
    .join('\n');
}

// Full job text for the dossier prompt (includes the raw original posting).
export function buildJobText(job, rawContent) {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Salary: ${job.salary || 'Not listed'}`,
    `Remote: ${job.remote || 'Not specified'}`,
    job.experience ? `Experience: ${job.experience}` : '',
    job.type ? `Type: ${job.type}` : '',
    job.url ? `HN Post: ${job.url}` : '',
    `Description: ${job.description || ''}`,
    `Skills: ${(job.skills || []).map((s) => s.name || s).join(', ')}`,
    ...(job.qualifications || []).map((q) => `Qualification: ${q}`),
    ...(job.responsibilities || []).map((r) => `Responsibility: ${r}`),
    rawContent ? `\nFull original posting:\n${rawContent}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

// Compact resume text used by the quick GPT summary/batch prompts.
export function buildSummaryResumeText(resume) {
  return [
    resume?.basics?.label,
    resume?.basics?.summary,
    ...(resume?.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
  ]
    .filter(Boolean)
    .join('\n');
}

// Compact job text used by the quick GPT summary prompt.
export function buildSummaryJobText(job) {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Salary: ${job.salary || 'Not listed'}`,
    `Remote: ${job.remote || 'Not specified'}`,
    `Description: ${job.description || ''}`,
    `Skills: ${(job.skills || []).map((s) => s.name).join(', ')}`,
  ].join('\n');
}

// Ranked list text used by the batch-review prompt (first 15 jobs).
export function buildBatchJobsList(jobs) {
  return jobs
    .slice(0, 15)
    .map(
      (j, i) =>
        `${i + 1}. [${j.similarity}] ${j.title} at ${j.company} | ${
          j.salary || 'no salary'
        } | ${j.remote || 'no remote info'}`
    )
    .join('\n');
}

// The full research-dossier prompt lives in its own module (large text blob).
export { buildDossierPrompt } from './dossierPrompt.js';

// Derive a human-readable status line from a Claude tool_use block.
export function statusLineForTool(block) {
  const name = block.name || 'tool';
  const input = block.input || {};
  if (name === 'WebSearch' || name === 'WebFetch') {
    return `🔍 ${name}: ${input.query || input.url || ''}`;
  }
  return `⚙ Using ${name}…`;
}

// Compose visible dossier text from the running status line and result text.
export function composeDossierText(statusLine, resultText) {
  if (statusLine && resultText) return `${statusLine}\n\n${resultText}`;
  return resultText || statusLine || '';
}

// Pull the enrichment JSON out of a finished dossier, or null if absent/invalid.
export function extractEnrichment(finalResult) {
  const match = finalResult.match(/```enrichment\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Build the on-disk filename for an exported dossier.
export function dossierFilename(job) {
  const company = (job?.company || 'unknown')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 50);
  return `dossier-${company}.md`;
}
