import { describe, it, expect } from 'vitest';
import { getPageNumbers } from './paginationUtils';

describe('getPageNumbers', () => {
  it('returns all page numbers when total pages <= 7', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns single page for totalPages = 1', () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });

  it('shows ellipsis when total pages > 7', () => {
    const result = getPageNumbers(5, 10);
    expect(result).toContain('...');
  });

  it('shows first page and ellipsis when current page is near start', () => {
    const result = getPageNumbers(1, 10);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(10);
    expect(result).toContain('...');
  });

  it('shows last page and ellipsis when current page is near end', () => {
    const result = getPageNumbers(10, 10);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(10);
    expect(result).toContain('...');
  });

  it('shows surrounding pages when current page is in middle', () => {
    const result = getPageNumbers(5, 10);
    expect(result).toContain(4); // Current - 1
    expect(result).toContain(5); // Current
    expect(result).toContain(6); // Current + 1
  });

  it('shows correct pattern for page 1 of 10', () => {
    const result = getPageNumbers(1, 10);
    expect(result).toEqual([1, 2, '...', 10]);
  });

  it('shows correct pattern for page 2 of 10', () => {
    const result = getPageNumbers(2, 10);
    expect(result).toEqual([1, 2, 3, '...', 10]);
  });

  it('shows correct pattern for page 3 of 10', () => {
    const result = getPageNumbers(3, 10);
    expect(result).toEqual([1, 2, 3, 4, '...', 10]);
  });

  it('shows correct pattern for page 4 of 10', () => {
    const result = getPageNumbers(4, 10);
    expect(result).toEqual([1, '...', 3, 4, 5, '...', 10]);
  });

  it('shows correct pattern for page 5 of 10', () => {
    const result = getPageNumbers(5, 10);
    expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('shows correct pattern for page 6 of 10', () => {
    const result = getPageNumbers(6, 10);
    expect(result).toEqual([1, '...', 5, 6, 7, '...', 10]);
  });

  it('shows correct pattern for page 7 of 10', () => {
    const result = getPageNumbers(7, 10);
    expect(result).toEqual([1, '...', 6, 7, 8, '...', 10]);
  });

  it('shows correct pattern for page 8 of 10', () => {
    const result = getPageNumbers(8, 10);
    expect(result).toEqual([1, '...', 7, 8, 9, 10]);
  });

  it('shows correct pattern for page 9 of 10', () => {
    const result = getPageNumbers(9, 10);
    expect(result).toEqual([1, '...', 8, 9, 10]);
  });

  it('shows correct pattern for page 10 of 10', () => {
    const result = getPageNumbers(10, 10);
    expect(result).toEqual([1, '...', 9, 10]);
  });

  it('handles large total pages correctly', () => {
    const result = getPageNumbers(50, 100);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(100);
    expect(result).toContain(49);
    expect(result).toContain(50);
    expect(result).toContain(51);
  });

  it('handles edge case of 2 total pages', () => {
    expect(getPageNumbers(1, 2)).toEqual([1, 2]);
    expect(getPageNumbers(2, 2)).toEqual([1, 2]);
  });

  it('always includes first and last page when > 7 pages', () => {
    for (let currentPage = 1; currentPage <= 20; currentPage++) {
      const result = getPageNumbers(currentPage, 20);
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(20);
    }
  });
});
