'use client';

import { useEffect, useState } from 'react';

/**
 * `value` once it has stopped changing for `ms` (typing has paused): for
 * live checks and previews that shouldn't run on every keystroke.
 */
export function useSettledValue<T>(value: T, ms = 400): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}
