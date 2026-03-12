import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { h } from './h.js';
import { stateIcon, formatSalary, formatLocation } from '../formatters.js';

export default function JobDetail({
  job,
  api,
  onBack,
  onMark,
  onAISummary,
  isActive,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setLoading(true);
    setScroll(0);
    api
      .fetchJobDetail(job.id)
      .then((d) => {
        setDetail(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [job.id, api]);

  useInput(
    (input, key) => {
      if (key.escape || input === 'q') {
        onBack();
        return;
      }
      if (key.upArrow || input === 'k') setScroll((s) => Math.max(0, s - 1));
      if (key.downArrow || input === 'j') setScroll((s) => s + 1);
      if (input === 'i') onMark(job.id, 'interested');
      if (input === 'x') onMark(job.id, 'applied');
      if (input === 'm') onMark(job.id, 'maybe');
      if (input === 'p') onMark(job.id, 'not_interested');
      if (input === ' ') onAISummary(job);
      if (input === 'o' && (detail?.url || job.url)) {
        import('child_process').then(({ exec }) => {
          const url = detail?.url || job.url;
          const cmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
          exec(`${cmd} "${url}"`);
        });
      }
    },
    { isActive }
  );

  if (loading) {
    return h(
      Box,
      { padding: 1, flexDirection: 'column' },
      h(
        Box,
        null,
        h(Spinner, { type: 'dots' }),
        h(Text, null, ' Loading job details...')
      )
    );
  }

  const d = detail || job;
  const lines = [];

  // Header section
  lines.push({ text: `${d.title || job.title}`, bold: true, color: 'white' });
  lines.push({ text: `at ${d.company || job.company}`, color: 'cyan' });
  lines.push({ text: '═'.repeat(60), dimColor: true });
  lines.push({ text: '' });

  // Meta info
  const state = d.state || job.state;
  const meta = [
    ['Location', formatLocation(d.location, d.remote)],
    ['Salary', formatSalary(d.salary, d.salary_usd)],
    ['Type', d.type || '—'],
    ['Experience', d.experience || '—'],
    ['Posted', d.posted_at || '—'],
    ['Score', typeof d.similarity === 'number' ? d.similarity.toFixed(3) : '—'],
    ...(d.rerank_score ? [['AI Match', `${d.rerank_score}/10`]] : []),
    ...(d.combined_score ? [['Combined', d.combined_score.toFixed(3)]] : []),
    ['Status', state ? `${stateIcon(state)} ${state}` : 'unmarked'],
  ];
  for (const [label, value] of meta) {
    lines.push({ text: `  ${label.padEnd(12)} ${value}` });
  }

  lines.push({ text: '' });

  if (d.url || job.url) {
    lines.push({ text: `  HN Post:     ${d.url || job.url}`, color: 'blue' });
    lines.push({ text: '' });
  }

  if (d.description) {
    lines.push({ text: 'Description', bold: true, color: 'yellow' });
    lines.push({ text: '─'.repeat(40), dimColor: true });
    for (const l of d.description.split('\n')) {
      lines.push({ text: `  ${l}` });
    }
    lines.push({ text: '' });
  }

  if (d.skills?.length) {
    lines.push({ text: 'Skills', bold: true, color: 'yellow' });
    lines.push({ text: '─'.repeat(40), dimColor: true });
    lines.push({ text: `  ${d.skills.map((s) => s.name || s).join(' · ')}` });
    lines.push({ text: '' });
  }

  if (d.qualifications?.length) {
    lines.push({ text: 'Qualifications', bold: true, color: 'yellow' });
    lines.push({ text: '─'.repeat(40), dimColor: true });
    for (const q of d.qualifications) {
      lines.push({ text: `  • ${q}` });
    }
    lines.push({ text: '' });
  }

  if (d.responsibilities?.length) {
    lines.push({ text: 'Responsibilities', bold: true, color: 'yellow' });
    lines.push({ text: '─'.repeat(40), dimColor: true });
    for (const r of d.responsibilities) {
      lines.push({ text: `  • ${r}` });
    }
    lines.push({ text: '' });
  }

  const maxRows = Math.max((process.stdout.rows || 30) - 8, 10);
  const visible = lines.slice(scroll, scroll + maxRows);

  return h(
    Box,
    { flexDirection: 'column', paddingX: 2, paddingY: 1 },
    ...visible.map((line, i) =>
      h(
        Text,
        {
          key: i,
          wrap: 'wrap',
          bold: line.bold || false,
          color: line.color || undefined,
          dimColor: line.dimColor || false,
        },
        line.text
      )
    ),
    lines.length > maxRows
      ? h(
          Text,
          { dimColor: true },
          `  ↑↓ scroll (${scroll + 1}–${Math.min(
            scroll + maxRows,
            lines.length
          )}/${lines.length})`
        )
      : null
  );
}
