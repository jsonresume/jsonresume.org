import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { h } from './h.js';

export default function AIPanel({ text, loading, error, onDismiss, isActive }) {
  useInput(
    (_input, key) => {
      if (key.escape) onDismiss();
    },
    { isActive }
  );

  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'double',
      borderColor: 'magenta',
      padding: 1,
      marginX: 2,
    },
    h(Text, { bold: true, color: 'magenta' }, '🤖 AI Analysis'),
    h(Text, null, ' '),
    loading
      ? h(
          Box,
          null,
          h(Spinner, { type: 'dots' }),
          h(Text, null, ' Thinking...')
        )
      : null,
    error ? h(Text, { color: 'red' }, `Error: ${error}`) : null,
    text ? h(Text, { wrap: 'wrap' }, text) : null,
    h(Text, null, ' '),
    h(Text, { dimColor: true }, 'Press ESC to dismiss')
  );
}
