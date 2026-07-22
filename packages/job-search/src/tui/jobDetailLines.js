import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
  formatAge,
} from '../formatters.js';

/**
 * Build the styled line list for the job detail pane.
 * Pure (aside from reading terminal width) so JobDetail stays a thin
 * component. `d` is the fetched detail record, `job` the list record it
 * falls back to for fields the detail endpoint doesn't return.
 */
export function buildDetailLines(d, job, state, isPanel) {
  const loc = formatLocation(d.location, d.remote);
  const sal = formatSalary(d.salary, d.salary_usd);
  const lines = [];

  // Title
  lines.push({ text: d.title || job.title, bold: true, color: 'white' });
  lines.push({ text: `at ${d.company || job.company}`, color: 'cyan' });

  // Grounded rerank reason (when the server sends one) — one line, truncated.
  const reason = d.reason || job.reason;
  if (reason) {
    const cols = process.stdout.columns || 80;
    const width = Math.max(20, Math.floor(isPanel ? cols * 0.6 : cols) - 10);
    lines.push({
      text: `Why: ${truncate(reason, width)}`,
      dimColor: true,
      italic: true,
    });
  }
  lines.push({ text: '' });

  // Meta as key-value pairs
  const age = formatAge(d.posted_at || job.posted_at);
  const postedStr = d.posted_at
    ? `${d.posted_at.slice(0, 10)}${age ? ` (${age})` : ''}`
    : '—';

  const meta = [
    ['📍 Location', loc],
    ['💰 Salary', sal],
    ['📋 Type', d.type || '—'],
    ['📊 Experience', d.experience || '—'],
    ['📅 Posted', postedStr],
    [
      '🎯 Match',
      typeof d.similarity === 'number' ? `${d.similarity.toFixed(3)}` : '—',
    ],
  ];
  if (d.decayed_similarity && d.decayed_similarity !== d.similarity) {
    meta.push(['⏳ Recency', d.decayed_similarity.toFixed(3)]);
  }
  const rerank = d.rerank_score ?? job.rerank_score;
  if (rerank) meta.push(['🧠 AI Score', `${rerank}/100`]);
  // Blend score the list is sorted by (falls back for older servers).
  const blend = d.score ?? job.score ?? d.combined_score;
  if (typeof blend === 'number') meta.push(['📈 Score', blend.toFixed(3)]);
  meta.push(['📌 Status', state ? `${stateIcon(state)} ${state}` : 'unmarked']);

  for (const [label, value] of meta) {
    lines.push({ text: `  ${label.padEnd(14)} ${value}` });
  }
  lines.push({ text: '' });

  if (d.url || job.url) {
    lines.push({ text: `  🔗 ${d.url || job.url}`, color: 'blue' });
    lines.push({ text: '' });
  }

  // Skills with match indicators
  if (d.skills?.length) {
    lines.push({ text: 'Skills', bold: true, color: 'yellow' });
    const skillNames = d.skills.map((s) => s.name || s).join('  ·  ');
    lines.push({ text: `  ${skillNames}` });
    // Show keywords for each skill
    for (const sk of d.skills) {
      if (sk.keywords?.length) {
        lines.push({
          text: `    ${sk.name}: ${sk.keywords.join(', ')}`,
          dimColor: true,
        });
      }
    }
    lines.push({ text: '' });
  }

  // Description
  if (d.description) {
    lines.push({ text: 'Description', bold: true, color: 'yellow' });
    for (const l of d.description.split('\n')) {
      lines.push({ text: `  ${l}` });
    }
    lines.push({ text: '' });
  }

  // Qualifications
  if (d.qualifications?.length) {
    lines.push({ text: 'Qualifications', bold: true, color: 'yellow' });
    for (const q of d.qualifications) {
      lines.push({ text: `  • ${q}` });
    }
    lines.push({ text: '' });
  }

  // Responsibilities
  if (d.responsibilities?.length) {
    lines.push({ text: 'Responsibilities', bold: true, color: 'yellow' });
    for (const r of d.responsibilities) {
      lines.push({ text: `  • ${r}` });
    }
    lines.push({ text: '' });
  }

  return lines;
}
