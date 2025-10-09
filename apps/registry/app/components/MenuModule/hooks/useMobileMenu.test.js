import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobileMenu } from './useMobileMenu';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test-path'),
}));

describe('useMobileMenu', () => {
  it('initializes with menu closed', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(result.current.isOpen).toBe(false);
  });

  it('provides setIsOpen function', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(typeof result.current.setIsOpen).toBe('function');
  });

  it('can open menu', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('can close menu', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('can toggle menu state', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('returns correct structure', () => {
    const { result } = renderHook(() => useMobileMenu());

    expect(result.current).toHaveProperty('isOpen');
    expect(result.current).toHaveProperty('setIsOpen');
    expect(typeof result.current.isOpen).toBe('boolean');
    expect(typeof result.current.setIsOpen).toBe('function');
  });
});
