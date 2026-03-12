import { Box, Text } from 'ink';
import { h } from './h.js';

const KEYS = {
  list: [
    ['jk', 'nav'],
    ['enter', 'open'],
    ['i', '⭐'],
    ['x', '📨'],
    ['m', '?'],
    ['p', '✗'],
    ['v', 'select'],
    ['space', 'AI'],
    ['f', 'filter'],
    ['/', 'search'],
    ['e', 'export'],
    ['?', 'help'],
    ['q', 'quit'],
  ],
  detail: [
    ['jk', 'scroll'],
    ['i', '⭐'],
    ['x', '📨'],
    ['m', '?'],
    ['p', '✗'],
    ['space', 'AI'],
    ['o', 'open URL'],
    ['esc', 'back'],
  ],
  filters: [
    ['jk', 'nav'],
    ['enter', 'edit'],
    ['a', 'add'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  searches: [
    ['jk', 'nav'],
    ['enter', 'switch'],
    ['n', 'new'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  ai: [['esc', 'dismiss']],
  help: [['?/esc', 'close']],
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
  toast,
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
    toast
      ? h(
          Box,
          { justifyContent: 'space-between' },
          toast,
          h(
            Box,
            { gap: 1 },
            h(Text, { dimColor: true }, `${jobCount}/${totalCount} jobs`)
          )
        )
      : h(
          Box,
          { justifyContent: 'space-between' },
          h(Box, { flexWrap: 'wrap', gap: 0 }, ...keyElements),
          h(
            Box,
            { gap: 1 },
            loading ? h(Text, { color: 'yellow' }, '⏳') : null,
            reranking ? h(Text, { color: 'magenta' }, '🧠 reranking…') : null,
            h(Text, { dimColor: true }, `${jobCount}/${totalCount} jobs`),
            searchName ? h(Text, { color: 'magenta' }, '🔍') : null,
            aiEnabled ? null : h(Text, { color: 'gray' }, '(no AI)')
          )
        ),
    error ? h(Text, { color: 'red' }, `Error: ${error}`) : null
  );
}
