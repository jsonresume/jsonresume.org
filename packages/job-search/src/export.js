import { writeFileSync } from 'fs';
import { formatSalary, formatLocation } from './formatters.js';

/**
 * Export jobs to a markdown tracker file.
 * Returns the filename written.
 */
export function exportShortlist(allJobs) {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `job-hunt-${date}.md`;

  const interested = allJobs.filter((j) => j.state === 'interested');
  const applied = allJobs.filter((j) => j.state === 'applied');
  const maybe = allJobs.filter((j) => j.state === 'maybe');

  const formatJob = (j, i) => {
    const loc = formatLocation(j.location, j.remote);
    const sal = formatSalary(j.salary, j.salary_usd);
    const skills = j.skills ? j.skills.map((s) => s.name || s).join(', ') : '—';
    return [
      `### ${i + 1}. ${j.title} at ${j.company}`,
      '',
      `- **Job ID:** ${j.id}`,
      `- **Match Score:** ${j.similarity}`,
      j.url ? `- **HN Post:** ${j.url}` : null,
      `- **Salary:** ${sal}`,
      `- **Location:** ${loc}`,
      `- **Skills:** ${skills}`,
      '',
    ]
      .filter((l) => l !== null)
      .join('\n');
  };

  const sections = [];

  sections.push(`# Job Hunt — ${date}\n`);

  if (interested.length > 0) {
    sections.push(`## Shortlist (${interested.length})\n`);
    sections.push(interested.map(formatJob).join('\n'));
  }

  if (applied.length > 0) {
    sections.push(`## Applied (${applied.length})\n`);
    sections.push(applied.map(formatJob).join('\n'));
  }

  if (maybe.length > 0) {
    sections.push(`## Maybe — Revisit Later (${maybe.length})\n`);
    sections.push(
      maybe
        .map((j) => `- **${j.company}** — ${j.title} (score: ${j.similarity})`)
        .join('\n')
    );
  }

  sections.push(
    `\n---\n*Exported from [JSON Resume Job Search](https://github.com/jsonresume/jsonresume.org)*`
  );

  const content = sections.join('\n\n');
  writeFileSync(filename, content);
  return filename;
}
