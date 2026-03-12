import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { h } from './h.js';

const FILTER_TYPES = [
  { type: 'remote', label: 'Remote only', hasValue: false },
  {
    type: 'search',
    label: 'Keyword search',
    hasValue: true,
    placeholder: 'e.g. react, python',
  },
  {
    type: 'minSalary',
    label: 'Minimum salary ($k)',
    hasValue: true,
    placeholder: 'e.g. 150',
  },
  {
    type: 'days',
    label: 'Posted within (days)',
    hasValue: true,
    placeholder: 'e.g. 14',
  },
];

export default function FilterManager({ filterState, onUpdate, onClose }) {
  const [mode, setMode] = useState('list'); // list | add | edit
  const [cursor, setCursor] = useState(0);
  const [addCursor, setAddCursor] = useState(0);
  const [editValue, setEditValue] = useState('');
  const [editIdx, setEditIdx] = useState(-1);

  const active = filterState.active || [];

  useInput(
    (input, key) => {
      if (mode === 'list') {
        if (key.escape) {
          onClose();
          return;
        }
        if (key.upArrow || input === 'k') setCursor((c) => Math.max(0, c - 1));
        if (key.downArrow || input === 'j')
          setCursor((c) => Math.min(active.length - 1, c + 1));
        if (input === 'a') {
          setMode('add');
          setAddCursor(0);
          return;
        }
        if (input === 'd' && active[cursor]) {
          const next = [...active];
          next.splice(cursor, 1);
          onUpdate({ ...filterState, active: next });
          setCursor((c) => Math.min(c, next.length - 1));
          return;
        }
        if (key.return && active[cursor]?.hasValue !== false) {
          setEditIdx(cursor);
          setEditValue(String(active[cursor]?.value || ''));
          setMode('edit');
        }
      }

      if (mode === 'add') {
        if (key.escape) {
          setMode('list');
          return;
        }
        if (key.upArrow) setAddCursor((c) => Math.max(0, c - 1));
        if (key.downArrow)
          setAddCursor((c) => Math.min(FILTER_TYPES.length - 1, c + 1));
        if (key.return) {
          const ft = FILTER_TYPES[addCursor];
          if (!ft.hasValue) {
            // Toggle filter (e.g. remote)
            const exists = active.findIndex((f) => f.type === ft.type);
            if (exists >= 0) {
              const next = [...active];
              next.splice(exists, 1);
              onUpdate({ ...filterState, active: next });
            } else {
              onUpdate({
                ...filterState,
                active: [...active, { type: ft.type, value: true }],
              });
            }
            setMode('list');
          } else {
            setEditIdx(-1);
            setEditValue('');
            setMode('editNew');
          }
        }
      }
    },
    { isActive: mode === 'list' || mode === 'add' }
  );

  // Edit mode for existing filter
  if (mode === 'edit') {
    const filter = active[editIdx];
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'yellow',
        padding: 1,
        marginX: 2,
      },
      h(Text, { bold: true, color: 'yellow' }, `Edit: ${filter.type}`),
      h(
        Box,
        { marginTop: 1 },
        h(Text, null, 'Value: '),
        h(TextInput, {
          value: editValue,
          onChange: setEditValue,
          onSubmit: (val) => {
            const next = [...active];
            next[editIdx] = {
              ...next[editIdx],
              value:
                filter.type === 'minSalary' || filter.type === 'days'
                  ? parseInt(val) || val
                  : val,
            };
            onUpdate({ ...filterState, active: next });
            setMode('list');
          },
        })
      ),
      h(
        Text,
        { dimColor: true, marginTop: 1 },
        'Enter to save, Ctrl+C to cancel'
      )
    );
  }

  // Edit mode for new filter
  if (mode === 'editNew') {
    const ft = FILTER_TYPES[addCursor];
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'green',
        padding: 1,
        marginX: 2,
      },
      h(Text, { bold: true, color: 'green' }, `New filter: ${ft.label}`),
      h(
        Box,
        { marginTop: 1 },
        h(Text, null, 'Value: '),
        h(TextInput, {
          value: editValue,
          placeholder: ft.placeholder || '',
          onChange: setEditValue,
          onSubmit: (val) => {
            if (val.trim()) {
              const value =
                ft.type === 'minSalary' || ft.type === 'days'
                  ? parseInt(val) || val
                  : val;
              onUpdate({
                ...filterState,
                active: [...active, { type: ft.type, value, hasValue: true }],
              });
            }
            setMode('list');
          },
        })
      ),
      h(
        Text,
        { dimColor: true, marginTop: 1 },
        `${ft.placeholder || ''}  Enter to save`
      )
    );
  }

  // Add mode - pick filter type
  if (mode === 'add') {
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'green',
        padding: 1,
        marginX: 2,
      },
      h(Text, { bold: true, color: 'green' }, 'Add Filter'),
      h(Text, null, ''),
      ...FILTER_TYPES.map((ft, i) => {
        const selected = i === addCursor;
        const isActive = active.some((f) => f.type === ft.type);
        return h(
          Box,
          { key: ft.type },
          h(
            Text,
            {
              inverse: selected,
              color: isActive ? 'green' : selected ? 'white' : undefined,
            },
            `${selected ? '▸ ' : '  '}${ft.label}${isActive ? ' ✓' : ''}`
          )
        );
      }),
      h(Text, { dimColor: true, marginTop: 1 }, 'enter:select  esc:back')
    );
  }

  // List mode - show active filters
  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'double',
      borderColor: 'yellow',
      padding: 1,
      marginX: 2,
    },
    h(Text, { bold: true, color: 'yellow' }, '⚙  Filter Manager'),
    h(Text, null, ''),
    active.length === 0
      ? h(Text, { dimColor: true }, 'No active filters. Press a to add one.')
      : null,
    ...active.map((f, i) => {
      const selected = i === cursor;
      const label =
        f.type === 'remote'
          ? 'Remote only'
          : f.type === 'search'
          ? `Search: "${f.value}"`
          : f.type === 'minSalary'
          ? `Salary ≥ $${f.value}k`
          : f.type === 'days'
          ? `Posted within ${f.value} days`
          : `${f.type}: ${f.value}`;
      return h(
        Box,
        { key: i },
        h(
          Text,
          {
            inverse: selected,
            color: selected ? 'white' : 'yellow',
          },
          `${selected ? '▸ ' : '  '}${label}`
        )
      );
    }),
    h(Text, null, ''),
    h(Text, { dimColor: true }, 'a:add  d:delete  enter:edit  esc:close')
  );
}
