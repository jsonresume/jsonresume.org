'use client';

import { useEffect, useState } from 'react';
import { cx } from '../../utils/cx';
import * as s from './route-progress.css';

export interface RouteProgressProps {
  /** True while the next page loads. */
  active: boolean;
  /** How long a load may take before the bar shows, in ms. */
  delay?: number;
  className?: string;
}

type Phase = 'idle' | 'loading' | 'done';

/**
 * A thin bar across the top of the window while a page loads: it shows only
 * for loads slower than `delay`, creeps toward the end, then fills and fades
 * when the page arrives. Decorative: the page that arrives is the news.
 */
export function RouteProgress({
  active,
  delay = 150,
  className,
}: RouteProgressProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setPhase('loading'), delay);
      return () => clearTimeout(timer);
    }
    setPhase((now) => (now === 'loading' ? 'done' : 'idle'));
    return undefined;
  }, [active, delay]);
  return (
    <div
      aria-hidden="true"
      className={cx(s.bar, className)}
      data-phase={phase}
      onTransitionEnd={(event) => {
        if (event.propertyName === 'opacity' && phase === 'done')
          setPhase('idle');
      }}
    />
  );
}
