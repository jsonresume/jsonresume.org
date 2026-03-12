import { Box, Text } from 'ink';
import { h } from './h.js';

const KEYS = {
  list: [
    ['j/k', 'nav'],
    ['enter', 'detail'],
    ['i', 'interested'],
    ['x', 'applied'],
    ['m', 'maybe'],
    ['p', 'pass'],
    ['v', 'select'],
    ['n', 'find'],
    ['space', 'AI'],
    ['c', 'dossier'],
  ],
  detail: [
    ['j/k', 'nav jobs'],
    ['J/K', 'scroll'],
    ['i/x/m/p', 'mark'],
    ['o', 'open URL'],
    ['space', 'AI'],
    ['c', 'dossier'],
    ['esc', 'back'],
  ],
  search: [
    ['esc', 'clear search'],
    ['enter', 'apply'],
  ],
  filters: [
    ['j/k', 'nav'],
    ['enter', 'edit'],
    ['a', 'add'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  searches: [
    ['j/k', 'nav'],
    ['enter', 'switch'],
    ['n', 'new'],
    ['d', 'delete'],
    ['esc', 'close'],
  ],
  ai: [
    ['j/k', 'scroll'],
    ['g/G', 'top/bottom'],
    ['e', 'export'],
    ['esc', 'dismiss'],
  ],
  help: [['?/esc', 'close']],
};

function KeyHint({ k, label }) {
  return h(
    Box,
    { marginRight: 1 },
    h(Text, { color: 'cyan' }, k),
    h(Text, { dimColor: true }, ` ${label}`)
  );
}

export default function StatusBar({
  view,
  jobCount,
  totalCount,
  loading,
  reranking,
  error,
  aiEnabled,
  toast,
}) {
  const cols = process.stdout.columns || 80;
  const keys = KEYS[view] || KEYS.list;

  const divider = h(
    Box,
    { paddingX: 1 },
    h(Text, { dimColor: true }, '─'.repeat(Math.max(10, cols - 2)))
  );

  const rightParts = [];
  if (loading)
    rightParts.push(h(Text, { key: 'l', color: 'yellow' }, 'loading…'));
  if (reranking)
    rightParts.push(h(Text, { key: 'r', color: 'magenta' }, 'reranking…'));
  rightParts.push(
    h(Text, { key: 'c', dimColor: true }, `${jobCount}/${totalCount}`)
  );
  if (!aiEnabled) {
    rightParts.push(
      h(Text, { key: 'ai', dimColor: true }, 'set OPENAI_API_KEY for AI')
    );
  }

  const rightInfo = h(Box, { gap: 1 }, ...rightParts);

  const content = toast
    ? h(Box, { paddingX: 1, justifyContent: 'space-between' }, toast, rightInfo)
    : h(
        Box,
        { paddingX: 1, justifyContent: 'space-between' },
        h(
          Box,
          { flexWrap: 'wrap' },
          ...keys.map(([k, label], i) => h(KeyHint, { key: i, k, label }))
        ),
        rightInfo
      );

  return h(
    Box,
    { flexDirection: 'column' },
    divider,
    content,
    error ? h(Box, { paddingX: 1 }, h(Text, { color: 'red' }, error)) : null
  );
}
