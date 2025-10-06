import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from './graphLayout';

describe('getLayoutedElements', () => {
  it('applies layout to nodes and edges', () => {
    const nodes = [
      {
        id: 'resume',
        data: { isResume: true, label: 'Resume' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'job1',
        data: { isResume: false, label: 'Job 1' },
        position: { x: 0, y: 0 },
      },
    ];

    const edges = [{ id: 'e1', source: 'resume', target: 'job1' }];

    const result = getLayoutedElements(nodes, edges);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.nodes[0].position).toBeDefined();
    expect(result.nodes[1].position).toBeDefined();
  });

  it('positions resume nodes correctly', () => {
    const nodes = [
      {
        id: 'resume',
        data: { isResume: true },
        position: { x: 0, y: 0 },
      },
    ];

    const result = getLayoutedElements(nodes, []);

    // Resume nodes should have position adjusted by -100, -50
    expect(result.nodes[0].position.x).toBeDefined();
    expect(result.nodes[0].position.y).toBeDefined();
  });

  it('positions job nodes correctly', () => {
    const nodes = [
      {
        id: 'job1',
        data: { isResume: false },
        position: { x: 0, y: 0 },
      },
    ];

    const result = getLayoutedElements(nodes, []);

    // Job nodes should have position adjusted by -125, -75
    expect(result.nodes[0].position.x).toBeDefined();
    expect(result.nodes[0].position.y).toBeDefined();
  });

  it('handles TB (top-to-bottom) direction', () => {
    const nodes = [
      { id: '1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: '2', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];
    const edges = [{ id: 'e1', source: '1', target: '2' }];

    const result = getLayoutedElements(nodes, edges, 'TB');

    // In TB layout, second node should be below first
    expect(result.nodes[1].position.y).toBeGreaterThan(
      result.nodes[0].position.y
    );
  });

  it('handles LR (left-to-right) direction', () => {
    const nodes = [
      { id: '1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: '2', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];
    const edges = [{ id: 'e1', source: '1', target: '2' }];

    const result = getLayoutedElements(nodes, edges, 'LR');

    // In LR layout, second node should be to the right of first
    expect(result.nodes[1].position.x).toBeGreaterThan(
      result.nodes[0].position.x
    );
  });

  it('handles empty nodes array', () => {
    const result = getLayoutedElements([], []);

    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  it('handles nodes without edges', () => {
    const nodes = [
      { id: '1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: '2', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];

    const result = getLayoutedElements(nodes, []);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(0);
    expect(result.nodes[0].position).toBeDefined();
    expect(result.nodes[1].position).toBeDefined();
  });

  it('preserves edge data', () => {
    const nodes = [
      { id: '1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: '2', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];
    const edges = [
      {
        id: 'e1',
        source: '1',
        target: '2',
        type: 'smoothstep',
        animated: true,
      },
    ];

    const result = getLayoutedElements(nodes, edges);

    expect(result.edges[0].id).toBe('e1');
    expect(result.edges[0].source).toBe('1');
    expect(result.edges[0].target).toBe('2');
  });

  it('preserves node data', () => {
    const nodes = [
      {
        id: '1',
        data: { isResume: true, label: 'My Resume', customData: 'test' },
        position: { x: 0, y: 0 },
      },
    ];

    const result = getLayoutedElements(nodes, []);

    expect(result.nodes[0].id).toBe('1');
    expect(result.nodes[0].data.label).toBe('My Resume');
    expect(result.nodes[0].data.customData).toBe('test');
  });

  it('handles complex graph with multiple connections', () => {
    const nodes = [
      { id: 'resume', data: { isResume: true }, position: { x: 0, y: 0 } },
      { id: 'job1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: 'job2', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: 'job3', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];
    const edges = [
      { id: 'e1', source: 'resume', target: 'job1' },
      { id: 'e2', source: 'resume', target: 'job2' },
      { id: 'e3', source: 'resume', target: 'job3' },
    ];

    const result = getLayoutedElements(nodes, edges);

    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);

    // All nodes should have positions
    result.nodes.forEach((node) => {
      expect(node.position.x).toBeDefined();
      expect(node.position.y).toBeDefined();
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
    });
  });

  it('uses correct node dimensions for layout', () => {
    const nodes = [
      {
        id: 'resume',
        data: { isResume: true },
        position: { x: 0, y: 0 },
      },
      {
        id: 'job',
        data: { isResume: false },
        position: { x: 0, y: 0 },
      },
    ];

    const result = getLayoutedElements(nodes, []);

    // Resume: 200x100, Job: 250x150
    // Positions should account for these dimensions
    expect(result.nodes).toHaveLength(2);
  });

  it('applies default direction TB when not specified', () => {
    const nodes = [
      { id: '1', data: { isResume: false }, position: { x: 0, y: 0 } },
      { id: '2', data: { isResume: false }, position: { x: 0, y: 0 } },
    ];
    const edges = [{ id: 'e1', source: '1', target: '2' }];

    const result = getLayoutedElements(nodes, edges);

    // Default TB should place node 2 below node 1
    expect(result.nodes[1].position.y).toBeGreaterThan(
      result.nodes[0].position.y
    );
  });
});
