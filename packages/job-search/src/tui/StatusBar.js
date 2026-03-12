import { Box, Text } from 'ink';
import { h } from './h.js';

const KEYS = {
  list: [
    ['↑↓/jk', 'navigate'],
    ['enter', 'details'],
    ['i', 'interested'],
    ['x', 'applied'],
    ['m', 'maybe'],
    ['p', 'pass'],
    ['space', 'AI summary'],
    ['S', 'AI rank'],
    ['f', 'filters'],
    ['/', 'searches'],
    ['R', 'refresh'],
    ['tab', 'section'],
    ['q', 'quit'],
  ],
  detail: [
    ['↑↓', 'scroll'],
    ['i', 'interested'],
    ['x', 'applied'],
    ['m', 'maybe'],
    ['p', 'pass'],
    ['space', 'AI'],
    ['o', 'open URL'],
    ['esc', 'back'],
  ],
  filters: [
    ['↑↓', 'navigate'],
    ['enter', 'edit'],
    ['a', 'add'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  searches: [
    ['↑↓', 'navigate'],
    ['enter', 'switch'],
    ['n', 'new search'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  ai: [['esc', 'dismiss']],
};

export default function StatusBar({
  view,
  jobCount,
  totalCount,
  loading,
  reranking,
  error,
  aiEnabled,
  searchName,
}) {
  const keys = KEYS[view] || KEYS.list;

  const keyElements = keys.map(([key, label], i) =>
    h(
      Box,
      { key: i, marginRight: 1 },
      h(Text, { bold: true, color: 'cyan' }, key),
      h(Text, { dimColor: true }, `:${label}`)
    )
  );

  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'single',
      borderColor: 'gray',
      paddingX: 1,
      marginTop: 0,
    },
    h(
      Box,
      { justifyContent: 'space-between' },
      h(Box, { flexWrap: 'wrap', gap: 0 }, ...keyElements),
      h(
        Box,
        { gap: 1 },
        loading ? h(Text, { color: 'yellow' }, '⏳') : null,
        reranking ? h(Text, { color: 'magenta' }, '🧠 AI reranking...') : null,
        h(Text, { dimColor: true }, `${jobCount}/${totalCount} jobs`),
        searchName ? h(Text, { color: 'magenta' }, `🔍`) : null,
        aiEnabled ? null : h(Text, { color: 'gray' }, '(no AI key)')
      )
    ),
    error ? h(Text, { color: 'red' }, `Error: ${error}`) : null
  );
}
