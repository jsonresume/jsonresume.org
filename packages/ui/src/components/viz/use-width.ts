'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The rendered width of an element, measured after mount and on resize.
 * Starts at `initial`, so server and first client render agree.
 */
export function useWidth<T extends HTMLElement>(initial: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () => setWidth(Math.max(120, Math.round(el.clientWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}
