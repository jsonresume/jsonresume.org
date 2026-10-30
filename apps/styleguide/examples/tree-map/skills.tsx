'use client';

import {
  GraphControls,
  GraphNodeCard,
  GraphOverlay,
  GraphRegion,
  layoutTree,
  Text,
  treeCone,
  TreeMap,
  type TreeLayoutEdge,
  type TreeMapHandle,
  type TreeMapNode,
  type TreeTone,
} from '@jsonresume/ui';
import { useMemo, useRef, useState } from 'react';

// Skills at the bottom, work that used them above, roles they lead to on top.
const items: { id: string; tone: TreeTone; detail: string }[] = [
  { id: 'TypeScript', tone: 'success', detail: 'On your resume' },
  { id: 'React', tone: 'success', detail: 'On your resume' },
  { id: 'Postgres', tone: 'success', detail: 'On your resume' },
  {
    id: 'Kubernetes',
    tone: 'attention',
    detail: 'Asked for; not on your resume',
  },
  { id: 'Editor app', tone: 'success', detail: 'Listium, 2016 to 2018' },
  { id: 'Exchange', tone: 'success', detail: 'Blockbid, 2018 to 2020' },
  { id: 'Platform engineer', tone: 'open', detail: '12 open jobs' },
  {
    id: 'Founding engineer',
    tone: 'closable',
    detail: '26 open jobs, one skill away',
  },
];
const rests: [string, string][] = [
  ['TypeScript', 'Editor app'],
  ['React', 'Editor app'],
  ['TypeScript', 'Exchange'],
  ['Postgres', 'Exchange'],
  ['Exchange', 'Platform engineer'],
  ['Kubernetes', 'Platform engineer'],
  ['Editor app', 'Founding engineer'],
  ['Exchange', 'Founding engineer'],
];

// Wide enough apart that every name fits at first sight.
const SPACING = 120;

export default function TreeMapSkills() {
  const map = useRef<TreeMapHandle>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const { nodes, edges, bands } = useMemo(() => {
    const edges: TreeLayoutEdge[] = rests.map(([from, to]) => ({
      from,
      to,
      strength: 'strong',
    }));
    const layout = layoutTree(
      items.map((i) => i.id),
      edges,
      { spacing: SPACING }
    );
    const nodes: TreeMapNode[] = items.map((item, i) => {
      const placed = layout.nodes[i];
      return {
        id: item.id,
        label: item.id,
        detail: item.detail,
        tone: item.tone,
        x: placed?.x ?? 0,
        y: placed?.y ?? 0,
        level: placed?.level ?? 0,
        support: placed?.support ?? 0,
      };
    });
    return {
      nodes,
      edges: layout.edges.map((e) => ({ from: e.from, to: e.to })),
      bands: layout.bands,
    };
  }, []);
  // Choosing a node lights everything beneath it.
  const traced = useMemo(
    () =>
      selected === null
        ? null
        : treeCone(selected, edges, 'down', nodes.length),
    [selected, edges, nodes.length]
  );
  const node = selected === null ? null : nodes[selected];
  return (
    <GraphRegion
      label="Skills, work and roles"
      description="Each square rests on those below it. Select one to trace what it rests on."
      height="24rem"
    >
      <TreeMap
        ref={map}
        nodes={nodes}
        edges={edges}
        bands={bands}
        bandLabel={(b) => ['Skills', 'Work', 'Roles'][b.level] ?? ''}
        selected={selected}
        onSelect={setSelected}
        focus={traced?.nodes ?? null}
        lit={traced?.edges ?? null}
        spacing={SPACING}
        label="Skills, work and roles"
      />
      <GraphOverlay corner="top-end">
        <GraphControls
          onZoomIn={() => map.current?.zoomBy(1.5)}
          onZoomOut={() => map.current?.zoomBy(1 / 1.5)}
          onFit={() => map.current?.fit()}
        />
      </GraphOverlay>
      {node ? (
        <GraphOverlay corner="top-start">
          <GraphNodeCard label="Selected">
            <Text weight="semibold">{node.label}</Text>
            <Text size="xs" tone="muted">
              {node.detail}
            </Text>
          </GraphNodeCard>
        </GraphOverlay>
      ) : null}
    </GraphRegion>
  );
}
