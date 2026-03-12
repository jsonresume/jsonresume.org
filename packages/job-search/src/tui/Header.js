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
  appliedQuery,
}) {
  const tabElements = tabs.map((t) => {
    const active = t === tab;
    const count = counts[t] || 0;
    const label = `${tabLabels[t]} (${count})`;
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
        ` ${label} `
      )
    );
  });

  const filterTags = (filters || []).map((f, i) => {
    const label = FILTER_LABELS[f.type]?.(f) || `${f.type}: ${f.value}`;
    return h(Text, { key: i, color: 'yellow' }, ` [${label}] `);
  });

  const hasFilters = filterTags.length > 0 || appliedQuery;

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
      h(Text, { dimColor: true }, 'tab:sections  /:searches  ?:help')
    ),
    h(Box, { paddingX: 1, gap: 0 }, ...tabElements),
    hasFilters
      ? h(
          Box,
          { paddingX: 1 },
          filterTags.length > 0
            ? h(Text, { dimColor: true }, 'Filters:')
            : null,
          ...filterTags,
          appliedQuery
            ? h(Text, { color: 'yellow' }, ` [Find: "${appliedQuery}"] `)
            : null,
          h(Text, { dimColor: true }, '  f:manage')
        )
      : h(
          Box,
          { paddingX: 1 },
          h(
            Text,
            { dimColor: true },
            'No filters active  f:add  n:quick search'
          )
        )
  );
}
