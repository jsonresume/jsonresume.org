import { describe, it, expect } from 'vitest';
import {
  buildVisibilityNodes,
  buildVisibleGraph,
  nodeToPreferenceMap,
} from './decisionGraph';
import { NODE_IDS } from '../config/decisionTree';

const findNode = (nodes, id) => nodes.find((n) => n.id === id);

describe('nodeToPreferenceMap', () => {
  it('maps the optional decision nodes and omits always-on ones', () => {
    expect(nodeToPreferenceMap[NODE_IDS.CORE]).toBe('skills');
    expect(nodeToPreferenceMap[NODE_IDS.EXP]).toBe('experience');
    expect(nodeToPreferenceMap[NODE_IDS.SAL]).toBe('salary');
    // WR + AVAIL are always enabled → not in the map
    expect(nodeToPreferenceMap[NODE_IDS.WR]).toBeUndefined();
    expect(nodeToPreferenceMap[NODE_IDS.AVAIL]).toBeUndefined();
  });
});

describe('buildVisibilityNodes', () => {
  it('shows everything by default (no preferences)', () => {
    const nodes = buildVisibilityNodes();
    expect(nodes.every((n) => n.hidden === false)).toBe(true);
  });

  it('hides a node when its preference is explicitly disabled', () => {
    const nodes = buildVisibilityNodes({ salary: { enabled: false } });
    expect(findNode(nodes, NODE_IDS.SAL).hidden).toBe(true);
    // unrelated mapped node stays visible
    expect(findNode(nodes, NODE_IDS.CORE).hidden).toBe(false);
  });

  it('keeps a node visible when enabled is true or undefined', () => {
    expect(
      findNode(
        buildVisibilityNodes({ salary: { enabled: true } }),
        NODE_IDS.SAL
      ).hidden
    ).toBe(false);
    expect(
      findNode(buildVisibilityNodes({ salary: {} }), NODE_IDS.SAL).hidden
    ).toBe(false);
  });

  it('always shows the root regardless of preferences', () => {
    const nodes = buildVisibilityNodes({ skills: { enabled: false } });
    expect(findNode(nodes, NODE_IDS.ROOT).hidden).toBe(false);
  });
});

describe('buildVisibleGraph', () => {
  it('returns laid-out nodes and edges with transition styles', () => {
    const { nodes, edges } = buildVisibleGraph();
    expect(nodes.length).toBeGreaterThan(0);
    expect(edges.length).toBeGreaterThan(0);
    expect(
      nodes.every((n) => n.style?.transition === 'all 0.3s ease-in-out')
    ).toBe(true);
    expect(
      edges.every((e) => e.style?.transition === 'all 0.3s ease-in-out')
    ).toBe(true);
  });

  it('does not mutate the shared initial nodes (returns fresh objects)', () => {
    const a = buildVisibleGraph();
    const b = buildVisibleGraph({ salary: { enabled: false } });
    expect(findNode(a.nodes, NODE_IDS.SAL).hidden).toBe(false);
    expect(findNode(b.nodes, NODE_IDS.SAL).hidden).toBe(true);
  });
});
