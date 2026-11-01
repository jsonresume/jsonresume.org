'use client';

import {
  GraphRegion,
  layoutTree,
  Stack,
  treeCone,
  TreeLegend,
  TreeMap,
  type TreeMapNode,
  type TreeTone,
} from '@jsonresume/ui';
import { useMemo, useState } from 'react';

// Each row means one thing, so levels are given rather than worked out.
const LEVELS = ['Skills', 'Experience', 'Kinds of role', 'Jobs'];
// Wide enough apart that most names fit; the rest end in an ellipsis.
const SPACING = 132;

const items: [id: string, level: number, tone: TreeTone, detail: string][] = [
  ['TypeScript', 0, 'success', 'Eight years, in four roles'],
  ['React', 0, 'success', 'Editor app, Exchange'],
  ['Postgres', 0, 'success', 'Exchange'],
  ['Rust', 0, 'success', 'Compiler side project'],
  ['LLM evaluation', 0, 'success', 'Agents platform'],
  ['Kubernetes', 0, 'attention', 'Three jobs ask for it'],
  ['Go', 0, 'attention', 'Two jobs ask for it'],
  ['Editor app', 1, 'closable', 'Listium, 2016 to 2018'],
  ['Exchange', 1, 'closable', 'Blockbid, 2018 to 2020'],
  ['Agents platform', 1, 'closable', 'Since 2023'],
  ['Platform engineer', 2, 'open', '412 open roles'],
  ['AI engineer', 2, 'open', '268 open roles'],
  ['Full-stack engineer', 2, 'open', '903 open roles'],
  ['LiveKit', 3, 'success', 'Ready now: 92% fit'],
  ['Tether', 3, 'closable', 'One skill away: Kubernetes'],
  ['Railway', 3, 'active', 'Applied'],
  ['Sourcegraph', 3, 'closable', 'One skill away: Go'],
  ['Acme Ads', 3, 'danger', 'Not interested'],
];
const rests: [string, string][] = [
  ['TypeScript', 'Editor app'],
  ['React', 'Editor app'],
  ['TypeScript', 'Exchange'],
  ['Postgres', 'Exchange'],
  ['LLM evaluation', 'Agents platform'],
  ['Rust', 'Agents platform'],
  ['Exchange', 'Platform engineer'],
  ['Kubernetes', 'Platform engineer'],
  ['Agents platform', 'AI engineer'],
  ['Editor app', 'Full-stack engineer'],
  ['Exchange', 'Full-stack engineer'],
  ['AI engineer', 'LiveKit'],
  ['Platform engineer', 'Tether'],
  ['Kubernetes', 'Tether'],
  ['Full-stack engineer', 'Railway'],
  ['AI engineer', 'Sourcegraph'],
  ['Go', 'Sourcegraph'],
  ['Full-stack engineer', 'Acme Ads'],
];

export default function TreeMapLevels() {
  const [selected, setSelected] = useState<number | null>(null);
  const { nodes, edges, bands } = useMemo(() => {
    const layout = layoutTree(
      items.map(([id]) => id),
      rests.map(([from, to]) => ({ from, to, strength: 'strong' as const })),
      { spacing: SPACING, levels: items.map(([, level]) => level) }
    );
    const nodes: TreeMapNode[] = items.map(([id, , tone, detail], i) => ({
      id,
      label: id,
      detail,
      tone,
      x: layout.nodes[i]?.x ?? 0,
      y: layout.nodes[i]?.y ?? 0,
      level: layout.nodes[i]?.level ?? 0,
      support: layout.nodes[i]?.support ?? 0,
    }));
    return { nodes, edges: layout.edges, bands: layout.bands };
  }, []);
  const traced = useMemo(
    () =>
      selected === null
        ? null
        : treeCone(selected, edges, 'down', nodes.length),
    [selected, edges, nodes.length]
  );
  return (
    <Stack gap={3} align="stretch">
      <TreeLegend
        items={[
          { tone: 'success', label: 'Shown on the resume, or ready now' },
          { tone: 'attention', label: 'Asked for, not shown yet' },
          { tone: 'closable', label: 'Experience; one step away' },
          { tone: 'active', label: 'Applied' },
          { tone: 'danger', label: 'Not interested' },
          { tone: 'open', label: 'Open' },
        ]}
      />
      <GraphRegion
        label="A career, by what it rests on"
        description="Rows are fixed: skills, experience, kinds of role, jobs."
        height="26rem"
      >
        <TreeMap
          nodes={nodes}
          edges={edges}
          bands={bands}
          bandLabel={(b) => LEVELS[b.level] ?? ''}
          selected={selected}
          onSelect={setSelected}
          focus={traced?.nodes ?? null}
          lit={traced?.edges ?? null}
          spacing={SPACING}
          label="A career, by what it rests on"
        />
      </GraphRegion>
    </Stack>
  );
}
