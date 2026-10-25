import { describe, expect, it } from 'vitest';
import { MAX_ROWS, NotFoundError, toVector } from './index.js';

describe('toVector', () => {
  it('serializes an array', () => {
    expect(toVector([0.1, -2, 3])).toBe('[0.1,-2,3]');
  });

  it('passes a vector string through', () => {
    expect(toVector('[1,2]')).toBe('[1,2]');
  });
});

describe('NotFoundError', () => {
  it('carries the PostgREST code callers check', () => {
    expect(new NotFoundError().code).toBe('PGRST116');
  });
});

it('keeps the PostgREST row cap', () => {
  expect(MAX_ROWS).toBe(5000);
});
