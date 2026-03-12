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
  isPanel,
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
        // If the detail response only has an id (local mode), use the job data we already have
        setDetail(d?.title ? d : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [job.id, api]);

  useInput(
    (input, key) => {
      if (!isPanel) {
        if (key.escape || input === 'q') {
          onBack();
          return;
        }
      }
      if (key.upArrow || input === 'K') setScroll((s) => Math.max(0, s - 1));
      if (key.downArrow || input === 'J') setScroll((s) => s + 1);
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
      { flexDirection: 'column', paddingX: 2, paddingY: 1 },
      h(Box, null, h(Spinner, { type: 'dots' }), h(Text, null, ' Loading…'))
    );
  }

  const d = detail || job;
  const state = d.state || job.state;
  const loc = formatLocation(d.location, d.remote);
  const sal = formatSalary(d.salary, d.salary_usd);

  const lines = [];

  // Title
  lines.push({ text: d.title || job.title, bold: true, color: 'white' });
  lines.push({ text: `at ${d.company || job.company}`, color: 'cyan' });
  lines.push({ text: '' });

  // Meta as key-value pairs
  const meta = [
    ['📍 Location', loc],
    ['💰 Salary', sal],
    ['📋 Type', d.type || '—'],
    ['📊 Experience', d.experience || '—'],
    ['📅 Posted', d.posted_at || '—'],
    [
      '🎯 Match',
      typeof d.similarity === 'number' ? `${d.similarity.toFixed(3)}` : '—',
    ],
  ];
  if (d.rerank_score) meta.push(['🧠 AI Score', `${d.rerank_score}/10`]);
  if (d.combined_score) meta.push(['📈 Combined', d.combined_score.toFixed(3)]);
  meta.push(['📌 Status', state ? `${stateIcon(state)} ${state}` : 'unmarked']);

  for (const [label, value] of meta) {
    lines.push({ text: `  ${label.padEnd(14)} ${value}` });
  }
  lines.push({ text: '' });

  if (d.url || job.url) {
    lines.push({ text: `  🔗 ${d.url || job.url}`, color: 'blue' });
    lines.push({ text: '' });
  }

  // Skills
  if (d.skills?.length) {
    lines.push({ text: 'Skills', bold: true, color: 'yellow' });
    const skillNames = d.skills.map((s) => s.name || s).join('  ·  ');
    lines.push({ text: `  ${skillNames}` });
    lines.push({ text: '' });
  }

  // Description
  if (d.description) {
    lines.push({ text: 'Description', bold: true, color: 'yellow' });
    for (const l of d.description.split('\n')) {
      lines.push({ text: `  ${l}` });
    }
    lines.push({ text: '' });
  }

  // Qualifications
  if (d.qualifications?.length) {
    lines.push({ text: 'Qualifications', bold: true, color: 'yellow' });
    for (const q of d.qualifications) {
      lines.push({ text: `  • ${q}` });
    }
    lines.push({ text: '' });
  }

  // Responsibilities
  if (d.responsibilities?.length) {
    lines.push({ text: 'Responsibilities', bold: true, color: 'yellow' });
    for (const r of d.responsibilities) {
      lines.push({ text: `  • ${r}` });
    }
    lines.push({ text: '' });
  }

  const maxRows = Math.max((process.stdout.rows || 30) - (isPanel ? 6 : 8), 8);
  const visible = lines.slice(scroll, scroll + maxRows);
  const hasMore = lines.length > maxRows;

  return h(
    Box,
    { flexDirection: 'column', paddingX: 2, paddingY: isPanel ? 0 : 1 },
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
    hasMore
      ? h(
          Text,
          { dimColor: true },
          `  J/K scroll detail (${scroll + 1}–${Math.min(
            scroll + maxRows,
            lines.length
          )}/${lines.length})`
        )
      : null
  );
}
