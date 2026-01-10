import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLayoutedElements } from './graphLayout';

// Suppress console.log during tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('graphLayout - Tree Structure', () => {
  // Helper to create a node
  const makeNode = (id, isResume = false) => ({
    id,
    data: { isResume },
    position: { x: 0, y: 0 },
  });

  // Helper to create an edge (source = parent, target = child)
  const makeEdge = (source, target) => ({
    id: `e-${source}-${target}`,
    source,
    target,
  });

  describe('Resume positioning', () => {
    it('places resume at y=0 (top)', () => {
      const nodes = [makeNode('resume', true), makeNode('job1')];
      const edges = [makeEdge('resume', 'job1')];

      const { nodes: result } = getLayoutedElements(nodes, edges);
      const resume = result.find((n) => n.id === 'resume');

      expect(resume.position.y).toBe(0);
    });

    it('centers resume horizontally', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('job1'),
        makeNode('job2'),
      ];
      const edges = [makeEdge('resume', 'job1'), makeEdge('resume', 'job2')];

      const { nodes: result } = getLayoutedElements(nodes, edges);
      const resume = result.find((n) => n.id === 'resume');

      // Resume should be centered around x=0 (with offset for node width)
      expect(resume.position.x).toBeCloseTo(-100, 0); // NODE_WIDTH/2 = 100
    });
  });

  describe('Parent-child relationships', () => {
    it('places children below their parent', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('job1'),
        makeNode('job2'),
      ];
      const edges = [makeEdge('resume', 'job1'), makeEdge('resume', 'job2')];

      const { nodes: result } = getLayoutedElements(nodes, edges);
      const resume = result.find((n) => n.id === 'resume');
      const job1 = result.find((n) => n.id === 'job1');
      const job2 = result.find((n) => n.id === 'job2');

      expect(job1.position.y).toBeGreaterThan(resume.position.y);
      expect(job2.position.y).toBeGreaterThan(resume.position.y);
    });

    it('places siblings at the same y level', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('job1'),
        makeNode('job2'),
        makeNode('job3'),
      ];
      const edges = [
        makeEdge('resume', 'job1'),
        makeEdge('resume', 'job2'),
        makeEdge('resume', 'job3'),
      ];

      const { nodes: result } = getLayoutedElements(nodes, edges);
      const job1 = result.find((n) => n.id === 'job1');
      const job2 = result.find((n) => n.id === 'job2');
      const job3 = result.find((n) => n.id === 'job3');

      expect(job1.position.y).toBe(job2.position.y);
      expect(job2.position.y).toBe(job3.position.y);
    });
  });

  describe('Multi-level tree', () => {
    it('creates correct 3-level hierarchy (resume -> primary -> secondary)', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('primary1'),
        makeNode('primary2'),
        makeNode('secondary1'),
        makeNode('secondary2'),
      ];
      const edges = [
        makeEdge('resume', 'primary1'),
        makeEdge('resume', 'primary2'),
        makeEdge('primary1', 'secondary1'),
        makeEdge('primary2', 'secondary2'),
      ];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const pos = {};
      result.forEach((n) => (pos[n.id] = n.position));

      // Level 0: resume at y=0
      expect(pos.resume.y).toBe(0);

      // Level 1: primaries below resume
      expect(pos.primary1.y).toBeGreaterThan(pos.resume.y);
      expect(pos.primary2.y).toBe(pos.primary1.y);

      // Level 2: secondaries below primaries
      expect(pos.secondary1.y).toBeGreaterThan(pos.primary1.y);
      expect(pos.secondary2.y).toBe(pos.secondary1.y);
    });

    it('handles deep chains (5 levels)', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('L1'),
        makeNode('L2'),
        makeNode('L3'),
        makeNode('L4'),
      ];
      const edges = [
        makeEdge('resume', 'L1'),
        makeEdge('L1', 'L2'),
        makeEdge('L2', 'L3'),
        makeEdge('L3', 'L4'),
      ];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const pos = {};
      result.forEach((n) => (pos[n.id] = n.position));

      expect(pos.resume.y).toBe(0);
      expect(pos.L1.y).toBeGreaterThan(pos.resume.y);
      expect(pos.L2.y).toBeGreaterThan(pos.L1.y);
      expect(pos.L3.y).toBeGreaterThan(pos.L2.y);
      expect(pos.L4.y).toBeGreaterThan(pos.L3.y);
    });
  });

  describe('Realistic pathways graph (20 primaries + secondaries)', () => {
    it('correctly positions 20 primary jobs under resume', () => {
      const nodes = [makeNode('resume', true)];
      const edges = [];

      // 20 primary jobs
      for (let i = 1; i <= 20; i++) {
        nodes.push(makeNode(`p${i}`));
        edges.push(makeEdge('resume', `p${i}`));
      }

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const resume = result.find((n) => n.id === 'resume');
      const primaries = result.filter((n) => n.id.startsWith('p'));

      // Resume at top
      expect(resume.position.y).toBe(0);

      // All primaries at same level, below resume
      const firstPrimaryY = primaries[0].position.y;
      expect(firstPrimaryY).toBeGreaterThan(resume.position.y);

      primaries.forEach((p) => {
        expect(p.position.y).toBe(firstPrimaryY);
      });
    });

    it('positions secondary jobs under their primary parent', () => {
      const nodes = [makeNode('resume', true)];
      const edges = [];

      // 3 primary jobs
      for (let i = 1; i <= 3; i++) {
        nodes.push(makeNode(`p${i}`));
        edges.push(makeEdge('resume', `p${i}`));
      }

      // 2 secondary jobs under each primary
      for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 2; j++) {
          nodes.push(makeNode(`p${i}s${j}`));
          edges.push(makeEdge(`p${i}`, `p${i}s${j}`));
        }
      }

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const pos = {};
      result.forEach((n) => (pos[n.id] = n.position));

      // Resume at top
      expect(pos.resume.y).toBe(0);

      // Primaries at level 1
      const primaryY = pos.p1.y;
      expect(primaryY).toBeGreaterThan(0);

      // Secondaries at level 2
      const secondaryY = pos.p1s1.y;
      expect(secondaryY).toBeGreaterThan(primaryY);

      // All secondaries at same y level
      expect(pos.p1s2.y).toBe(secondaryY);
      expect(pos.p2s1.y).toBe(secondaryY);
      expect(pos.p3s1.y).toBe(secondaryY);
    });
  });

  describe('Edge cases', () => {
    it('handles empty input', () => {
      const { nodes, edges } = getLayoutedElements([], []);
      expect(nodes).toEqual([]);
      expect(edges).toEqual([]);
    });

    it('attaches orphan nodes to resume', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('connected'),
        makeNode('orphan'), // No incoming edge
      ];
      const edges = [makeEdge('resume', 'connected')];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const connected = result.find((n) => n.id === 'connected');
      const orphan = result.find((n) => n.id === 'orphan');

      // Orphan should be at same level as connected (treated as resume's child)
      expect(orphan.position.y).toBe(connected.position.y);
    });

    it('does not crash with cycles', () => {
      const nodes = [makeNode('resume', true), makeNode('a'), makeNode('b')];
      const edges = [
        makeEdge('resume', 'a'),
        makeEdge('a', 'b'),
        makeEdge('b', 'a'), // Cycle!
      ];

      expect(() => getLayoutedElements(nodes, edges)).not.toThrow();
    });

    it('handles no resume node gracefully', () => {
      const nodes = [makeNode('job1'), makeNode('job2')];
      const edges = [makeEdge('job1', 'job2')];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      // Should still produce valid positions
      expect(result[0].position).toBeDefined();
      expect(result[1].position).toBeDefined();
    });
  });

  describe('Children centering', () => {
    it('centers single child under parent', () => {
      const nodes = [makeNode('resume', true), makeNode('child')];
      const edges = [makeEdge('resume', 'child')];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const resume = result.find((n) => n.id === 'resume');
      const child = result.find((n) => n.id === 'child');

      // Both should be centered (roughly same x, accounting for width)
      const resumeCenter = resume.position.x + 100;
      const childCenter = child.position.x + 100;

      expect(Math.abs(resumeCenter - childCenter)).toBeLessThan(10);
    });

    it('spreads multiple children horizontally', () => {
      const nodes = [
        makeNode('resume', true),
        makeNode('left'),
        makeNode('right'),
      ];
      const edges = [makeEdge('resume', 'left'), makeEdge('resume', 'right')];

      const { nodes: result } = getLayoutedElements(nodes, edges);

      const left = result.find((n) => n.id === 'left');
      const right = result.find((n) => n.id === 'right');

      // Left should be to the left of right
      expect(left.position.x).toBeLessThan(right.position.x);
    });
  });
});
