import { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { h } from './h.js';
import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
} from '../formatters.js';

// Fixed-width columns (characters)
const COL_CURSOR = 2;
const COL_SCORE = 6;
const COL_AI = 4;
const COL_SALARY = 14;
const COL_STATUS = 3;

function useColumns(hasRerank) {
  const { stdout } = useStdout();
  const cols = stdout?.columns || 120;
  const fixed =
    COL_CURSOR + COL_SCORE + (hasRerank ? COL_AI : 0) + COL_SALARY + COL_STATUS;
  const flex = cols - fixed - 2; // 2 for paddingX
  // Split remaining space: 35% title, 30% company, 35% location
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

function JobRow({ job, selected, hasRerank, titleW, compW, locW }) {
  const loc = formatLocation(job.location, job.remote);
  const sal = formatSalary(job.salary, job.salary_usd);
  const score =
    typeof job.similarity === 'number'
      ? job.similarity.toFixed(2)
      : String(job.similarity || '—');
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

  return h(
    Box,
    { paddingX: 1 },
    h(
      Box,
      { width: COL_CURSOR },
      h(
        Text,
        { inverse: selected, color, backgroundColor: bg },
        selected ? '▸ ' : '  '
      )
    ),
    h(
      Box,
      { width: COL_SCORE },
      h(Text, { inverse: selected, color, backgroundColor: bg }, score)
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
      hasRerank,
      titleW,
      compW,
      locW,
    })
  );

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
    h(HeaderRow, { hasRerank, titleW, compW, locW }),
    divider,
    ...rows,
    scrollInfo
  );
}
