import { Box, Text } from 'ink';
import { h } from './h.js';
import { buildEmptyMessage } from './emptyMessage.js';

const TAB_MESSAGES = {
  all: [
    '',
    '  No matching jobs found.',
    '',
    '  Try:',
    '    f  Increase date range or remove filters',
    '    /  Try a different search profile',
    '    R  Refresh results',
  ],
  interested: [
    '',
    '  No jobs marked as interested yet.',
    '',
    '  Press i on jobs you like.',
  ],
  applied: [
    '',
    '  No applications tracked yet.',
    '',
    '  Press x to mark jobs as applied.',
  ],
  maybe: ['', '  No maybes yet.', '', '  Press m on jobs to revisit later.'],
  passed: ['', '  No passed jobs.', '', "  Press p on jobs that aren't a fit."],
};

export default function EmptyState({ tab, filters, appliedQuery, totalCount }) {
  const honest = buildEmptyMessage({ tab, filters, appliedQuery, totalCount });
  const lines = honest
    ? ['', `  ${honest[0]}`, '', `  ${honest[1]}`]
    : TAB_MESSAGES[tab] || TAB_MESSAGES.all;

  return h(
    Box,
    { flexDirection: 'column', paddingX: 2, paddingY: 1 },
    ...lines.map((line, i) => h(Text, { key: i, dimColor: true }, line))
  );
}
