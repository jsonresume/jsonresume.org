import { describe, it, expect } from 'vitest';
import { getNodeBackground, getEdgeStyle } from './colorUtils';

describe('getEdgeStyle', () => {
  it('returns default style when no pathEdges', () => {
    const edge = { id: 'edge1' };

    const result = getEdgeStyle(edge, null);

    expect(result).toEqual({ stroke: '#94a3b8', strokeWidth: 2 });
  });

  it('returns default style when pathEdges is empty', () => {
    const edge = { id: 'edge1' };
    const pathEdges = new Set();

    const result = getEdgeStyle(edge, pathEdges);

    expect(result).toEqual({ stroke: '#94a3b8', strokeWidth: 2 });
  });

  it('returns highlighted style when edge is in path', () => {
    const edge = { id: 'edge1' };
    const pathEdges = new Set(['edge1', 'edge2']);

    const result = getEdgeStyle(edge, pathEdges);

    expect(result).toEqual({ stroke: '#3b82f6', strokeWidth: 2 });
  });

  it('returns default style when edge is not in path', () => {
    const edge = { id: 'edge1' };
    const pathEdges = new Set(['edge2', 'edge3']);

    const result = getEdgeStyle(edge, pathEdges);

    expect(result).toEqual({ stroke: '#94a3b8', strokeWidth: 2 });
  });
});

describe('getNodeBackground', () => {
  it('returns white for resume nodes', () => {
    const node = { id: '1', data: { isResume: true } };

    const result = getNodeBackground({
      node,
      jobData: null,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: false,
      salaryRange: { min: 0, max: 100000 },
      filterText: '',
      filteredNodes: new Set(),
    });

    expect(result).toBe('white');
  });

  it('returns gray for read jobs', () => {
    const node = { id: 'job1', data: {} };
    const readJobs = new Set(['test_job1']);

    const result = getNodeBackground({
      node,
      jobData: null,
      username: 'test',
      readJobs,
      showSalaryGradient: false,
      salaryRange: { min: 0, max: 100000 },
      filterText: '',
      filteredNodes: new Set(),
    });

    expect(result).toBe('#f1f5f9');
  });

  it('returns salary gradient when enabled with salary data', () => {
    const node = { id: 'job1', data: {} };
    const jobData = { salary: '75000' };
    const salaryRange = { min: 50000, max: 100000 };

    const result = getNodeBackground({
      node,
      jobData,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // Should return rgb color string
    expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });

  it('returns light gray when salary gradient enabled but no salary', () => {
    const node = { id: 'job1', data: {} };
    const jobData = { salary: null };

    const result = getNodeBackground({
      node,
      jobData,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange: { min: 0, max: 100000 },
      filterText: '',
      filteredNodes: new Set(),
    });

    expect(result).toBe('#e2e8f0');
  });

  it('returns yellow for unfiltered nodes when no gradient', () => {
    const node = { id: 'job1', data: {} };

    const result = getNodeBackground({
      node,
      jobData: null,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: false,
      salaryRange: { min: 0, max: 100000 },
      filterText: '',
      filteredNodes: new Set(),
    });

    expect(result).toBe('rgb(255 241 143)');
  });

  it('returns gray for nodes not in filter results', () => {
    const node = { id: 'job1', data: {} };
    const filteredNodes = new Set(['job2']);

    const result = getNodeBackground({
      node,
      jobData: null,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: false,
      salaryRange: { min: 0, max: 100000 },
      filterText: 'search',
      filteredNodes,
    });

    expect(result).toBe('#f1f5f9');
  });

  it('returns yellow for nodes in filter results', () => {
    const node = { id: 'job1', data: {} };
    const filteredNodes = new Set(['job1']);

    const result = getNodeBackground({
      node,
      jobData: null,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: false,
      salaryRange: { min: 0, max: 100000 },
      filterText: 'search',
      filteredNodes,
    });

    expect(result).toBe('rgb(255 241 143)');
  });

  it('calculates darker blue for higher salaries', () => {
    const node = { id: 'job1', data: {} };
    const jobDataHigh = { salary: '95000' };
    const jobDataLow = { salary: '55000' };
    const salaryRange = { min: 50000, max: 100000 };

    const highSalaryColor = getNodeBackground({
      node,
      jobData: jobDataHigh,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    const lowSalaryColor = getNodeBackground({
      node,
      jobData: jobDataLow,
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // High salary should be darker (lower RGB values for blue gradient)
    expect(highSalaryColor).not.toBe(lowSalaryColor);
  });
});
