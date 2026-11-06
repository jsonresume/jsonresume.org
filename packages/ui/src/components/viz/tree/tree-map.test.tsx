import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { layoutTree } from './layout';
import { emphasisFlags } from './scene-build';
import { EDGE_LIT, NODE_DIM, NODE_SELECTED } from './render-types';
import { TreeMap } from './tree-map';
import type { TreeMapEdge, TreeMapHandle, TreeMapNode } from './types';

const ids = ['TypeScript', 'React', 'Frontend lead'];
const layout = layoutTree(ids, [
  { from: 'TypeScript', to: 'React', strength: 'strong' },
  { from: 'React', to: 'Frontend lead', strength: 'strong' },
]);
const nodes: TreeMapNode[] = ids.map((id, i) => {
  const placed = layout.nodes[i];
  return {
    id,
    label: id,
    detail: i === 2 ? 'A role resting on both' : undefined,
    tone: i === 2 ? 'attention' : 'success',
    x: placed?.x ?? 0,
    y: placed?.y ?? 0,
    level: placed?.level ?? 0,
    support: placed?.support ?? 0,
  };
});
const edges: TreeMapEdge[] = layout.edges.map((e) => ({
  from: e.from,
  to: e.to,
}));

describe('TreeMap', () => {
  // jsdom has no canvas: the map falls back to Canvas 2D, which draws nothing here.
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });
  afterEach(() => vi.restoreAllMocks());

  it('is a labelled, focusable map that selects with the keyboard, and passes axe', async () => {
    const onSelect = vi.fn();
    const ref = createRef<TreeMapHandle>();
    const { container } = render(
      <div>
        <TreeMap
          ref={ref}
          nodes={nodes}
          edges={edges}
          bands={layout.bands}
          bandLabel={(b) => `Level ${b.level}`}
          selected={null}
          onSelect={onSelect}
          label="Skills and roles"
        />
      </div>
    );
    const map = screen.getByRole('application', { name: 'Skills and roles' });
    expect(map).toHaveAttribute('tabindex', '0');
    expect(map).toHaveAttribute('data-renderer', 'canvas');
    fireEvent.keyDown(map, { key: 'Escape' });
    expect(onSelect).toHaveBeenCalledWith(null);
    expect(ref.current?.camera()).not.toBeUndefined();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('dims what is out of focus, rings the selection, lights traced edges', () => {
    const flags = emphasisFlags(
      nodes,
      edges,
      { focus: new Set([0, 1]), lit: new Set([0]) },
      1,
      -1
    );
    expect(flags.node[2]).toBe(NODE_DIM);
    expect((flags.node[1] ?? 0) & NODE_SELECTED).toBe(NODE_SELECTED);
    expect(flags.edge[0]).toBe(EDGE_LIT);
  });
});
