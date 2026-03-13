import { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { h } from './h.js';

export default function AIPanel({
  text,
  loading,
  error,
  onDismiss,
  onExport,
  onRegenerate,
  onMark,
  job,
  isActive,
  mode,
}) {
  const [scroll, setScroll] = useState(0);
  const maxRows = Math.max((process.stdout.rows || 30) - 8, 10);
  const exportMsg = useRef(null);

  // Enable mouse reporting for scroll wheel
  useEffect(() => {
    if (!process.stdout.isTTY) return;
    // Enable mouse wheel reporting (SGR mode)
    process.stdout.write('\x1b[?1000h\x1b[?1006h');
    const onData = (data) => {
      const str = data.toString();
      // SGR mouse: \x1b[<button;col;row(M|m)
      const match = str.match(/\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
      if (match) {
        const btn = parseInt(match[1], 10);
        if (btn === 64) setScroll((s) => Math.max(0, s - 3));
        if (btn === 65) setScroll((s) => s + 3);
      }
    };
    process.stdin.on('data', onData);
    return () => {
      process.stdin.removeListener('data', onData);
      if (process.stdout.isTTY) {
        process.stdout.write('\x1b[?1000l\x1b[?1006l');
      }
    };
  }, []);

  useInput(
    (input, key) => {
      if (key.escape) onDismiss();
      if (input === 'e' && text && onExport) {
        const filename = onExport();
        if (filename) {
          exportMsg.current = filename;
          setTimeout(() => {
            exportMsg.current = null;
          }, 3000);
        }
      }
      if (input === 'r' && job && onRegenerate && !loading) {
        onRegenerate(job);
      }
      // Mark keys
      if (job && onMark) {
        if (input === 'i') onMark(job.id, 'interested');
        if (input === 'x') onMark(job.id, 'applied');
        if (input === 'm') onMark(job.id, 'maybe');
        if (input === 'p') onMark(job.id, 'not_interested');
      }
      if (key.upArrow || input === 'k') setScroll((s) => Math.max(0, s - 1));
      if (key.downArrow || input === 'j') setScroll((s) => s + 1);
      if (key.pageUp || (key.ctrl && input === 'u'))
        setScroll((s) => Math.max(0, s - 20));
      if (key.pageDown || (key.ctrl && input === 'd')) setScroll((s) => s + 20);
      if (input === 'g') setScroll(0);
      if (input === 'G' && text) {
        const lines = text.split('\n');
        setScroll(Math.max(0, lines.length - maxRows));
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

  const exportHint = text ? ' · e export' : '';
  const regenHint = isCover && !loading && job ? ' · r regenerate' : '';
  const statusLine =
    loading && text
      ? 'Streaming… ESC to cancel'
      : loading
      ? 'ESC to cancel'
      : scrollHint
      ? `${scrollHint}${exportHint}${regenHint}  ·  ESC to dismiss`
      : `ESC to dismiss${exportHint}${regenHint}`;

  return h(
    Box,
    {
      flexDirection: 'column',
      flexGrow: 1,
      paddingX: 1,
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
