import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { h } from './h.js';
import JobList from './JobList.js';

// Inline find-as-you-type bar shown under the list view.
export function InlineSearch({ query, onChange, onSubmit }) {
  return h(
    Box,
    { paddingX: 1, gap: 1 },
    h(Text, { color: 'yellow', bold: true }, 'Find:'),
    h(TextInput, { value: query, onChange, onSubmit }),
    h(Text, { dimColor: true }, '  Enter to apply, Esc to clear')
  );
}

// Compact job list used as the left pane of the split-pane views.
function leftPane(listProps) {
  return h(
    Box,
    {
      flexDirection: 'column',
      width: '40%',
      borderStyle: 'single',
      borderColor: 'gray',
      borderRight: true,
      borderLeft: false,
      borderTop: false,
      borderBottom: false,
    },
    h(JobList, { ...listProps, compact: true, reservedRows: 8 })
  );
}

/**
 * Two-column layout: compact job list on the left, an arbitrary right pane.
 * Used by both the detail and AI/dossier views.
 *
 * @param {object} p
 * @param {any} p.header        rendered header element
 * @param {any} p.statusBar     rendered status bar element
 * @param {object} p.listProps  props forwarded to the left-pane JobList
 * @param {any} p.right         rendered right-pane element
 */
export function SplitPane({ header, statusBar, listProps, right }) {
  return h(
    Box,
    { flexDirection: 'column', height: process.stdout.rows || 40 },
    header,
    h(
      Box,
      { flexGrow: 1, flexDirection: 'row' },
      leftPane(listProps),
      h(Box, { flexDirection: 'column', width: '60%' }, right)
    ),
    statusBar
  );
}
