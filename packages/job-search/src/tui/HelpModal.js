import { Box, Text, useInput } from 'ink';
import { h } from './h.js';

const SECTIONS = [
  {
    title: 'Navigation',
    keys: [
      ['j / ↓', 'Move down'],
      ['k / ↑', 'Move up'],
      ['g / G', 'Jump to first / last'],
      ['Ctrl+U / D', 'Page up / page down'],
      ['Enter', 'Open split-pane detail view'],
      ['Esc / q', 'Back / quit'],
      ['Tab', 'Next tab'],
      ['Shift+Tab', 'Previous tab'],
    ],
  },
  {
    title: 'Job Actions',
    keys: [
      ['i', 'Mark interested'],
      ['x', 'Mark applied'],
      ['m', 'Mark maybe'],
      ['p', 'Mark passed'],
      ['v', 'Toggle batch selection'],
    ],
  },
  {
    title: 'Search & Filter',
    keys: [
      ['n', 'Inline keyword search'],
      ['/', 'Search profiles'],
      ['f', 'Manage filters'],
      ['e', 'Export shortlist to markdown'],
      ['R', 'Force refresh (bypass cache)'],
    ],
  },
  {
    title: 'Detail View',
    keys: [
      ['J / K', 'Scroll detail content'],
      ['o', 'Open HN post in browser'],
    ],
  },
  {
    title: 'AI Features (requires OPENAI_API_KEY)',
    keys: [
      ['Space', 'AI summary of current job'],
      ['S', 'AI batch review of visible jobs'],
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
      h(Text, { bold: true, color: 'cyan' }, 'Keyboard Shortcuts')
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
