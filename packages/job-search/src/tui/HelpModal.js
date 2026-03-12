import { Box, Text, useInput } from 'ink';
import { h } from './h.js';

const SECTIONS = [
  {
    title: 'Navigation',
    keys: [
      ['j / ↓', 'Move down'],
      ['k / ↑', 'Move up'],
      ['Enter', 'Open job details'],
      ['Esc / q', 'Back / quit'],
      ['Tab', 'Next section tab'],
      ['Shift+Tab', 'Previous section tab'],
    ],
  },
  {
    title: 'Job Actions',
    keys: [
      ['i', 'Mark interested'],
      ['x', 'Mark applied'],
      ['m', 'Mark maybe'],
      ['p', 'Mark passed'],
    ],
  },
  {
    title: 'Search & Filter',
    keys: [
      ['/', 'Search profiles'],
      ['f', 'Manage filters'],
      ['R', 'Force refresh'],
    ],
  },
  {
    title: 'AI Features',
    keys: [
      ['Space', 'AI summary of job'],
      ['S', 'AI batch review'],
    ],
  },
  {
    title: 'Detail View',
    keys: [
      ['o', 'Open HN post in browser'],
      ['e', 'Export shortlist to markdown'],
    ],
  },
];

export default function HelpModal({ onClose }) {
  useInput((input, key) => {
    if (key.escape || input === '?' || input === 'q') onClose();
  });

  const cols = process.stdout.columns || 80;
  const width = Math.min(60, cols - 4);

  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'round',
      borderColor: 'cyan',
      paddingX: 2,
      paddingY: 1,
      width,
      alignSelf: 'center',
    },
    h(
      Box,
      { justifyContent: 'center', marginBottom: 1 },
      h(Text, { bold: true, color: 'cyan' }, '⌨  Keyboard Shortcuts')
    ),
    ...SECTIONS.flatMap((section) => [
      h(
        Box,
        { key: `h-${section.title}`, marginTop: 1 },
        h(Text, { bold: true, color: 'yellow' }, section.title)
      ),
      ...section.keys.map(([key, desc]) =>
        h(
          Box,
          { key: `k-${key}` },
          h(Box, { width: 16 }, h(Text, { color: 'cyan', bold: true }, key)),
          h(Text, { dimColor: true }, desc)
        )
      ),
    ]),
    h(
      Box,
      { marginTop: 1, justifyContent: 'center' },
      h(Text, { dimColor: true }, 'Press ? or Esc to close')
    )
  );
}
