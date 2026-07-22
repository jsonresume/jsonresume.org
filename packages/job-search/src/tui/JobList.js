import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { h } from './h.js';
import { useColumns, HeaderRow } from './jobListLayout.js';
import JobRow, { TierSeparator } from './JobRow.js';
import EmptyState from './EmptyState.js';
import { hasTierData, buildTierRows } from './tierHelpers.js';

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
  filters,
  appliedQuery,
  totalCount,
}) {
  const [scroll, setScroll] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const reserved = reservedRows || (compact ? 6 : 10);
  const visibleRows = Math.max((process.stdout.rows || 30) - reserved, 5);

  // Flat display rows: job rows plus tier band separators (when tiers exist).
  // Scrolling operates in flat-row space so separators consume rows too;
  // with no tier data the flat index equals the job index (today's behavior).
  const rows = buildTierRows(jobs);
  const cursorFlat = rows.findIndex(
    (r) => r.type === 'job' && r.jobIndex === cursor
  );

  useEffect(() => {
    if (cursor >= jobs.length && jobs.length > 0) {
      onCursorChange(jobs.length - 1);
    }
  }, [jobs.length]);

  useEffect(() => {
    if (cursorFlat < 0) return;
    // Scrolling up onto the first job of a band reveals its separator too.
    const top =
      rows[cursorFlat - 1]?.type === 'separator' ? cursorFlat - 1 : cursorFlat;
    if (top < scroll) setScroll(top);
    if (cursorFlat >= scroll + visibleRows)
      setScroll(cursorFlat - visibleRows + 1);
  }, [cursorFlat, visibleRows]);

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

  if (jobs.length === 0)
    return h(EmptyState, { tab, filters, appliedQuery, totalCount });

  const visible = rows.slice(scroll, scroll + visibleRows);
  const hasRerank = visible.some((r) => r.type === 'job' && r.job.rerank_score);
  const hasTiers = hasTierData(jobs);
  const { cols, titleW, compW, locW } = useColumns(hasRerank, compact);

  const rendered = visible.map((row) =>
    row.type === 'separator'
      ? h(TierSeparator, { key: `sep-${row.tier}`, label: row.label })
      : h(JobRow, {
          key: row.job.id,
          job: row.job,
          selected: row.jobIndex === cursor,
          marked: selected.has(row.job.id),
          hasRerank,
          hasTiers,
          titleW,
          compW,
          locW,
          compact,
          dossierStatus: getDossierStatus ? getDossierStatus(row.job.id) : null,
        })
  );

  const visJobs = visible.filter((r) => r.type === 'job');
  const first = visJobs.length ? visJobs[0].jobIndex + 1 : 0;
  const last = visJobs.length ? visJobs[visJobs.length - 1].jobIndex + 1 : 0;

  const info = [];
  info.push(`${first}–${last} of ${jobs.length}`);
  if (selected.size > 0) info.push(`${selected.size} selected`);

  return h(
    Box,
    { flexDirection: 'column' },
    h(HeaderRow, { hasRerank, hasTiers, titleW, compW, locW, compact }),
    h(
      Box,
      { paddingX: 1 },
      h(Text, { dimColor: true }, '─'.repeat(Math.max(10, cols - 2)))
    ),
    ...rendered,
    h(
      Box,
      { paddingX: 1, justifyContent: 'space-between' },
      h(Text, { dimColor: true }, info.join('  ·  ')),
      h(
        Box,
        { gap: 1 },
        scroll > 0 ? h(Text, { dimColor: true }, '↑') : null,
        scroll + visibleRows < rows.length
          ? h(Text, { dimColor: true }, '↓')
          : null
      )
    )
  );
}
