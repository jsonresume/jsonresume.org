import { Box, Text } from 'ink';
import { h } from './h.js';

const FILTER_LABELS = {
  remote: () => 'Remote',
  search: (f) => `"${f.value}"`,
  minSalary: (f) => `≥$${f.value}k`,
  days: (f) => `${f.value}d`,
};

export default function Header({
  tab,
  tabs,
  tabLabels,
  counts,
  filters,
  searchName,
  appliedQuery,
}) {
  const cols = process.stdout.columns || 80;

  // ── Title row ─────────────────────────────────────
  const titleRow = h(
    Box,
    { paddingX: 1, justifyContent: 'space-between' },
    h(
      Box,
      { gap: 1 },
      h(
        Text,
        { bold: true, color: 'black', backgroundColor: 'cyan' },
        ' jsonresume-jobs '
      ),
      searchName
        ? h(Text, { color: 'magenta', bold: true }, `  ${searchName}`)
        : null
    ),
    h(Text, { dimColor: true }, '?:help  /:profiles  f:filters  q:quit')
  );

  // ── Tab row ───────────────────────────────────────
  const tabElements = tabs.map((t) => {
    const active = t === tab;
    const count = counts[t] || 0;
    if (count === 0 && !active && t !== 'all') return null;

    const label = `${tabLabels[t]} ${count}`;

    if (active) {
      return h(
        Box,
        { key: t, marginRight: 1 },
        h(
          Text,
          { bold: true, color: 'black', backgroundColor: 'white' },
          ` ${label} `
        )
      );
    }
    return h(
      Box,
      { key: t, marginRight: 1 },
      h(Text, { dimColor: true }, ` ${label} `)
    );
  });

  const tabRow = h(Box, { paddingX: 1 }, ...tabElements.filter(Boolean));

  // ── Filter pills (only if active) ────────────────
  const tags = [];
  for (const f of filters || []) {
    const label = FILTER_LABELS[f.type]?.(f) || f.value;
    tags.push(
      h(
        Text,
        { key: f.type, color: 'black', backgroundColor: 'yellow' },
        ` ${label} `
      )
    );
  }
  if (appliedQuery) {
    tags.push(
      h(
        Text,
        { key: 'find', color: 'black', backgroundColor: 'green' },
        ` find:${appliedQuery} `
      )
    );
  }

  const filterRow =
    tags.length > 0 ? h(Box, { paddingX: 1, gap: 1 }, ...tags) : null;

  // ── Divider ───────────────────────────────────────
  const divider = h(
    Box,
    { paddingX: 1 },
    h(Text, { dimColor: true }, '─'.repeat(Math.max(10, cols - 2)))
  );

  return h(
    Box,
    { flexDirection: 'column' },
    titleRow,
    tabRow,
    filterRow,
    divider
  );
}
