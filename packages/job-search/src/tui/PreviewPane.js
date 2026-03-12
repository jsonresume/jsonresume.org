import { Box, Text } from 'ink';
import { h } from './h.js';
import { formatSalary, formatLocation, stateIcon } from '../formatters.js';

export default function PreviewPane({ job }) {
  if (!job) return null;

  const cols = process.stdout.columns || 80;
  const loc = formatLocation(job.location, job.remote);
  const sal = formatSalary(job.salary, job.salary_usd);
  const icon = stateIcon(job.state);

  const skills = job.skills
    ? job.skills
        .slice(0, 8)
        .map((s) => s.name || s)
        .join(' · ')
    : null;

  const desc = job.description
    ? job.description.replace(/\n/g, ' ').slice(0, cols * 2)
    : null;

  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'single',
      borderColor: 'gray',
      borderTop: true,
      borderBottom: false,
      borderLeft: false,
      borderRight: false,
      paddingX: 1,
    },
    // Title line
    h(
      Box,
      { gap: 1 },
      h(Text, { bold: true, color: 'white' }, job.title || '—'),
      h(Text, { dimColor: true }, 'at'),
      h(Text, { bold: true, color: 'cyan' }, job.company || '—'),
      job.state ? h(Text, null, ` ${icon}`) : null
    ),
    // Meta line
    h(
      Box,
      { gap: 2 },
      h(Text, { dimColor: true }, `📍 ${loc}`),
      h(Text, { dimColor: true }, `💰 ${sal}`),
      job.experience
        ? h(Text, { dimColor: true }, `📊 ${job.experience}`)
        : null,
      job.url ? h(Text, { color: 'blue', dimColor: true }, 'o:open') : null
    ),
    // Skills
    skills
      ? h(
          Box,
          null,
          h(Text, { color: 'yellow' }, 'Skills: '),
          h(Text, { dimColor: true }, skills)
        )
      : null,
    // Description snippet
    desc ? h(Text, { dimColor: true, wrap: 'truncate-end' }, desc) : null
  );
}
