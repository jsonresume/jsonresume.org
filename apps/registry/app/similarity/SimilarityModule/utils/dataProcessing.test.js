import { describe, it, expect, vi } from 'vitest';
import {
  groupByPosition,
  createNodes,
  createLinks,
  processGraphData,
} from './dataProcessing';

// Mock dependencies
vi.mock('../../../utils/vectorUtils', () => ({
  cosineSimilarity: vi.fn((a, b) => {
    // Simple mock: return 0.8 for similar vectors, 0.5 otherwise
    if (a[0] === b[0]) return 0.8;
    return 0.5;
  }),
  getAverageEmbedding: vi.fn((embeddings) => {
    // Simple mock: return the first embedding as average
    return embeddings[0];
  }),
}));

vi.mock('../constants/graphConfig', () => ({
  GRAPH_CONFIG: {
    nodeSizeScale: 3,
    similarityThreshold: 0.7,
  },
}));

describe('groupByPosition', () => {
  it('groups items by position', () => {
    const data = [
      { position: 'Developer', username: 'user1' },
      { position: 'Developer', username: 'user2' },
      { position: 'Designer', username: 'user3' },
    ];

    const result = groupByPosition(data);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result['Developer']).toHaveLength(2);
    expect(result['Designer']).toHaveLength(1);
  });

  it('handles single position', () => {
    const data = [
      { position: 'Engineer', username: 'user1' },
      { position: 'Engineer', username: 'user2' },
    ];

    const result = groupByPosition(data);

    expect(Object.keys(result)).toHaveLength(1);
    expect(result['Engineer']).toHaveLength(2);
  });

  it('handles empty data', () => {
    const result = groupByPosition([]);
    expect(result).toEqual({});
  });

  it('preserves all item properties', () => {
    const data = [
      { position: 'Developer', username: 'user1', embedding: [0.1] },
      { position: 'Developer', username: 'user2', embedding: [0.2] },
    ];

    const result = groupByPosition(data);

    expect(result['Developer'][0]).toEqual(data[0]);
    expect(result['Developer'][1]).toEqual(data[1]);
  });
});

describe('createNodes', () => {
  it('creates nodes from position groups', () => {
    const positionGroups = {
      Developer: [
        { username: 'user1', embedding: [0.1, 0.2] },
        { username: 'user2', embedding: [0.3, 0.4] },
      ],
      Designer: [{ username: 'user3', embedding: [0.5, 0.6] }],
    };

    const result = createNodes(positionGroups);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('Developer');
    expect(result[0].count).toBe(2);
    expect(result[1].id).toBe('Designer');
    expect(result[1].count).toBe(1);
  });

  it('calculates node size based on item count', () => {
    const positionGroups = {
      Developer: [{ username: 'user1', embedding: [0.1] }],
    };

    const result = createNodes(positionGroups);

    // size = Math.log(1 + 1) * 3 = Math.log(2) * 3 ≈ 2.08
    expect(result[0].size).toBeCloseTo(Math.log(2) * 3, 2);
  });

  it('includes usernames array', () => {
    const positionGroups = {
      Developer: [
        { username: 'alice', embedding: [0.1] },
        { username: 'bob', embedding: [0.2] },
      ],
    };

    const result = createNodes(positionGroups);

    expect(result[0].usernames).toEqual(['alice', 'bob']);
  });

  it('includes embeddings array', () => {
    const positionGroups = {
      Developer: [
        { username: 'user1', embedding: [0.1, 0.2] },
        { username: 'user2', embedding: [0.3, 0.4] },
      ],
    };

    const result = createNodes(positionGroups);

    expect(result[0].embeddings).toEqual([
      [0.1, 0.2],
      [0.3, 0.4],
    ]);
  });

  it('assigns unique group indices', () => {
    const positionGroups = {
      Developer: [{ username: 'user1', embedding: [0.1] }],
      Designer: [{ username: 'user2', embedding: [0.2] }],
      Manager: [{ username: 'user3', embedding: [0.3] }],
    };

    const result = createNodes(positionGroups);

    expect(result[0].group).toBe(0);
    expect(result[1].group).toBe(1);
    expect(result[2].group).toBe(2);
  });

  it('assigns color to each node', () => {
    const positionGroups = {
      Developer: [{ username: 'user1', embedding: [0.1] }],
    };

    const result = createNodes(positionGroups);

    expect(result[0].color).toMatch(/^hsl\(\d+(\.\d+)?, 70%, 50%\)$/);
  });
});

describe('createLinks', () => {
  it('creates links between similar nodes', () => {
    const nodes = [
      {
        id: 'Developer',
        embeddings: [[1, 0, 0]],
        avgEmbedding: [1, 0, 0],
      },
      {
        id: 'Engineer',
        embeddings: [[1, 0, 0]], // Same first value, high similarity
        avgEmbedding: [1, 0, 0],
      },
    ];

    const result = createLinks(nodes);

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('Developer');
    expect(result[0].target).toBe('Engineer');
    expect(result[0].value).toBe(0.8); // Mock returns 0.8 for same first value
  });

  it('filters out links below threshold', () => {
    const nodes = [
      {
        id: 'Developer',
        embeddings: [[1, 0, 0]],
        avgEmbedding: [1, 0, 0],
      },
      {
        id: 'Designer',
        embeddings: [[2, 0, 0]], // Different first value, low similarity
        avgEmbedding: [2, 0, 0],
      },
    ];

    const result = createLinks(nodes);

    // 0.5 similarity is below 0.7 threshold
    expect(result).toHaveLength(0);
  });

  it('calculates average similarity for multiple embeddings', () => {
    const nodes = [
      {
        id: 'Developer',
        embeddings: [
          [1, 0, 0],
          [1, 0, 0],
        ],
        avgEmbedding: [1, 0, 0],
      },
      {
        id: 'Engineer',
        embeddings: [
          [1, 0, 0],
          [1, 0, 0],
        ],
        avgEmbedding: [1, 0, 0],
      },
    ];

    const result = createLinks(nodes);

    // Using pre-computed average embeddings
    expect(result[0].value).toBe(0.8);
  });

  it('handles single embedding per node', () => {
    const nodes = [
      { id: 'Dev1', embeddings: [[1, 0, 0]], avgEmbedding: [1, 0, 0] },
      { id: 'Dev2', embeddings: [[1, 0, 0]], avgEmbedding: [1, 0, 0] },
    ];

    const result = createLinks(nodes);

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(0.8);
  });

  it('creates no links for single node', () => {
    const nodes = [
      { id: 'Developer', embeddings: [[0.1, 0.2]], avgEmbedding: [0.1, 0.2] },
    ];

    const result = createLinks(nodes);

    expect(result).toEqual([]);
  });

  it('creates links for all similar node pairs', () => {
    const nodes = [
      { id: 'Dev1', embeddings: [[1, 0]], avgEmbedding: [1, 0] },
      { id: 'Dev2', embeddings: [[1, 0]], avgEmbedding: [1, 0] },
      { id: 'Dev3', embeddings: [[1, 0]], avgEmbedding: [1, 0] },
    ];

    const result = createLinks(nodes);

    // Should create links: Dev1-Dev2, Dev1-Dev3, Dev2-Dev3
    expect(result).toHaveLength(3);
  });

  it('does not create duplicate links', () => {
    const nodes = [
      { id: 'Dev1', embeddings: [[1, 0]], avgEmbedding: [1, 0] },
      { id: 'Dev2', embeddings: [[1, 0]], avgEmbedding: [1, 0] },
    ];

    const result = createLinks(nodes);

    // Only one link, not two
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe('Dev1');
    expect(result[0].target).toBe('Dev2');
  });
});

describe('processGraphData', () => {
  it('processes raw data into graph structure', () => {
    const data = [
      { position: 'Developer', username: 'user1', embedding: [1, 0] },
      { position: 'Developer', username: 'user2', embedding: [1, 0] },
      { position: 'Designer', username: 'user3', embedding: [0, 1] },
    ];

    const result = processGraphData(data);

    expect(result).toHaveProperty('nodes');
    expect(result).toHaveProperty('links');
    expect(result.nodes).toHaveLength(2);
  });

  it('creates complete graph structure', () => {
    const data = [
      { position: 'Engineer', username: 'user1', embedding: [1, 0] },
      { position: 'Engineer', username: 'user2', embedding: [1, 0] },
    ];

    const result = processGraphData(data);

    expect(result.nodes[0].id).toBe('Engineer');
    expect(result.nodes[0].count).toBe(2);
    expect(result.nodes[0].usernames).toEqual(['user1', 'user2']);
  });

  it('handles empty data', () => {
    const result = processGraphData([]);

    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });
});
