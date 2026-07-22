import { Box, Text } from 'ink';
import { h } from './h.js';
import {
  stateIcon,
  truncate,
  formatSalary,
  formatLocation,
  formatAge,
} from '../formatters.js';
import { GAP } from './jobListLayout.js';
import { tierOf, tierChip } from './tierHelpers.js';

// Dim gray band separator between tier groups, e.g. "── Strong matches ──".
export function TierSeparator({ label }) {
  return h(
    Box,
    { paddingX: 1 },
    h(Text, { color: 'gray', dimColor: true }, `── ${label} ──`)
  );
}

// Score column cell: numeric score, or a compact tier chip when tiers exist.
function scoreCell(props, selected, score, chip) {
  if (!chip) return h(Text, { ...props, dimColor: !selected }, score);
  return h(
    Text,
    {
      ...props,
      color: selected ? 'white' : chip.color,
      dimColor: !selected && chip.dim,
    },
    chip.char
  );
}

export default function JobRow({
  job,
  selected,
  hasRerank,
  hasTiers,
  titleW,
  compW,
  locW,
  marked,
  compact,
  dossierStatus,
}) {
  const loc = formatLocation(job.location, job.remote);
  const sal = formatSalary(job.salary, job.salary_usd);
  // Display the score the list is actually ordered by (server decay/rerank
  // blend), falling back for older servers that only send similarity.
  const sortScore =
    job.score ?? job.combined_score ?? job.decayed_similarity ?? job.similarity;
  const score = typeof sortScore === 'number' ? sortScore.toFixed(2) : '—';
  const chip = hasTiers ? tierChip(tierOf(job)) : null;
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
        scoreCell(props, selected, score, chip)
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
      scoreCell(props, selected, score, chip)
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
