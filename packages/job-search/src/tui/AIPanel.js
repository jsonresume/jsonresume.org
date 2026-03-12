import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { h } from './h.js';

export default function AIPanel({
  text,
  loading,
  error,
  onDismiss,
  isActive,
  mode,
}) {
  const [scroll, setScroll] = useState(0);
  const maxRows = Math.max((process.stdout.rows || 30) - 8, 10);

  useInput(
    (input, key) => {
      if (key.escape) onDismiss();
      if (!loading) {
        if (key.upArrow || input === 'k') setScroll((s) => Math.max(0, s - 1));
        if (key.downArrow || input === 'j') setScroll((s) => s + 1);
        if (key.pageUp || (key.ctrl && input === 'u'))
          setScroll((s) => Math.max(0, s - 20));
        if (key.pageDown || (key.ctrl && input === 'd'))
          setScroll((s) => s + 20);
        if (input === 'g') setScroll(0);
        if (input === 'G' && text) {
          const lines = text.split('\n');
          setScroll(Math.max(0, lines.length - maxRows));
        }
      }
    },
    { isActive }
  );

  const isCover = mode === 'cover';
  const title = isCover ? '📋 Job Dossier (via Claude Code)' : '🤖 AI Analysis';
  const color = isCover ? 'green' : 'magenta';
  const loadingMsg = isCover
    ? ' Claude is researching… (streaming live)'
    : ' Thinking...';

  let displayText = text;
  let totalLines = 0;
  if (text) {
    const lines = text.split('\n');
    totalLines = lines.length;
    if (loading) {
      // While streaming, auto-scroll to bottom
      displayText = lines.slice(Math.max(0, lines.length - maxRows)).join('\n');
    } else {
      // When done, allow manual scroll
      const start = Math.min(scroll, Math.max(0, lines.length - maxRows));
      displayText = lines.slice(start, start + maxRows).join('\n');
    }
  }

  const scrollHint =
    !loading && totalLines > maxRows
      ? `j/k scroll · g/G top/bottom · ${scroll + 1}–${Math.min(
          scroll + maxRows,
          totalLines
        )}/${totalLines}`
      : '';

  const statusLine =
    loading && text
      ? 'Streaming… ESC to cancel'
      : loading
      ? 'ESC to cancel'
      : scrollHint
      ? `${scrollHint}  ·  ESC to dismiss`
      : 'Press ESC to dismiss';

  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'double',
      borderColor: color,
      padding: 1,
      marginX: 2,
    },
    h(Text, { bold: true, color }, title),
    h(Text, null, ' '),
    loading
      ? h(Box, null, h(Spinner, { type: 'dots' }), h(Text, null, loadingMsg))
      : null,
    error ? h(Text, { color: 'red' }, `Error: ${error}`) : null,
    displayText ? h(Text, { wrap: 'wrap' }, displayText) : null,
    h(Text, null, ' '),
    h(Text, { dimColor: true }, statusLine)
  );
}
