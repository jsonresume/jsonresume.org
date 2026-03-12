import { Box, Text } from 'ink';
import { h } from './h.js';

const FILTER_LABELS = {
  remote: (f) => `Remote: ${f.value}`,
  search: (f) => `Search: "${f.value}"`,
  minSalary: (f) => `Salary ≥ $${f.value}k`,
  days: (f) => `Last ${f.value} days`,
};

export default function Header({
  tab,
  tabs,
  tabLabels,
  counts,
  filters,
  searchName,
}) {
  const tabElements = tabs.map((t) => {
    const active = t === tab;
    const label = `${tabLabels[t]} (${counts[t] || 0})`;
    return h(
      Box,
      { key: t, marginRight: 1 },
      h(
        Text,
        {
          bold: active,
          color: active ? 'cyan' : 'gray',
          underline: active,
        },
        active ? ` ${label} ` : ` ${label} `
      )
    );
  });

  const filterTags = (filters || []).map((f, i) => {
    const label = FILTER_LABELS[f.type]?.(f) || `${f.type}: ${f.value}`;
    return h(Text, { key: i, color: 'yellow' }, ` [${label}] `);
  });

  return h(
    Box,
    { flexDirection: 'column', marginBottom: 0 },
    h(
      Box,
      {
        paddingX: 1,
        borderStyle: 'single',
        borderColor: 'cyan',
        borderBottom: false,
      },
      h(Text, { bold: true, color: 'cyan' }, '⚡ '),
      h(Text, { bold: true, color: 'white' }, 'JSON Resume Job Search'),
      searchName ? h(Text, { color: 'magenta' }, `  🔍 ${searchName}`) : null,
      h(Text, { color: 'gray' }, '  '),
      h(Text, { dimColor: true }, 'tab:sections  /:searches')
    ),
    h(Box, { paddingX: 1, gap: 0 }, ...tabElements),
    filterTags.length > 0
      ? h(
          Box,
          { paddingX: 1 },
          h(Text, { dimColor: true }, 'Filters:'),
          ...filterTags,
          h(Text, { dimColor: true }, '  f:manage')
        )
      : h(
          Box,
          { paddingX: 1 },
          h(Text, { dimColor: true }, 'No filters active  f:add filters')
        )
  );
}
