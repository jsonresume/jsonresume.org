import { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { h } from './h.js';
import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
  scoreBar,
} from '../formatters.js';

// Fixed-width columns (characters)
const COL_CURSOR = 2;
const COL_SCORE = 8; // sparkline + number
const COL_AI = 4;
const COL_SALARY = 14;
const COL_STATUS = 3;

function useColumns(hasRerank) {
  const { stdout } = useStdout();
  const cols = stdout?.columns || 120;
  const fixed =
    COL_CURSOR + COL_SCORE + (hasRerank ? COL_AI : 0) + COL_SALARY + COL_STATUS;
  const flex = cols - fixed - 2;
  const titleW = Math.max(12, Math.floor(flex * 0.35));
  const compW = Math.max(10, Math.floor(flex * 0.3));
  const locW = Math.max(10, flex - titleW - compW);
  return { cols, titleW, compW, locW };
}

function HeaderRow({ hasRerank, titleW, compW, locW }) {
  return h(
    Box,
    { paddingX: 1 },
    h(Box, { width: COL_CURSOR }),
    h(
      Box,
      { width: COL_SCORE },
      h(Text, { bold: true, dimColor: true }, 'Score')
    ),
    hasRerank
      ? h(Box, { width: COL_AI }, h(Text, { bold: true, dimColor: true }, 'AI'))
      : null,
    h(Box, { width: titleW }, h(Text, { bold: true, dimColor: true }, 'Title')),
    h(
      Box,
      { width: compW },
      h(Text, { bold: true, dimColor: true }, 'Company')
    ),
    h(
      Box,
      { width: locW },
      h(Text, { bold: true, dimColor: true }, 'Location')
    ),
    h(
      Box,
      { width: COL_SALARY },
      h(Text, { bold: true, dimColor: true }, 'Salary')
    ),
    h(Box, { width: COL_STATUS }, h(Text, { bold: true, dimColor: true }, 'St'))
  );
}

function JobRow({ job, selected, hasRerank, titleW, compW, locW, marked }) {
  const loc = formatLocation(job.location, job.remote);
  const sal = formatSalary(job.salary, job.salary_usd);
  const bar = scoreBar(job.similarity, 4);
  const num =
    typeof job.similarity === 'number' ? job.similarity.toFixed(2) : '—';
  const icon = stateIcon(job.state);

  const stColor =
    job.state === 'interested'
      ? 'green'
      : job.state === 'applied'
      ? 'cyan'
      : job.state === 'maybe'
      ? 'yellow'
      : job.state === 'not_interested'
      ? 'red'
      : undefined;

  const color = selected ? 'white' : stColor;
  const bg = selected ? 'blue' : undefined;
  const cursorStr = marked ? '● ' : selected ? '▸ ' : '  ';

  return h(
    Box,
    { paddingX: 1 },
    h(
      Box,
      { width: COL_CURSOR },
      h(
        Text,
        {
          inverse: selected,
          color: marked ? 'magenta' : color,
          backgroundColor: bg,
        },
        cursorStr
      )
    ),
    h(
      Box,
      { width: COL_SCORE },
      h(
        Text,
        {
          inverse: selected,
          color: selected ? color : 'green',
          backgroundColor: bg,
        },
        bar
      ),
      h(Text, { inverse: selected, color, backgroundColor: bg }, num)
    ),
    hasRerank
      ? h(
          Box,
          { width: COL_AI },
          h(
            Text,
            { inverse: selected, color, backgroundColor: bg },
            job.rerank_score ? String(job.rerank_score) : '—'
          )
        )
      : null,
    h(
      Box,
      { width: titleW },
      h(
        Text,
        { inverse: selected, color, backgroundColor: bg, wrap: 'truncate' },
        truncate(job.title || '—', titleW - 1)
      )
    ),
    h(
      Box,
      { width: compW },
      h(
        Text,
        { inverse: selected, color, backgroundColor: bg, wrap: 'truncate' },
        truncate(job.company || '—', compW - 1)
      )
    ),
    h(
      Box,
      { width: locW },
      h(
        Text,
        { inverse: selected, color, backgroundColor: bg, wrap: 'truncate' },
        truncate(loc, locW - 1)
      )
    ),
    h(
      Box,
      { width: COL_SALARY },
      h(
        Text,
        { inverse: selected, color, backgroundColor: bg, wrap: 'truncate' },
        truncate(sal, COL_SALARY - 1)
      )
    ),
    h(
      Box,
      { width: COL_STATUS },
      h(Text, { inverse: selected, color, backgroundColor: bg }, icon)
    )
  );
}

function EmptyState({ tab }) {
  const messages = {
    all: [
      '    No matching jobs found.',
      '',
      '  Try these:',
      '    • Increase the date range    f → days',
      '    • Remove salary filters      f → delete',
      '    • Try a different search      / → new',
      '    • Refresh results             R',
    ],
    interested: [
      '    No jobs marked as interested yet.',
      '',
      '  Browse the All tab and press i on jobs you like.',
    ],
    applied: [
      '    No applications tracked yet.',
      '',
      '  Press x on a job to mark it as applied.',
    ],
    maybe: [
      '    No maybes yet.',
      '',
      '  Press m on jobs you want to revisit later.',
    ],
    passed: ['    No passed jobs.', '', "  Press p on jobs that aren't a fit."],
  };

  const lines = messages[tab] || messages.all;

  return h(
    Box,
    { flexDirection: 'column', paddingX: 1, paddingY: 1 },
    ...lines.map((line, i) => h(Text, { key: i, dimColor: true }, line))
  );
}

export default function JobList({
  jobs,
  cursor,
  onCursorChange,
  onSelect,
  onMark,
  onAISummary,
  onAIBatch,
  onExport,
  isActive,
  tab,
  previewHeight,
}) {
  const [scroll, setScroll] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const reservedRows = 12 + (previewHeight || 0);
  const visibleRows = Math.max((process.stdout.rows || 30) - reservedRows, 5);

  useEffect(() => {
    if (cursor >= jobs.length && jobs.length > 0) {
      onCursorChange(jobs.length - 1);
    }
  }, [jobs.length]);

  useEffect(() => {
    if (cursor < scroll) setScroll(cursor);
    if (cursor >= scroll + visibleRows) setScroll(cursor - visibleRows + 1);
  }, [cursor]);

  // Clear batch selection when jobs change
  useEffect(() => {
    setSelected(new Set());
  }, [jobs.length, tab]);

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        onCursorChange(Math.max(0, cursor - 1));
      }
      if (key.downArrow || input === 'j') {
        onCursorChange(Math.min(jobs.length - 1, cursor + 1));
      }
      // Page up/down
      if (key.pageUp || (key.ctrl && input === 'u')) {
        onCursorChange(Math.max(0, cursor - visibleRows));
      }
      if (key.pageDown || (key.ctrl && input === 'd')) {
        onCursorChange(Math.min(jobs.length - 1, cursor + visibleRows));
      }
      // Home/End
      if (key.home || input === 'g') {
        onCursorChange(0);
      }
      if (input === 'G') {
        onCursorChange(Math.max(0, jobs.length - 1));
      }
      if (key.return && jobs[cursor]) onSelect(jobs[cursor]);
      // Batch toggle
      if (input === 'v' && jobs[cursor]) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(jobs[cursor].id)) {
            next.delete(jobs[cursor].id);
          } else {
            next.add(jobs[cursor].id);
          }
          return next;
        });
      }
      // Batch mark
      if (selected.size > 0 && 'ixmp'.includes(input)) {
        const states = {
          i: 'interested',
          x: 'applied',
          m: 'maybe',
          p: 'not_interested',
        };
        const st = states[input];
        if (st) {
          for (const id of selected) onMark(id, st);
          setSelected(new Set());
          return;
        }
      }
      if (input === 'i' && jobs[cursor]) onMark(jobs[cursor].id, 'interested');
      if (input === 'x' && jobs[cursor]) onMark(jobs[cursor].id, 'applied');
      if (input === 'm' && jobs[cursor]) onMark(jobs[cursor].id, 'maybe');
      if (input === 'p' && jobs[cursor])
        onMark(jobs[cursor].id, 'not_interested');
      if (input === ' ' && jobs[cursor]) onAISummary(jobs[cursor]);
      if (input === 'S') onAIBatch(jobs);
      if (input === 'e' && onExport) onExport();
    },
    { isActive }
  );

  if (jobs.length === 0) {
    return h(EmptyState, { tab });
  }

  const visible = jobs.slice(scroll, scroll + visibleRows);
  const hasRerank = visible.some((j) => j.rerank_score);
  const { cols, titleW, compW, locW } = useColumns(hasRerank);

  const divider = h(
    Box,
    { paddingX: 1 },
    h(Text, { dimColor: true }, '─'.repeat(cols - 2))
  );

  const rows = visible.map((job, i) =>
    h(JobRow, {
      key: job.id,
      job,
      selected: scroll + i === cursor,
      marked: selected.has(job.id),
      hasRerank,
      titleW,
      compW,
      locW,
    })
  );

  const parts = [];
  parts.push(
    `${scroll + 1}–${Math.min(scroll + visibleRows, jobs.length)} of ${
      jobs.length
    }`
  );
  if (selected.size > 0) parts.push(`${selected.size} selected`);

  const scrollInfo = h(
    Box,
    { paddingX: 1, justifyContent: 'space-between' },
    h(Text, { dimColor: true }, parts.join('  ·  ')),
    h(
      Box,
      { gap: 1 },
      scroll > 0 ? h(Text, { dimColor: true }, '↑') : null,
      scroll + visibleRows < jobs.length
        ? h(Text, { dimColor: true }, '↓')
        : null
    )
  );

  return h(
    Box,
    { flexDirection: 'column' },
    h(HeaderRow, { hasRerank, titleW, compW, locW }),
    divider,
    ...rows,
    scrollInfo
  );
}
