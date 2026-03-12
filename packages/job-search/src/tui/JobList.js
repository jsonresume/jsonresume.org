import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { h } from './h.js';
import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
} from '../formatters.js';

export default function JobList({
  jobs,
  onSelect,
  onMark,
  onAISummary,
  onAIBatch,
  isActive,
}) {
  const [cursor, setCursor] = useState(0);
  const [scroll, setScroll] = useState(0);
  const visibleRows = Math.max((process.stdout.rows || 30) - 12, 8);

  // Reset cursor when jobs change
  useEffect(() => {
    setCursor(0);
    setScroll(0);
  }, [jobs.length]);

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        setCursor((c) => {
          const next = Math.max(0, c - 1);
          if (next < scroll) setScroll(next);
          return next;
        });
      }
      if (key.downArrow || input === 'j') {
        setCursor((c) => {
          const next = Math.min(jobs.length - 1, c + 1);
          if (next >= scroll + visibleRows) setScroll(next - visibleRows + 1);
          return next;
        });
      }
      if (key.return && jobs[cursor]) onSelect(jobs[cursor]);
      if (input === 'i' && jobs[cursor]) onMark(jobs[cursor].id, 'interested');
      if (input === 'x' && jobs[cursor]) onMark(jobs[cursor].id, 'applied');
      if (input === 'm' && jobs[cursor]) onMark(jobs[cursor].id, 'maybe');
      if (input === 'p' && jobs[cursor])
        onMark(jobs[cursor].id, 'not_interested');
      if (input === ' ' && jobs[cursor]) onAISummary(jobs[cursor]);
      if (input === 'S') onAIBatch(jobs);
    },
    { isActive }
  );

  if (jobs.length === 0) {
    return h(
      Box,
      { flexDirection: 'column', padding: 1 },
      h(
        Text,
        { dimColor: true },
        'No jobs in this section. Try switching tabs or adjusting filters.'
      )
    );
  }

  const visible = jobs.slice(scroll, scroll + visibleRows);
  const cols = process.stdout.columns || 120;
  const titleW = Math.max(20, Math.floor(cols * 0.25));
  const compW = Math.max(15, Math.floor(cols * 0.18));
  const locW = Math.max(12, Math.floor(cols * 0.15));

  const hasRerank = visible.some((j) => j.rerank_score);
  const lineW = cols - 2; // account for paddingX: 1

  const header = h(
    Box,
    { paddingX: 1 },
    h(
      Text,
      { bold: true, dimColor: true },
      (
        '  ' +
        'Score '.padEnd(7) +
        (hasRerank ? 'AI '.padEnd(4) : '') +
        'Title'.padEnd(titleW) +
        'Company'.padEnd(compW) +
        'Location'.padEnd(locW) +
        'Salary'.padEnd(12) +
        'Status'
      ).padEnd(lineW)
    )
  );

  const divider = h(
    Box,
    { paddingX: 1 },
    h(Text, { dimColor: true }, '─'.repeat(lineW))
  );

  const rows = visible.map((job, i) => {
    const idx = scroll + i;
    const selected = idx === cursor;
    const icon = stateIcon(job.state);
    const loc = formatLocation(job.location, job.remote);
    const sal = formatSalary(job.salary, job.salary_usd);
    const score =
      typeof job.similarity === 'number'
        ? job.similarity.toFixed(2)
        : String(job.similarity || '—');

    const aiScore =
      hasRerank && job.rerank_score
        ? String(job.rerank_score).padEnd(4)
        : hasRerank
        ? '—   '
        : '';

    const content =
      (selected ? '▸ ' : '  ') +
      score.padEnd(7) +
      aiScore +
      truncate(job.title || '—', titleW - 1).padEnd(titleW) +
      truncate(job.company || '—', compW - 1).padEnd(compW) +
      truncate(loc, locW - 1).padEnd(locW) +
      truncate(sal, 11).padEnd(12) +
      icon;
    const line = content.padEnd(lineW);

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

    return h(
      Box,
      { key: job.id, paddingX: 1 },
      h(
        Text,
        {
          inverse: selected,
          color: selected ? 'white' : stColor,
          backgroundColor: selected ? 'blue' : undefined,
        },
        line
      )
    );
  });

  const scrollInfo =
    jobs.length > visibleRows
      ? h(
          Box,
          { paddingX: 1, justifyContent: 'space-between' },
          h(
            Text,
            { dimColor: true },
            `${scroll + 1}–${Math.min(scroll + visibleRows, jobs.length)} of ${
              jobs.length
            } jobs`
          ),
          scroll > 0 ? h(Text, { dimColor: true }, '↑ more') : null,
          scroll + visibleRows < jobs.length
            ? h(Text, { dimColor: true }, '↓ more')
            : null
        )
      : null;

  return h(
    Box,
    { flexDirection: 'column' },
    header,
    divider,
    ...rows,
    scrollInfo
  );
}
