import { describe, it, expect, vi } from 'vitest';
import { processGraphData } from './dataProcessing';

vi.mock('../constants/graphConfig', () => ({
  GRAPH_CONFIG: { nodeSizeScale: 3 },
}));

const graph = {
  nodes: [
    { id: 'Developer', group: 0, count: 3, usernames: ['a', 'b', 'c'] },
    { id: 'Designer', group: 1, count: 1, usernames: ['d'] },
  ],
  links: [{ source: 'Developer', target: 'Designer', value: 0.8 }],
};

describe('processGraphData', () => {
  it('sizes nodes by member count', () => {
    const { nodes } = processGraphData(graph);

    expect(nodes[0].size).toBeCloseTo(Math.log(4) * 3);
    expect(nodes[1].size).toBeCloseTo(Math.log(2) * 3);
  });

  it('assigns a color to each node and keeps its data', () => {
    const { nodes } = processGraphData(graph);

    nodes.forEach((node, i) => {
      expect(node.color).toMatch(/^hsl\(/);
      expect(node).toMatchObject(graph.nodes[i]);
    });
  });

  it('passes links through unchanged', () => {
    expect(processGraphData(graph).links).toEqual(graph.links);
  });
});
