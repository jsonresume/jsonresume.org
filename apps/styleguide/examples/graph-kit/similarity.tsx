'use client';

import {
  GraphControls,
  GraphLegend,
  GraphNodeCard,
  GraphOverlay,
  GraphRegion,
  Text,
} from '@jsonresume/ui';
import { vars } from '@jsonresume/ui/tokens';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useState } from 'react';
import * as styles from './similarity.css';

const nodes = [
  { id: 'you', x: 300, y: 160, label: 'Your resume', you: true },
  { id: 'a', x: 190, y: 90, label: 'Senior Engineer · Stripe' },
  { id: 'b', x: 420, y: 110, label: 'Platform Engineer · Fly.io' },
  { id: 'c', x: 230, y: 250, label: 'Staff Frontend · Vercel' },
  { id: 'd', x: 440, y: 240, label: 'Data Engineer · Airbnb' },
];

// The kit frames any graph engine; here a static SVG stands in for it.
export default function GraphKitSimilarity() {
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>('a');
  const node = nodes.find((n) => n.id === selected);
  return (
    <GraphRegion
      label="Job similarity graph"
      description="Jobs closer to your resume are more similar. Select a job for details."
      height="22rem"
    >
      <svg
        viewBox="0 0 600 340"
        className={styles.canvas}
        style={assignInlineVars({ [styles.zoom]: String(zoom) })}
      >
        {nodes.slice(1).map((n) => (
          <line
            key={n.id}
            x1={300}
            y1={160}
            x2={n.x}
            y2={n.y}
            className={styles.edge}
          />
        ))}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.you ? 14 : 10}
            className={n.you ? styles.you : styles.job}
            data-selected={selected === n.id}
            tabIndex={n.you ? undefined : 0}
            role={n.you ? undefined : 'button'}
            aria-label={n.you ? undefined : n.label}
            onClick={() => !n.you && setSelected(n.id)}
            onKeyDown={(e) => e.key === 'Enter' && !n.you && setSelected(n.id)}
          />
        ))}
      </svg>
      <GraphOverlay corner="top-end">
        <GraphControls
          onZoomIn={() => setZoom((z) => Math.min(z + 0.25, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
          onFit={() => setZoom(1)}
        />
      </GraphOverlay>
      <GraphOverlay corner="bottom-start">
        <GraphLegend
          items={[
            { label: 'Your resume', color: vars.color.action.primary },
            { label: 'Job', color: vars.color.action.ink },
            {
              label: 'Similarity',
              color: vars.color.border.strong,
              shape: 'line',
            },
          ]}
        />
      </GraphOverlay>
      {node ? (
        <GraphOverlay corner="top-start">
          <GraphNodeCard label="Selected job">
            <Text weight="semibold">{node.label}</Text>
            <Text size="xs" tone="muted">
              87% similar to your resume
            </Text>
          </GraphNodeCard>
        </GraphOverlay>
      ) : null}
    </GraphRegion>
  );
}
