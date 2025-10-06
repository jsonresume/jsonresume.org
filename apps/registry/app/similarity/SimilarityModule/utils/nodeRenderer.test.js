import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderNode } from './nodeRenderer';

// Mock GRAPH_CONFIG
vi.mock('../constants/graphConfig', () => ({
  GRAPH_CONFIG: {
    colors: {
      highlighted: '#ff0000',
    },
  },
}));

describe('renderNode', () => {
  let mockCtx;
  let mockNode;
  let highlightNodes;

  beforeEach(() => {
    // Create mock canvas context
    mockCtx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
    };

    // Create mock node
    mockNode = {
      id: 'Developer',
      x: 100,
      y: 100,
      size: 10,
      color: '#0000ff',
      count: 5,
    };

    highlightNodes = new Set();
  });

  it('renders node circle with correct size and color', () => {
    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 40, 0, 2 * Math.PI);
    expect(mockCtx.fillStyle).toBe('#0000ff');
    expect(mockCtx.fill).toHaveBeenCalled();
  });

  it('renders highlighted node with different color', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // fillStyle changes multiple times, but initially set to highlighted color
    // After rendering, it's set to #000 for text
    expect(mockCtx.fillStyle).toBe('#000'); // final value after text rendering
  });

  it('scales node size based on globalScale', () => {
    renderNode(mockNode, mockCtx, 2, highlightNodes);

    // size = 10 * (4 / max(1, 2)) = 10 * 2 = 20
    expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 20, 0, 2 * Math.PI);
  });

  it('handles very high globalScale values', () => {
    renderNode(mockNode, mockCtx, 10, highlightNodes);

    // size = 10 * (4 / max(1, 10)) = 10 * 0.4 = 4
    expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 4, 0, 2 * Math.PI);
  });

  it('does not render label for non-highlighted nodes', () => {
    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
    expect(mockCtx.measureText).not.toHaveBeenCalled();
  });

  it('renders label for highlighted nodes', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // Should render label text
    // size = 10 * (4 / 1) = 40
    // fontSize = max(14, 40 * 1.5) = 60
    // bckgDimensions[1] = 60 + 60 * 0.2 = 72
    // y position = 100 - 72 * 1.5 = 100 - 108 = -8
    expect(mockCtx.measureText).toHaveBeenCalledWith('Developer');
    expect(mockCtx.fillText).toHaveBeenCalledWith('Developer', 100, -8);
  });

  it('renders count for highlighted nodes', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // Should render count "(5)"
    // bckgDimensions[1] = 72, y = 100 - 72 = 28
    expect(mockCtx.fillText).toHaveBeenCalledWith('(5)', 100, 28);
  });

  it('renders label background for highlighted nodes', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.fillRect).toHaveBeenCalled();
    // fillStyle ends as '#000' after all rendering, but was 'rgba(255, 255, 255, 0.9)' for background
    expect(mockCtx.fillStyle).toBe('#000');
  });

  it('calculates font size based on node size', () => {
    mockNode.size = 20;
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // size = 20 * (4 / 1) = 80
    // fontSize = max(14, 80 * 1.5) = 120
    // But then smallerFont = 120 * 0.7 = 84 is set last
    expect(mockCtx.font).toContain('84px');
  });

  it('uses minimum font size of 14px', () => {
    mockNode.size = 2;
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // size = 2 * (4 / 1) = 8
    // fontSize = max(14, 8 * 1.5) = max(14, 12) = 14
    // smallerFont = 14 * 0.7 = 9.8 (but with floating point = 9.799999999999999)
    expect(mockCtx.font).toContain('9.79');
  });

  it('sets text alignment and baseline for labels', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.textAlign).toBe('center');
    expect(mockCtx.textBaseline).toBe('middle');
  });

  it('handles nodes with long labels', () => {
    mockNode.id = 'Senior Full-Stack Software Engineer';
    mockCtx.measureText.mockReturnValue({ width: 300 });
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.measureText).toHaveBeenCalledWith(
      'Senior Full-Stack Software Engineer'
    );
    // size = 40, fontSize = 60, bckgDimensions[1] = 72, y = 100 - 108 = -8
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'Senior Full-Stack Software Engineer',
      100,
      -8
    );
  });

  it('handles nodes with zero count', () => {
    mockNode.count = 0;
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.fillText).toHaveBeenCalledWith('(0)', 100, 28);
  });

  it('handles nodes at negative coordinates', () => {
    mockNode.x = -50;
    mockNode.y = -50;

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    expect(mockCtx.arc).toHaveBeenCalledWith(-50, -50, 40, 0, 2 * Math.PI);
  });

  it('renders multiple fill operations for highlighted nodes', () => {
    highlightNodes.add(mockNode);

    renderNode(mockNode, mockCtx, 1, highlightNodes);

    // Should fill: circle, background, and text (2 texts actually)
    expect(mockCtx.fill).toHaveBeenCalledTimes(1); // Circle fill
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(1); // Background
    expect(mockCtx.fillText).toHaveBeenCalledTimes(2); // Label + count
  });
});
