import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { h } from './h.js';

export default function SearchManager({
  searches,
  activeSearchId,
  onSwitch,
  onCreate,
  onDelete,
  onClose,
}) {
  const [mode, setMode] = useState('list'); // list | create-name | create-prompt
  const [cursor, setCursor] = useState(0);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);

  // All options: default + saved searches
  const options = [
    { id: null, name: 'Default (my resume)', prompt: null },
    ...searches,
  ];

  useInput(
    (input, key) => {
      if (mode !== 'list') return;
      if (key.escape) {
        onClose();
        return;
      }
      if (key.upArrow || input === 'k') setCursor((c) => Math.max(0, c - 1));
      if (key.downArrow || input === 'j')
        setCursor((c) => Math.min(options.length - 1, c + 1));
      if (key.return) {
        const opt = options[cursor];
        onSwitch(opt.id);
        onClose();
        return;
      }
      if (input === 'n') {
        setName('');
        setPrompt('');
        setMode('create-name');
        return;
      }
      if (input === 'd' && cursor > 0) {
        const opt = options[cursor];
        onDelete(opt.id);
        setCursor((c) => Math.min(c, options.length - 2));
        return;
      }
    },
    { isActive: mode === 'list' }
  );

  if (creating) {
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'magenta',
        padding: 1,
        marginX: 2,
      },
      h(
        Box,
        null,
        h(Spinner, { type: 'dots' }),
        h(
          Text,
          { color: 'magenta' },
          ' Creating search profile... (AI is blending your resume with the prompt)'
        )
      )
    );
  }

  if (mode === 'create-name') {
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'green',
        padding: 1,
        marginX: 2,
      },
      h(Text, { bold: true, color: 'green' }, 'New Search Profile'),
      h(Text, { dimColor: true, marginTop: 1 }, 'Give it a short name:'),
      h(
        Box,
        { marginTop: 1 },
        h(Text, null, 'Name: '),
        h(TextInput, {
          value: name,
          placeholder: 'e.g. Rockets in Texas',
          onChange: setName,
          onSubmit: (val) => {
            if (val.trim()) {
              setName(val.trim());
              setMode('create-prompt');
            }
          },
        })
      ),
      h(
        Text,
        { dimColor: true, marginTop: 1 },
        'Enter to continue, Ctrl+C to cancel'
      )
    );
  }

  if (mode === 'create-prompt') {
    return h(
      Box,
      {
        flexDirection: 'column',
        borderStyle: 'double',
        borderColor: 'green',
        padding: 1,
        marginX: 2,
      },
      h(Text, { bold: true, color: 'green' }, `New Search: ${name}`),
      h(
        Text,
        { dimColor: true, marginTop: 1 },
        "Describe what you're looking for. AI will blend this with your resume:"
      ),
      h(
        Box,
        { marginTop: 1 },
        h(Text, null, 'Search: '),
        h(TextInput, {
          value: prompt,
          placeholder:
            'e.g. I want to work on rockets or space tech, preferably in Texas',
          onChange: setPrompt,
          onSubmit: async (val) => {
            if (val.trim()) {
              setCreating(true);
              await onCreate(name, val.trim());
              setCreating(false);
              setMode('list');
            }
          },
        })
      ),
      h(
        Text,
        { dimColor: true, marginTop: 1 },
        'Enter to create, Ctrl+C to cancel'
      )
    );
  }

  // List mode
  return h(
    Box,
    {
      flexDirection: 'column',
      borderStyle: 'double',
      borderColor: 'magenta',
      padding: 1,
      marginX: 2,
    },
    h(Text, { bold: true, color: 'magenta' }, '🔍 Search Profiles'),
    h(
      Text,
      { dimColor: true },
      'Each profile uses a different embedding to rank jobs differently'
    ),
    h(Text, null, ''),
    ...options.map((opt, i) => {
      const selected = i === cursor;
      const isActive = opt.id === activeSearchId;
      const label = opt.id
        ? `${opt.name}  ${isActive ? '◀ active' : ''}`
        : `${opt.name}  ${isActive ? '◀ active' : ''}`;
      const detail = opt.prompt ? `    "${opt.prompt}"` : '';

      return h(
        Box,
        { key: opt.id || 'default', flexDirection: 'column' },
        h(
          Text,
          {
            inverse: selected,
            color: isActive ? 'green' : selected ? 'white' : undefined,
          },
          `${selected ? '▸ ' : '  '}${label}`
        ),
        detail && !selected ? h(Text, { dimColor: true }, detail) : null
      );
    }),
    h(Text, null, ''),
    h(
      Text,
      { dimColor: true },
      'enter:switch  n:new search  d:delete  esc:close'
    )
  );
}
