import { describe, it, expect } from 'vitest';
import {
  getNodeBackground,
  getEdgeStyle,
  getLuminance,
  needsLightText,
} from './colorUtils';

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
    const salaryRange = { min: 50000, max: 100000, p5: 50000, p95: 100000 };

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
      salaryRange: { min: 0, max: 100000, p5: 0, p95: 100000 },
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
    const salaryRange = { min: 50000, max: 100000, p5: 50000, p95: 100000 };

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

  it('clamps outliers to percentile range for gradient', () => {
    const node = { id: 'job1', data: {} };
    // Salary range with outlier: most salaries 50-80k, but max is 500k
    const salaryRange = { min: 50000, max: 500000, p5: 50000, p95: 80000 };

    // Outlier at 500k should clamp to p95 (80k) for gradient calculation
    const outlierColor = getNodeBackground({
      node,
      jobData: { salary: '500000' },
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // Should be the darkest blue (clamped to p95)
    const p95Color = getNodeBackground({
      node,
      jobData: { salary: '80000' },
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // Both should be the same color (both at max of gradient range)
    expect(outlierColor).toBe(p95Color);
  });

  it('distributes gradient across percentile range not full range', () => {
    const node = { id: 'job1', data: {} };
    // Range with outliers: p5=50k, p95=80k, but actual min/max are 30k/500k
    const salaryRange = { min: 30000, max: 500000, p5: 50000, p95: 80000 };

    // 65k is exactly middle of p5-p95 range
    const middleSalaryColor = getNodeBackground({
      node,
      jobData: { salary: '65000' },
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // With linear interpolation at 50%, should be mid-blue
    // lightBlue = [219, 234, 254], darkBlue = [30, 64, 175]
    // At 50%: r = 219 + (30-219)*0.5 = 125, g = 234 + (64-234)*0.5 = 149, b = 254 + (175-254)*0.5 = 215
    expect(middleSalaryColor).toBe('rgb(125, 149, 215)');
  });

  it('falls back to min/max when percentiles are not provided', () => {
    const node = { id: 'job1', data: {} };
    const salaryRange = { min: 50000, max: 100000 }; // No p5/p95

    const result = getNodeBackground({
      node,
      jobData: { salary: '75000' },
      username: 'test',
      readJobs: new Set(),
      showSalaryGradient: true,
      salaryRange,
      filterText: '',
      filteredNodes: new Set(),
    });

    // Should still work, falling back to min/max
    expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });
});

describe('getLuminance', () => {
  it('returns 0 for black', () => {
    expect(getLuminance(0, 0, 0)).toBe(0);
  });

  it('returns 1 for white', () => {
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 2);
  });

  it('returns mid-range luminance for gray', () => {
    const luminance = getLuminance(128, 128, 128);
    expect(luminance).toBeGreaterThan(0.2);
    expect(luminance).toBeLessThan(0.3);
  });

  it('returns higher luminance for bright colors', () => {
    const yellow = getLuminance(255, 255, 0);
    const darkBlue = getLuminance(30, 64, 175);
    expect(yellow).toBeGreaterThan(darkBlue);
  });
});

describe('needsLightText', () => {
  it('returns false for white background', () => {
    expect(needsLightText('white')).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(needsLightText(null)).toBe(false);
    expect(needsLightText(undefined)).toBe(false);
  });

  it('returns false for light blue (low salary)', () => {
    // bg-blue-100: rgb(219, 234, 254)
    expect(needsLightText('rgb(219, 234, 254)')).toBe(false);
  });

  it('returns true for dark blue (high salary)', () => {
    // bg-blue-800: rgb(30, 64, 175)
    expect(needsLightText('rgb(30, 64, 175)')).toBe(true);
  });

  it('returns false for yellow background', () => {
    // Default job color: rgb(255, 241, 143)
    expect(needsLightText('rgb(255, 241, 143)')).toBe(false);
  });

  it('handles hex colors', () => {
    expect(needsLightText('#ffffff')).toBe(false);
    expect(needsLightText('#000000')).toBe(true);
    expect(needsLightText('#1e40af')).toBe(true); // Dark blue
  });

  it('returns true for mid-range blues that are still dark', () => {
    // Test threshold - mid-gradient blues
    // rgb(125, 149, 215) has luminance ~0.31, below 0.4 threshold
    const midBlue = 'rgb(125, 149, 215)';
    const result = needsLightText(midBlue);
    // Mid-blue needs light text since luminance < 0.4
    expect(result).toBe(true);
  });

  it('returns false for light gray (read jobs)', () => {
    expect(needsLightText('#f1f5f9')).toBe(false);
  });
});
