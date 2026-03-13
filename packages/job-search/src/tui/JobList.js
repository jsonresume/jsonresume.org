import { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { h } from './h.js';
import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
  formatAge,
} from '../formatters.js';

// Column gap between each column
const GAP = 2;

function useColumns(hasRerank, compact) {
  const { stdout } = useStdout();
  const cols = stdout?.columns || 120;
  const available = compact ? Math.floor(cols * 0.4) : cols;

  const dossierW = 2;

  if (compact) {
    // Compact mode: just score, title, dossier, status
    const scoreW = 5;
    const statusW = 2;
    const gaps = GAP * 2;
    const titleW = Math.max(
      10,
      available - scoreW - dossierW - statusW - gaps - 2
    );
    return {
      cols: available,
      titleW,
      compW: 0,
      locW: 0,
      scoreW,
      statusW,
      dossierW,
    };
  }

  const scoreW = 5;
  const aiW = hasRerank ? 3 : 0;
  const salaryW = 12;
  const statusW = 2;
  const cursorW = 2;
  const gaps = GAP * (hasRerank ? 7 : 6);
  const fixed =
    cursorW + scoreW + aiW + salaryW + dossierW + statusW + gaps + 2;
  const flex = Math.max(30, available - fixed);
  const titleW = Math.max(12, Math.floor(flex * 0.35));
  const compW = Math.max(10, Math.floor(flex * 0.3));
  const locW = Math.max(8, flex - titleW - compW);
  return {
    cols: available,
    titleW,
    compW,
    locW,
    scoreW,
    salaryW,
    statusW,
    dossierW,
    aiW,
  };
}

function HeaderRow({ hasRerank, titleW, compW, locW, compact }) {
  if (compact) {
    return h(
      Box,
      { paddingX: 1 },
      h(Box, { width: 2 }),
      h(
        Box,
        { width: 5, marginRight: GAP },
        h(Text, { bold: true, dimColor: true }, 'Score')
      ),
      h(Box, { flexGrow: 1 }, h(Text, { bold: true, dimColor: true }, 'Title'))
    );
  }

  return h(
    Box,
    { paddingX: 1 },
    h(Box, { width: 2 }),
    h(
      Box,
      { width: 5, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, 'Score')
    ),
    hasRerank
      ? h(
          Box,
          { width: 3, marginRight: GAP },
          h(Text, { bold: true, dimColor: true }, 'AI')
        )
      : null,
    h(
      Box,
      { width: titleW, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, 'Title')
    ),
    h(
      Box,
      { width: compW, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, 'Company')
    ),
    h(
      Box,
      { width: locW, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, 'Location')
    ),
    h(
      Box,
      { width: 12, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, 'Salary')
    ),
    h(
      Box,
      { width: 2, marginRight: GAP },
      h(Text, { bold: true, dimColor: true }, '📋')
    ),
    h(Box, { width: 2 }, h(Text, { bold: true, dimColor: true }, '  '))
  );
}

function JobRow({
  job,
  selected,
  hasRerank,
  titleW,
  compW,
  locW,
  marked,
  compact,
  dossierStatus,
}) {
  const loc = formatLocation(job.location, job.remote);
  const sal = formatSalary(job.salary, job.salary_usd);
  const score =
    typeof job.similarity === 'number' ? job.similarity.toFixed(2) : '—';
  const age = formatAge(job.posted_at);
  const icon = stateIcon(job.state);
  const dossierIcon =
    dossierStatus === 'generating' ? '◌' : dossierStatus === 'done' ? '📋' : '';

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
  const props = {
    inverse: selected,
    color,
    backgroundColor: bg,
    wrap: 'truncate',
  };
  const markerProps = {
    inverse: selected,
    color: marked ? 'magenta' : color,
    backgroundColor: bg,
  };

  const dossierColor = dossierStatus === 'generating' ? 'yellow' : 'green';

  if (compact) {
    return h(
      Box,
      { paddingX: 1 },
      h(Box, { width: 2 }, h(Text, markerProps, cursorStr)),
      h(
        Box,
        { width: 5, marginRight: GAP },
        h(Text, { ...props, dimColor: !selected }, score)
      ),
      h(
        Box,
        { flexGrow: 1 },
        h(Text, props, truncate(job.title || '—', titleW))
      ),
      h(
        Box,
        { width: 2 },
        h(
          Text,
          { ...props, color: dossierIcon ? dossierColor : undefined },
          dossierIcon || ' '
        )
      ),
      h(Box, { width: 2 }, h(Text, props, icon))
    );
  }

  return h(
    Box,
    { paddingX: 1 },
    h(Box, { width: 2 }, h(Text, markerProps, cursorStr)),
    h(
      Box,
      { width: 5, marginRight: GAP },
      h(Text, { ...props, dimColor: !selected }, score)
    ),
    hasRerank
      ? h(
          Box,
          { width: 3, marginRight: GAP },
          h(Text, props, job.rerank_score ? String(job.rerank_score) : '—')
        )
      : null,
    h(
      Box,
      { width: titleW, marginRight: GAP },
      h(Text, props, truncate(job.title || '—', titleW - 1))
    ),
    h(
      Box,
      { width: compW, marginRight: GAP },
      h(Text, props, truncate(job.company || '—', compW - 1))
    ),
    h(
      Box,
      { width: locW, marginRight: GAP },
      h(Text, props, truncate(age ? `${loc} · ${age}` : loc, locW - 1))
    ),
    h(Box, { width: 12, marginRight: GAP }, h(Text, props, truncate(sal, 11))),
    h(
      Box,
      { width: 2, marginRight: GAP },
      h(
        Text,
        { ...props, color: dossierIcon ? dossierColor : undefined },
        dossierIcon || ' '
      )
    ),
    h(Box, { width: 2 }, h(Text, props, icon))
  );
}

function EmptyState({ tab }) {
  const messages = {
    all: [
      '',
      '  No matching jobs found.',
      '',
      '  Try:',
      '    f  Increase date range or remove filters',
      '    /  Try a different search profile',
      '    R  Refresh results',
    ],
    interested: [
      '',
      '  No jobs marked as interested yet.',
      '',
      '  Press i on jobs you like.',
    ],
    applied: [
      '',
      '  No applications tracked yet.',
      '',
      '  Press x to mark jobs as applied.',
    ],
    maybe: ['', '  No maybes yet.', '', '  Press m on jobs to revisit later.'],
    passed: [
      '',
      '  No passed jobs.',
      '',
      "  Press p on jobs that aren't a fit.",
    ],
  };

  return h(
    Box,
    { flexDirection: 'column', paddingX: 2, paddingY: 1 },
    ...(messages[tab] || messages.all).map((line, i) =>
      h(Text, { key: i, dimColor: true }, line)
    )
  );
}

export default function JobList({
  jobs,
  cursor,
  onCursorChange,
  onSelect,
  onMark,
  onAISummary,
  onDossier,
  onAIBatch,
  onExport,
  getDossierStatus,
  isActive,
  tab,
  compact,
  reservedRows,
}) {
  const [scroll, setScroll] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const reserved = reservedRows || (compact ? 6 : 10);
  const visibleRows = Math.max((process.stdout.rows || 30) - reserved, 5);

  useEffect(() => {
    if (cursor >= jobs.length && jobs.length > 0) {
      onCursorChange(jobs.length - 1);
    }
  }, [jobs.length]);

  useEffect(() => {
    if (cursor < scroll) setScroll(cursor);
    if (cursor >= scroll + visibleRows) setScroll(cursor - visibleRows + 1);
  }, [cursor, visibleRows]);

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
      if (key.pageUp || (key.ctrl && input === 'u')) {
        onCursorChange(Math.max(0, cursor - visibleRows));
      }
      if (key.pageDown || (key.ctrl && input === 'd')) {
        onCursorChange(Math.min(jobs.length - 1, cursor + visibleRows));
      }
      if (key.home || input === 'g') onCursorChange(0);
      if (input === 'G') onCursorChange(Math.max(0, jobs.length - 1));

      if (key.return && jobs[cursor]) onSelect(jobs[cursor]);
      if (input === 'v' && jobs[cursor]) {
        setSelected((prev) => {
          const next = new Set(prev);
          next.has(jobs[cursor].id)
            ? next.delete(jobs[cursor].id)
            : next.add(jobs[cursor].id);
          return next;
        });
      }
      if (selected.size > 0 && 'ixmp'.includes(input)) {
        const states = {
          i: 'interested',
          x: 'applied',
          m: 'maybe',
          p: 'not_interested',
        };
        if (states[input]) {
          for (const id of selected) onMark(id, states[input]);
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
      if (input === 'c' && jobs[cursor] && onDossier) onDossier(jobs[cursor]);
      if (input === 'S' && onAIBatch) onAIBatch(jobs);
      if (input === 'e' && onExport) onExport();
    },
    { isActive }
  );

  if (jobs.length === 0) return h(EmptyState, { tab });

  const visible = jobs.slice(scroll, scroll + visibleRows);
  const hasRerank = visible.some((j) => j.rerank_score);
  const { cols, titleW, compW, locW } = useColumns(hasRerank, compact);

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
      compact,
      dossierStatus: getDossierStatus ? getDossierStatus(job.id) : null,
    })
  );

  const info = [];
  info.push(
    `${scroll + 1}–${Math.min(scroll + visibleRows, jobs.length)} of ${
      jobs.length
    }`
  );
  if (selected.size > 0) info.push(`${selected.size} selected`);

  return h(
    Box,
    { flexDirection: 'column' },
    h(HeaderRow, { hasRerank, titleW, compW, locW, compact }),
    h(
      Box,
      { paddingX: 1 },
      h(Text, { dimColor: true }, '─'.repeat(Math.max(10, cols - 2)))
    ),
    ...rows,
    h(
      Box,
      { paddingX: 1, justifyContent: 'space-between' },
      h(Text, { dimColor: true }, info.join('  ·  ')),
      h(
        Box,
        { gap: 1 },
        scroll > 0 ? h(Text, { dimColor: true }, '↑') : null,
        scroll + visibleRows < jobs.length
          ? h(Text, { dimColor: true }, '↓')
          : null
      )
    )
  );
}
