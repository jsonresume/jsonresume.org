'use client';

import { Button, RouteProgress } from '@jsonresume/ui';
import { useState } from 'react';

export default function ProgressRoute() {
  const [active, setActive] = useState(false);
  const load = (ms: number) => {
    setActive(true);
    setTimeout(() => setActive(false), ms);
  };
  return (
    <>
      <RouteProgress active={active} />
      <Button variant="secondary" onClick={() => load(2500)}>
        A slow page (watch the top)
      </Button>
      <Button variant="ghost" onClick={() => load(80)}>
        A fast page (no bar)
      </Button>
    </>
  );
}
